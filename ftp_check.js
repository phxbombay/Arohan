import ftp from 'basic-ftp';

async function check() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "111.118.215.98",
            user: "haspranahealth",
            password: "R@,sx-UbS)H$",
            secure: false
        });
        console.log("✅ FTP Connection Successful!");
        await client.list();
    } catch (err) {
        console.error("❌ FTP Connection Failed!");
        console.error(err);
    }
    client.close();
}

check();
