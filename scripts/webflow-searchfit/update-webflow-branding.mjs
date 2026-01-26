#!/usr/bin/env node

/**
 * Webflow Collection Branding Update Script
 * 
 * Updates all blog posts in the Webflow collection to replace:
 * - hoook.io → searchfit.ai
 * - Hoook.io → SearchFIT.ai
 * - Hoook → SearchFIT
 * 
 * Usage: node scripts/update-webflow-branding.mjs
 */

const WEBFLOW_API_KEY = '';
const COLLECTION_ID = '68a567bde4ad983dcf18d554';
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const RATE_LIMIT_DELAY = 100;

/**
 * Process HTML content - remove broken embedded images and replace branding
 */
function processHtmlContent(html) {
  if (typeof html !== 'string') return { text: html, changed: false };
  
  let result = html;
  
  // Remove broken img tags with Hoook in the URL
  result = result.replace(/<img[^>]*hoook[^>]*>/gi, '');
  result = result.replace(/<figure[^>]*>[\s\S]*?hoook[\s\S]*?<\/figure>/gi, '');
  
  // Replace branding
  result = result.replace(/hoook\.io/gi, (match) => {
    if (match === 'hoook.io') return 'searchfit.ai';
    if (match === 'Hoook.io') return 'SearchFIT.ai';
    if (match === 'HOOOK.IO') return 'SEARCHFIT.AI';
    return 'SearchFIT.ai';
  });
  
  result = result.replace(/\bhoook\b(?!\.io)/gi, (match) => {
    if (match === 'hoook') return 'searchfit';
    if (match === 'Hoook') return 'SearchFIT';
    if (match === 'HOOOK') return 'SEARCHFIT';
    return 'SearchFIT';
  });
  
  return { text: result, changed: result !== html };
}

/**
 * Replace branding in plain text (non-HTML fields)
 */
function replaceBranding(text) {
  if (typeof text !== 'string') return { text, changed: false };
  
  let result = text;
  
  result = result.replace(/hoook\.io/gi, (match) => {
    if (match === 'hoook.io') return 'searchfit.ai';
    if (match === 'Hoook.io') return 'SearchFIT.ai';
    if (match === 'HOOOK.IO') return 'SEARCHFIT.AI';
    return 'SearchFIT.ai';
  });
  
  result = result.replace(/\bhoook\b(?!\.io)/gi, (match) => {
    if (match === 'hoook') return 'searchfit';
    if (match === 'Hoook') return 'SearchFIT';
    if (match === 'HOOOK') return 'SEARCHFIT';
    return 'SearchFIT';
  });
  
  return { text: result, changed: result !== text };
}

async function webflowRequest(endpoint, options = {}) {
  const url = `${WEBFLOW_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webflow API error ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

async function fetchAllCollectionItems() {
  const items = [];
  let offset = 0;
  const limit = 100;
  
  console.log('📥 Fetching collection items...');
  
  while (true) {
    const response = await webflowRequest(
      `/collections/${COLLECTION_ID}/items?limit=${limit}&offset=${offset}`
    );
    items.push(...response.items);
    console.log(`   Fetched ${items.length} items...`);
    
    if (response.items.length < limit) break;
    offset += limit;
    await sleep(RATE_LIMIT_DELAY);
  }
  
  return items;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🔄 Webflow Branding Update Script');
  console.log('==================================');
  console.log('Replacing: hoook.io → searchfit.ai');
  console.log('           Hoook.io → SearchFIT.ai');
  console.log('           Hoook → SearchFIT');
  console.log('==================================\n');
  
  try {
    const items = await fetchAllCollectionItems();
    console.log(`✅ Total items: ${items.length}\n`);
    
    const stats = { updated: [], failed: [] };
    
    console.log('🔍 Scanning and updating items...\n');
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemName = item.fieldData?.name || item.id;
      
      const updatedFields = {};
      const changedFields = [];
      
      for (const [key, value] of Object.entries(item.fieldData)) {
        // Skip image fields and slug
        if (['thumbnail', 'banner', 'slug'].includes(key)) continue;
        
        if (typeof value === 'string') {
          const processor = key === 'description' ? processHtmlContent : replaceBranding;
          const { text, changed } = processor(value);
          
          if (changed) {
            updatedFields[key] = text;
            changedFields.push(key);
          }
        }
      }
      
      if (changedFields.length > 0) {
        console.log(`📝 ${i + 1}/${items.length}: "${itemName}"`);
        console.log(`   Fields: ${changedFields.join(', ')}`);
        
        try {
          await webflowRequest(`/collections/${COLLECTION_ID}/items/${item.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ fieldData: updatedFields }),
          });
          console.log('   ✅ Updated\n');
          stats.updated.push(item.id);
        } catch (error) {
          console.log(`   ❌ Failed: ${error.message}\n`);
          stats.failed.push({ id: item.id, name: itemName, error: error.message });
        }
        
        await sleep(RATE_LIMIT_DELAY);
      } else if ((i + 1) % 50 === 0) {
        console.log(`   Scanned ${i + 1}/${items.length}...`);
      }
    }
    
    // Summary
    console.log('\n==================================');
    console.log('📊 SUMMARY');
    console.log('==================================');
    console.log(`Total scanned: ${items.length}`);
    console.log(`Updated: ${stats.updated.length}`);
    console.log(`Failed: ${stats.failed.length}`);
    
    if (stats.failed.length > 0) {
      console.log('\n❌ Failed items:');
      stats.failed.forEach(f => console.log(`   - ${f.name}`));
    }
    
    // Publish
    if (stats.updated.length > 0) {
      console.log('\n📤 Publishing...');
      for (let i = 0; i < stats.updated.length; i += 100) {
        const batch = stats.updated.slice(i, i + 100);
        await webflowRequest(`/collections/${COLLECTION_ID}/items/publish`, {
          method: 'POST',
          body: JSON.stringify({ itemIds: batch }),
        });
        console.log(`   Published ${Math.min(i + 100, stats.updated.length)}/${stats.updated.length}`);
      }
    }
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();
