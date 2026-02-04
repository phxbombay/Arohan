import ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';

const client = new ftp.Client();
client.ftp.verbose = true;

const config = {
    host: "111.118.215.98",
    user: "haspranahealth",
    password: "R@,sx-UbS)H$",
    secure: false
};

async function deployBackend() {
    try {
        console.log("🚀 Starting Backend Deployment...");

        // Files to upload
        const zipFile = path.join(process.cwd(), "backend.zip");
        const envFile = path.join(process.cwd(), "backend", ".env");
        const packageFile = path.join(process.cwd(), "backend", "package.json");

        if (!fs.existsSync(zipFile)) throw new Error("backend.zip not found!");

        console.log(`📂 Connecting to ${config.host}...`);
        await client.access(config);

        // We want to upload to a 'backend' folder parallel to public_html (safer)
        // or inside root. Let's list root first.
        console.log("📂 Root directory listing:");
        await client.list();

        // Ensure 'backend' directory exists
        console.log("📁 Creating/Navigating to 'backend' directory...");
        await client.ensureDir("backend");

        console.log(`📤 Uploading backend.zip...`);
        await client.uploadFrom(zipFile, "backend.zip");

        console.log(`📤 Uploading .env...`);
        await client.uploadFrom(envFile, ".env");

        console.log(`📤 Uploading package.json...`);
        await client.uploadFrom(packageFile, "package.json");

        console.log("✅ Backend Files Uploaded Successfully!");
        console.log("👉 Now go to cPanel File Manager -> 'backend' folder -> Right click backend.zip -> Extract");

    } catch (err) {
        console.error("❌ Deployment Failed:", err);
    }
    client.close();
}

deployBackend();
