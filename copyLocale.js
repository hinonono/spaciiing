const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'public', 'locales');
const targetDir = path.join(__dirname, 'src', 'assets', 'locales');

function copyPluginJsonFiles(src, dest) {
    // Create target directory if it doesn't exist
    fs.mkdirSync(dest, { recursive: true });

    // Read all folders (languages) from source
    const languageDirs = fs.readdirSync(src, { withFileTypes: true });

    languageDirs.forEach(dir => {
        if (dir.isDirectory()) {
            // Define the paths for the plugin.json files
            const srcFilePath = path.join(src, dir.name, 'plugin-notification.json');
            const destFilePath = path.join(dest, dir.name, 'plugin-notification.json');

            // Check if plugin.json exists in the source directory
            if (fs.existsSync(srcFilePath)) {
                // Copy plugin.json from source to destination
                fs.mkdirSync(path.join(dest, dir.name), { recursive: true }); // Ensure the target directory exists
                fs.copyFileSync(srcFilePath, destFilePath);
            }
        }
    });
}

// Start the copying process
copyPluginJsonFiles(sourceDir, targetDir);

console.log('plugin-notification.json files have been copied successfully!');