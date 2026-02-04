import ftp from 'basic-ftp';
import path from 'path';

const client = new ftp.Client();
client.ftp.verbose = true;

const config = {
    host: "111.118.215.98",
    user: "haspranahealth",
    password: "R@,sx-UbS)H$",
    secure: false
};

async function forceUpload() {
    try {
        await client.access(config);
        console.log("🚀 Force Uploading index.html...");

        await client.uploadFrom("frontend/dist/index.html", "/public_html/index.html");

        console.log("✅ Uploaded index.html");

        console.log("⬇️ Verifying by downloading...");
        await client.downloadTo("remote_index_verified.html", "/public_html/index.html");
        console.log("✅ Downloaded verification file.");

    } catch (err) {
        console.error("❌ Error:", err);
    }
    client.close();
}

forceUpload();
