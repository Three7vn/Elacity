import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the manifest in the dist directory
const manifestPath = path.join(__dirname, 'dist', 'manifest.json');

// Read the manifest file
fs.readFile(manifestPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading manifest file:', err);
    return;
  }

  try {
    // Parse the JSON
    const manifest = JSON.parse(data);

    // Update the content script path
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
      manifest.content_scripts[0].js = ['contentScript.js'];
    }

    // Write the updated manifest back to the file
    fs.writeFile(manifestPath, JSON.stringify(manifest, null, 4), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing manifest file:', writeErr);
        return;
      }
      console.log('Successfully updated manifest.json');
    });
  } catch (parseErr) {
    console.error('Error parsing manifest JSON:', parseErr);
  }
}); 