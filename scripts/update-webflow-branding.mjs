#!/usr/bin/env node

/**
 * Webflow Collection Branding Update Script
 * 
 * Updates all blog posts in the Webflow collection to replace:
 * - hoook.io → searchfit.ai
 * - Hoook.io → SearchFIT.ai
 * - Hoook → SearchFIT
 */

const WEBFLOW_API_KEY = '';
const COLLECTION_ID = '68a567bde4ad983dcf18d554';
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

// Rate limiting - Webflow API has limits
const RATE_LIMIT_DELAY = 100; // ms between requests

/**
 * Replace all Hoook branding with SearchFIT branding in a string
 */
function replaceBranding(text) {
  if (typeof text !== 'string') return { text, changed: false };
  
  let result = text;
  
  // Order matters - replace more specific patterns first
  // Case-insensitive replacements with proper casing
  result = result.replace(/hoook\.io/gi, (match) => {
    if (match === 'hoook.io') return 'searchfit.ai';
    if (match === 'Hoook.io') return 'SearchFIT.ai';
    if (match === 'HOOOK.IO') return 'SEARCHFIT.AI';
    return 'SearchFIT.ai'; // default
  });
  
  // Replace standalone "Hoook" (not followed by .io since we already handled that)
  // Use word boundary to avoid partial matches
  result = result.replace(/\bhoook\b(?!\.io)/gi, (match) => {
    if (match === 'hoook') return 'searchfit';
    if (match === 'Hoook') return 'SearchFIT';
    if (match === 'HOOOK') return 'SEARCHFIT';
    return 'SearchFIT'; // default
  });
  
  return { text: result, changed: result !== text };
}

/**
 * Recursively process an object/array and replace branding in all string values
 */
function processValue(value, path = '') {
  if (value === null || value === undefined) {
    return { value, changes: [] };
  }
  
  if (typeof value === 'string') {
    const { text, changed } = replaceBranding(value);
    if (changed) {
      return { value: text, changes: [{ path, original: value, updated: text }] };
    }
    return { value, changes: [] };
  }
  
  if (Array.isArray(value)) {
    let allChanges = [];
    const newArray = value.map((item, index) => {
      const { value: newValue, changes } = processValue(item, `${path}[${index}]`);
      allChanges = allChanges.concat(changes);
      return newValue;
    });
    return { value: newArray, changes: allChanges };
  }
  
  if (typeof value === 'object') {
    let allChanges = [];
    const newObj = {};
    for (const [key, val] of Object.entries(value)) {
      const { value: newValue, changes } = processValue(val, path ? `${path}.${key}` : key);
      newObj[key] = newValue;
      allChanges = allChanges.concat(changes);
    }
    return { value: newObj, changes: allChanges };
  }
  
  return { value, changes: [] };
}

/**
 * Make an API request to Webflow
 */
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

/**
 * Fetch all items from a collection (handles pagination)
 */
async function fetchAllCollectionItems() {
  const items = [];
  let offset = 0;
  const limit = 100; // Webflow max per request
  
  console.log('📥 Fetching collection items...');
  
  while (true) {
    const response = await webflowRequest(
      `/collections/${COLLECTION_ID}/items?limit=${limit}&offset=${offset}`
    );
    
    items.push(...response.items);
    console.log(`   Fetched ${items.length} items so far...`);
    
    if (response.items.length < limit) {
      break; // No more items
    }
    
    offset += limit;
    await sleep(RATE_LIMIT_DELAY);
  }
  
  console.log(`✅ Total items fetched: ${items.length}\n`);
  return items;
}

/**
 * Update a collection item
 */
