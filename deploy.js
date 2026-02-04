import ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';

const client = new ftp.Client();
client.ftp.verbose = true;

const config = {
    host: "111.118.215.98",
    user: "haspranahealth",
    password: "R@,sx-UbS)H$",
    secure: false // cPanel FTP often uses explicit TLS or plain FTP
};

async function deploy() {
    try {
        console.log("🚀 Starting Frontend Deployment...");

        // Verify dist folder exists
        const localDir = path.join(process.cwd(), "frontend", "dist");
        if (!fs.existsSync(localDir)) {
            throw new Error(`Build folder not found at: ${localDir}. Did you run 'npm run build'?`);
        }

        console.log(`📂 Connecting to ${config.host}...`);
        await client.access(config);

        console.log("✅ Connected! Navigating to public_html...");
        await client.cd("public_html");

        console.log("🧹 Clearing remote directory (optional safety check needed in real prod)...");
        // Only clear if confident. For now, we will just upload/overwrite.
        // await client.clearWorkingDir(); 

        console.log(`📤 Uploading files from ${localDir} to public_html...`);
        await client.uploadFromDir(localDir);

        console.log("✅ Deployment Complete!");

    } catch (err) {
        console.error("❌ Deployment Failed:", err);
    }
    client.close();
}

deploy();
