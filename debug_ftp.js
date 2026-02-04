import ftp from 'basic-ftp';

const client = new ftp.Client();
client.ftp.verbose = true;

const config = {
    host: "111.118.215.98",
    user: "haspranahealth",
    password: "R@,sx-UbS)H$",
    secure: false
};

async function listRemote() {
    try {
        await client.access(config);
        // console.log("📂 Root Directory Listing:");
        // await client.list("/");

        console.log("⬇️ Downloading index.html...");
        await client.downloadTo("remote_index.html", "/public_html/index.html");
        console.log("✅ Downloaded remote_index.html");

    } catch (err) {
        console.error("❌ Error:", err);
    }
    client.close();
}

listRemote();
