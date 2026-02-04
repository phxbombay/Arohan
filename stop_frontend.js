import ftp from 'basic-ftp';

const client = new ftp.Client();
client.ftp.verbose = true;

const config = {
    host: "111.118.215.98",
    user: "haspranahealth",
    password: "R@,sx-UbS)H$",
    secure: false
};

async function stopFrontend() {
    try {
        console.log("🛑 Connecting to disable frontend...");
        await client.access(config);

        // Go to public_html
        await client.cd("public_html");

        // Rename index.html to index_OFF.html
        // This makes the site show "403 Forbidden" or "Index of", effectively hiding it.
        try {
            await client.rename("index.html", "index_OFF.html");
            console.log("✅ Site Disabled: Renamed index.html to index_OFF.html");
        } catch (e) {
            console.log("⚠️ Could not rename index.html (Maybe already renamed?)");
        }

    } catch (err) {
        console.error("❌ Failed:", err);
    }
    client.close();
}

stopFrontend();
