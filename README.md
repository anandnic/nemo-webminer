# Nemo WebMiner

[![npm version](https://img.shields.io/npm/v/nemo-webminer.svg)](https://www.npmjs.com/package/nemo-webminer)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Nemo-webminer is a Node.js toolkit for scraping content from any website and exporting it as clean, structured JSON or Excel files. Includes an interactive demo UI.

---

## Features
- Export scraped data to `.xlsx` Excel files or JSON.
- Use CSS selectors or group results by HTML tag name.
- Promise-based, modular API: `nemoMine(url, selectors, options)`
- Interactive demo web page for testing and visualization.

---

## Demo Link:

[https://adcloud.space/webminer/](https://adcloud.space/webminer/)

## Installation

```sh
npm install nemo-webminer
npm install playwright xlsx   # Peer dependencies
npx playwright install       # Install Playwright browsers
```

---

## Usage

### Basic Example

```javascript
// ESM
import { nemoMine } from 'nemo-webminer';
// or CommonJS
const { nemoMine } = require('nemo-webminer');

// Using object selectors
nemoMine({
  url: 'https://example.com',
  selectors: { Title: 'h1', Links: 'a' },
  format: 'json'
}).then(data => console.log(data));

// Using string selectors
nemoMine({
  url: 'https://example.com',
  selectors: 'Title: h1, Links: a',
  format: 'json'
}).then(data => console.log(data));

// No selectors (groups by tag name)
nemoMine({ url: 'https://example.com', format: 'json' })
  .then(data => console.log(data));
  output: 'result_tags.xlsx'
}).then(filepath => {
  console.log('Saved file grouped by tags to:', filepath);
});
```

---

## Step-by-Step API Guide

This section provides a detailed walkthrough of how to use the Nemo WebMiner API in different scenarios.

### Basic Setup

1. **Install the module in your project:**
   ```bash
   npm install nemo-webminer
   
   ```

2. **Import the module:**
   ```javascript
   const { nemoMine } = require('nemo-webminer');
   // Or if using directly:
   const { nemoMine } = require('./path/to/nemo-webminer/dist/index.js');
   ```

3. **Ensure Playwright browsers are installed:**
   ```bash
   npx playwright install
   ```

### Scenario 1: Scraping with Specific Selectors to JSON

1. **Define target URL and selectors:**
   ```javascript
   const url = 'https://example.com';
   const selectors = {
     'Title': 'h1',                   // Get main headings
     'Paragraphs': 'p',               // Get paragraphs
     'Links': 'a',                    // Get links
     'Images': 'img',                 // Get images (will include src and alt attributes)
     'ListItems': 'ul > li, ol > li'  // Get list items from unordered and ordered lists
   };
   ```

2. **Call nemoMine with JSON output format:**
   ```javascript
   nemoMine({
     url,
     selectors,
     format: 'json'
   })
   .then(data => {
     console.log('Scraped data:', data);
     
   })
   .catch(error => {
     console.error('Scraping failed:', error.message);
   });
   ```

3. **The resulting data structure will be:**
   ```javascript
   {
     "Title": ["Example Domain", "Another Heading", ...],
     "Paragraphs": ["This domain is for use in examples...", ...],
     "Links": ["More information...", ...],
     "Images": ["Image description , ...],
     "ListItems": ["List item 1", "List item 2", ...]
   }
   ```

### Scenario 2: Scraping All Tags to Excel File

1. **Define target URL (no selectors necessary):**
   ```javascript
   const url = 'https://example.com';
   const outputFile = 'all_tags_data.xlsx';
   ```

2. **Call nemoMine with file output format:**
   ```javascript
   nemoMine({
     url,
     // No selectors provided will scrape all tags
     output: outputFile,
     format: 'file' // Default,
   })
   .then(filePath => {
     console.log(`Excel file saved to: ${filePath}`);
     //  the Excel file for further analysis
   })
   .catch(error => {
     console.error('Scraping failed:', error.message);
   });
   ```

### Scenario 3: Using String-Format Selectors

1. **Define your target URL and selectors as a string:**
   ```javascript
   const url = 'https://example.com';
   // Format: "Name1: selector1, Name2: selector2"
   const selectors = 'Headings: h1, h2, h3, Content: p, .content, Article: article';
   ```

2. **Call nemoMine with your preferred output format:**
   ```javascript
   nemoMine({
     url,
     selectors,
     format: 'json' // Or 'file' with an output filename
   })
   .then(result => {
     console.log('Result:', result);
   })
   .catch(error => {
     console.error('Error:', error.message);
   });
   ```

### Scenario 4: Integration with Express API

1. **Set up an Express route to handle scraping requests:**
   ```javascript
   const express = require('express');
   const { nemoMine } = require('nemo-webminer');
   const app = express();
   
   app.use(express.json());
   
   app.post('/api/scrape', async (req, res) => {
     try {
       const { url, selectors, format = 'json' } = req.body;
       
       if (!url) {
         return res.status(400).json({ error: 'URL is required' });
       }
       
       const result = await nemoMine({ url, selectors, format });
       
       if (format === 'json') {
         // Return JSON data
         return res.json(result);
       } else {
         // For file output, save the file
         return res.json({ filePath: result });
       }
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   app.listen(3005, () => {
     console.log('API server running on port 3004');
   });
   ```


---

## Demo Web UI

1. Start the demo server:

```sh
npm run demo
```

2. Open your browser at [http://localhost:3004](http://localhost:3004)
3. Enter a URL and optionally enter selectors in one of these formats:
   - Comma-separated: `h1, a, p`
   - Comma-separated with names: `Title: h1, Links: a`
   - Or leave blank to scrape all HTML tags
4. Click "Download XLSX" to get an Excel file or "Get JSON Data" to see the JSON output directly in the browser.

The demo interface provides immediate feedback and allowing to experiment.

---

## API Notes

- **JSON Output Structure:**
  - With selectors: `{ "SelectorName": ["value1", "value2", ...] }`
  - Without selectors: `{ "tagName": ["value1", "value2", ...] }`

---

## Selector Formats Explained

Nemo-webminer supports multiple ways to specify which elements to scrape.Below are simple explanations of each format:

### 1. Object Format

```javascript
// Define selectors as an object
const selectors = {
  "Title": "h1",                  // Key is the column name, value is the CSS selector
  "Content": "p",
  "Links": "a",
  "ImportantText": ".highlight"    // Can use any valid CSS selector
};

// Pass to nemoMine
nemoMine({ url: 'https://example.com', selectors, format: 'json' });
```

### 2. String Format with Names

```javascript
// Define selectors as a string with name:selector pairs
const selectors = "Title: h1, Content: p, Links: a, ImportantText: .highlight";

// Pass to nemoMine
nemoMine({ url: 'https://example.com', selectors, format: 'json' });
```

### 3. Simple String Format

```javascript
// Just list the selectors (column names will be the same as selectors)
const selectors = "h1, p, a, .highlight";

// This is equivalent to:
// { "h1": "h1", "p": "p", "a": "a", ".highlight": ".highlight" }

nemoMine({ url: 'https://example.com', selectors, format: 'json' });
```

### 4. No Selectors (All Tags)

```javascript
// Remove the selectors parameter or pass an empty string
nemoMine({ url: 'https://example.com', format: 'json' });

// Results will be grouped by HTML tag name
// { "h1": [...], "p": [...], "a": [...], "div": [...], ... }
```

---

## License
MIT
