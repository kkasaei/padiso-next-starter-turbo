#!/usr/bin/env node

/**
 * Generate blog cover images with titles
 * 
 * Uses the base image (1.png) and overlays each blog's title
 * Saves as {slug}.png in the assets folder
 * 
 * Usage: node scripts/generate-blog-images.mjs
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBFLOW_API_KEY = '';
const COLLECTION_ID = '68a567bde4ad983dcf18d554';
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

const BASE_IMAGE_PATH = path.join(__dirname, '1.png');
const OUTPUT_DIR = path.join(__dirname, 'assets');

// Try to register Inter font
const FONT_PATH = path.join(__dirname, '..', 'apps', 'web', 'public', 'fonts', 'Inter', 'Inter_18pt-Bold.ttf');

async function webflowRequest(endpoint) {
  const url = `${WEBFLOW_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
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
 * Wrap text to fit within a given width
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Generate an image with title overlay
 */
async function generateImage(baseImage, title, outputPath) {
  const width = baseImage.width;
  const height = baseImage.height;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw the base image
  ctx.drawImage(baseImage, 0, 0);
  
  // Configure text style
  const fontSize = 72;
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate text area (below the logo, centered)
  const textAreaTop = 220; // Below the logo
  const textAreaBottom = height - 80;
  const textAreaHeight = textAreaBottom - textAreaTop;
  const maxWidth = width - 100; // Padding on sides
  
  // Wrap the text
  let lines = wrapText(ctx, title, maxWidth);
  
  // If too many lines, reduce font size
  let currentFontSize = fontSize;
  while (lines.length * (currentFontSize * 1.3) > textAreaHeight && currentFontSize > 36) {
    currentFontSize -= 4;
    ctx.font = `bold ${currentFontSize}px Inter, Arial, sans-serif`;
    lines = wrapText(ctx, title, maxWidth);
  }
  
  // Calculate total text height
  const lineHeight = currentFontSize * 1.3;
  const totalTextHeight = lines.length * lineHeight;
  
  // Center vertically in the text area
  const startY = textAreaTop + (textAreaHeight - totalTextHeight) / 2 + lineHeight / 2;
  
  // Draw each line
  for (let i = 0; i < lines.length; i++) {
    const y = startY + i * lineHeight;
    ctx.fillText(lines[i], width / 2, y);
  }
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function main() {
  console.log('🖼️  Blog Cover Image Generator');
  console.log('==============================\n');
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Try to register custom font
  if (fs.existsSync(FONT_PATH)) {
    try {
      GlobalFonts.registerFromPath(FONT_PATH, 'Inter');
      console.log('✅ Loaded Inter font\n');
    } catch (e) {
      console.log('⚠️ Could not load Inter font, using default\n');
    }
  } else {
    console.log('⚠️ Inter font not found, using default\n');
  }
  
  // Load base image
  console.log('📷 Loading base image...');
  const baseImage = await loadImage(BASE_IMAGE_PATH);
  console.log(`   Dimensions: ${baseImage.width}x${baseImage.height}\n`);
  
  // Fetch all blogs
  console.log('📥 Fetching blog posts from Webflow...');
  const blogs = await fetchAllBlogs();
  console.log(`   Found ${blogs.length} blogs\n`);
  
  // Generate images
  console.log('🎨 Generating images...\n');
  
  let generated = 0;
  let failed = 0;
  
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const title = blog.fieldData?.name || 'Untitled';
    const slug = blog.fieldData?.slug || blog.id;
    
    const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);
    
    try {
      await generateImage(baseImage, title, outputPath);
      generated++;
      
      if ((i + 1) % 20 === 0 || i === blogs.length - 1) {
        console.log(`   Generated ${i + 1}/${blogs.length} images...`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${slug} - ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n==============================');
  console.log('📊 SUMMARY');
  console.log('==============================');
  console.log(`Total blogs: ${blogs.length}`);
  console.log(`Generated: ${generated}`);
  console.log(`Failed: ${failed}`);
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n✅ Done!');
}

main().catch(console.error);
