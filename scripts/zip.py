
import zipfile, os

base_dir = r"c:\Users\Shiva\OneDrive\Desktop\ap\psasprint"
zip_path = r"c:\Users\Shiva\OneDrive\Desktop\ap\psasprint.zip"

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
