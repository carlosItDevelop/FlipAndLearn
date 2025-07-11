const fs = require('fs');
const path = require('path');

// Get the API key from environment
const apiKey = process.env.GEMINI_API_KEY || '';

// Read the index.html file
const indexPath = path.join(__dirname, 'src', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace the API key placeholder
indexContent = indexContent.replace(
  "GEMINI_API_KEY: ''",
  `GEMINI_API_KEY: '${apiKey}'`
);

// Write back the file
fs.writeFileSync(indexPath, indexContent);

console.log('Environment variables injected successfully');