async function updateCollectionItem(itemId, fieldData) {
  return webflowRequest(`/collections/${COLLECTION_ID}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldData }),
  });
}

/**
 * Publish collection items
 */
async function publishCollectionItems(itemIds) {
  return webflowRequest(`/collections/${COLLECTION_ID}/items/publish`, {
    method: 'POST',
    body: JSON.stringify({ itemIds }),
  });
}

/**
 * Sleep for a specified duration
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Webflow Branding Update Script');
  console.log('==================================');
  console.log('Replacing: hoook.io → searchfit.ai');
  console.log('           Hoook.io → SearchFIT.ai');
  console.log('           Hoook → SearchFIT');
  console.log('==================================\n');
  
  try {
    // First, let's check what the collection looks like
    console.log('📋 Fetching collection schema...');
    const collection = await webflowRequest(`/collections/${COLLECTION_ID}`);
    console.log(`   Collection: ${collection.displayName}`);
    console.log(`   Fields: ${collection.fields.map(f => f.slug).join(', ')}\n`);
    
    // Fetch all items
    const items = await fetchAllCollectionItems();
    
    // Track statistics
    const stats = {
      totalItems: items.length,
      itemsWithChanges: 0,
      totalChanges: 0,
      updatedItems: [],
      failedItems: [],
    };
    
    // Process each item
    console.log('🔍 Scanning items for Hoook branding...\n');
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemName = item.fieldData?.name || item.fieldData?.title || item.id;
      
      // Process all field data
      const { value: updatedFieldData, changes } = processValue(item.fieldData);
      
      if (changes.length > 0) {
        stats.itemsWithChanges++;
        stats.totalChanges += changes.length;
        
        console.log(`📝 Item ${i + 1}/${items.length}: "${itemName}"`);
        changes.forEach(change => {
          const preview = change.original.length > 80 
            ? change.original.substring(0, 80) + '...' 
            : change.original;
          console.log(`   Field: ${change.path}`);
          console.log(`   Preview: "${preview}"`);
        });
        console.log('');
        
        // Update the item
        try {
          await updateCollectionItem(item.id, updatedFieldData);
          stats.updatedItems.push({ id: item.id, name: itemName, changes: changes.length });
          console.log(`   ✅ Updated successfully\n`);
        } catch (error) {
          stats.failedItems.push({ id: item.id, name: itemName, error: error.message });
          console.log(`   ❌ Failed to update: ${error.message}\n`);
        }
        
        await sleep(RATE_LIMIT_DELAY);
      } else {
        // Progress indicator for items without changes
        if ((i + 1) % 20 === 0) {
          console.log(`   Scanned ${i + 1}/${items.length} items...`);
        }
      }
    }
    
    // Print summary
    console.log('\n==================================');
    console.log('📊 SUMMARY');
    console.log('==================================');
    console.log(`Total items scanned: ${stats.totalItems}`);
    console.log(`Items with changes: ${stats.itemsWithChanges}`);
    console.log(`Total changes made: ${stats.totalChanges}`);
    console.log(`Successfully updated: ${stats.updatedItems.length}`);
    console.log(`Failed updates: ${stats.failedItems.length}`);
    
    if (stats.failedItems.length > 0) {
      console.log('\n❌ Failed items:');
      stats.failedItems.forEach(item => {
        console.log(`   - ${item.name}: ${item.error}`);
      });
    }
    
    // Publish updated items if there are any
    if (stats.updatedItems.length > 0) {
      console.log('\n📤 Publishing updated items...');
      
      // Webflow allows publishing up to 100 items at once
      const batchSize = 100;
      const itemIds = stats.updatedItems.map(item => item.id);
      
      for (let i = 0; i < itemIds.length; i += batchSize) {
        const batch = itemIds.slice(i, i + batchSize);
        try {
          await publishCollectionItems(batch);
          console.log(`   Published batch ${Math.floor(i / batchSize) + 1}: ${batch.length} items`);
        } catch (error) {
          console.log(`   ⚠️ Publishing failed for batch: ${error.message}`);
          console.log('   Note: Items are updated but may need manual publishing in Webflow');
        }
        await sleep(RATE_LIMIT_DELAY);
      }
      
      console.log('\n✅ All done!');
    } else {
      console.log('\n✅ No items needed updating - branding is already correct!');
    }
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
