#!/usr/bin/env node

/**
 * Upload blog images to Webflow and update collection items
 * 
 * 1. Gets site info from Webflow
 * 2. Uploads each image as an asset to Webflow
 * 3. Updates the blog post's thumbnail and banner fields
 * 
 * Usage: node scripts/upload-images-to-webflow.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBFLOW_API_KEY = '';
const COLLECTION_ID = '68a567bde4ad983dcf18d554';
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

const ASSETS_DIR = path.join(__dirname, 'assets');
const RATE_LIMIT_DELAY = 1500;

async function webflowRequest(endpoint, options = {}) {
  const url = `${WEBFLOW_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webflow API error ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

async function getSiteId() {
  // List all sites and find the one that contains our collection
  const sitesResponse = await webflowRequest('/sites');
  console.log('   Available sites:', sitesResponse.sites?.map(s => `${s.displayName} (${s.id})`).join(', '));
  
  if (sitesResponse.sites && sitesResponse.sites.length > 0) {
    // Use the first site (or we could match by name)
    return sitesResponse.sites[0].id;
  }
  
  throw new Error('No sites found');
}

async function fetchAllBlogs() {
  const items = [];
  let offset = 0;
  
  while (true) {
    const response = await webflowRequest(`/collections/${COLLECTION_ID}/items?limit=100&offset=${offset}`);
    items.push(...response.items);
    if (response.items.length < 100) break;
    offset += 100;
  }
  
  return items;
}

/**
 * Upload an image to Webflow Assets
 */
async function uploadAsset(siteId, filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  
  // Step 1: Request upload URL from Webflow
  const uploadRequest = await webflowRequest(`/sites/${siteId}/assets`, {
    method: 'POST',
    body: JSON.stringify({
      fileName: fileName,
      fileHash: Buffer.from(Date.now().toString() + fileName).toString('base64').substring(0, 32),
    }),
  });
  
  const uploadUrl = uploadRequest.uploadUrl;
  const uploadDetails = uploadRequest.uploadDetails;
  
  // Step 2: Upload to S3
  const formData = new FormData();
  
  // Add upload details first (order matters)
  for (const [key, value] of Object.entries(uploadDetails)) {
    formData.append(key, value);
  }
  
  // Add file last
  const blob = new Blob([fileBuffer], { type: 'image/png' });
  formData.append('file', blob, fileName);
  
  const s3Response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });
  
  if (!s3Response.ok) {
    const errorText = await s3Response.text();
    throw new Error(`S3 upload failed ${s3Response.status}: ${errorText.substring(0, 100)}`);
  }
  
  // Return the hosted URL
  return uploadRequest.hostedUrl || uploadRequest.url;
}

async function updateBlogImages(itemId, imageUrl) {
  return webflowRequest(`/collections/${COLLECTION_ID}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fieldData: {
        thumbnail: imageUrl,
        banner: imageUrl,
      },
    }),
  });
}

async function publishItems(itemIds) {
  for (let i = 0; i < itemIds.length; i += 100) {
    const batch = itemIds.slice(i, i + 100);
    await webflowRequest(`/collections/${COLLECTION_ID}/items/publish`, {
      method: 'POST',
      body: JSON.stringify({ itemIds: batch }),
    });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🖼️  Webflow Image Uploader');
  console.log('==========================\n');
  
  try {
    // Get site ID
    console.log('🔍 Getting site information...');
    const siteId = await getSiteId();
    console.log(`   Using Site ID: ${siteId}\n`);
    
    // Fetch all blogs
    console.log('📥 Fetching blog posts...');
    const blogs = await fetchAllBlogs();
    console.log(`   Found ${blogs.length} blogs\n`);
    
    // Get available images
    const availableImages = new Set(
      fs.readdirSync(ASSETS_DIR)
        .filter(f => f.endsWith('.png'))
        .map(f => f.replace('.png', ''))
    );
    console.log(`📁 Found ${availableImages.size} images in assets folder\n`);
    
    console.log('🚀 Uploading images and updating blogs...\n');
    
    const stats = { updated: [], skipped: [], failed: [] };
    
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const slug = blog.fieldData?.slug;
      const name = blog.fieldData?.name || slug;
      
      if (!slug || !availableImages.has(slug)) {
        stats.skipped.push({ name, reason: 'No matching image' });
        continue;
      }
      
      const imagePath = path.join(ASSETS_DIR, `${slug}.png`);
      const shortName = name.length > 50 ? name.substring(0, 47) + '...' : name;
      
      console.log(`📤 ${i + 1}/${blogs.length}: ${shortName}`);
      
      try {
        // Upload the image
        const imageUrl = await uploadAsset(siteId, imagePath, `${slug}.png`);
        console.log(`   Uploaded: ${imageUrl.substring(0, 60)}...`);
        
        await sleep(RATE_LIMIT_DELAY);
        
        // Update the blog post
        await updateBlogImages(blog.id, imageUrl);
        console.log('   ✅ Updated thumbnail & banner\n');
        
        stats.updated.push(blog.id);
        
        await sleep(RATE_LIMIT_DELAY);
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}\n`);
        stats.failed.push({ name, error: error.message });
        
        // If rate limited, wait longer
        if (error.message.includes('429')) {
          console.log('   ⏳ Rate limited, waiting 10 seconds...\n');
          await sleep(10000);
        }
      }
      
      // Progress every 20 items
      if ((i + 1) % 20 === 0) {
        console.log(`   --- Progress: ${i + 1}/${blogs.length} (${stats.updated.length} updated) ---\n`);
      }
    }
    
    // Publish
    if (stats.updated.length > 0) {
      console.log('📤 Publishing updated items...');
      await publishItems(stats.updated);
      console.log(`   Published ${stats.updated.length} items\n`);
    }
    
    // Summary
    console.log('==========================');
    console.log('📊 SUMMARY');
    console.log('==========================');
    console.log(`Total blogs: ${blogs.length}`);
    console.log(`Updated: ${stats.updated.length}`);
    console.log(`Skipped: ${stats.skipped.length}`);
    console.log(`Failed: ${stats.failed.length}`);
    
    if (stats.failed.length > 0 && stats.failed.length <= 10) {
      console.log('\n❌ Failed items:');
      stats.failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
    }
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();
