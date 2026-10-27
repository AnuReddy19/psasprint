const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Use archiver or standard node zip. Let's see if we can use python zipfile or a simple script.
const { execSync } = require('child_process');

try {
  // Test if python is available
  execSync('python --version', { stdio: 'ignore' });
  console.log('Python available, using python zipfile...');
  const pyScript = `
import zipfile, os

base_dir = r"c:\\Users\\Shiva\\OneDrive\\Desktop\\ap\\psasprint"
zip_path = r"c:\\Users\\Shiva\\OneDrive\\Desktop\\ap\\psasprint.zip"

excluded_dirs = {'node_modules', 'gen', '.git'}
excluded_files = {'db.sqlite', 'package-lock.json'}

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        for file in files:
            if file in excluded_files:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir)
            zipf.write(full_path, os.path.join('psasprint', rel_path))

print(f"Zip created at {zip_path} successfully!")
print(f"Zip file size: {os.path.getsize(zip_path)} bytes")
`;
  fs.writeFileSync(path.join(__dirname, 'zip.py'), pyScript, 'utf8');
  execSync('python scripts/zip.py', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (e) {
  console.error('Python failed, error:', e.message);
}
