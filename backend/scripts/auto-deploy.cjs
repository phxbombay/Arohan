const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const sftp = new Client();

const config = {
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
};

// Paths
const LOCAL_FRONTEND_DIST = path.join(__dirname, '../../frontend/dist');
const LOCAL_BACKEND = path.join(__dirname, '..');
// Use relative paths to be safe with SFTP chroot
const REMOTE_PUBLIC_HTML = './public_html';
const REMOTE_BACKEND = './arohan-backend';

async function main() {
    try {
        console.log('🚀 Starting Automated Upload...');
        console.log(`🔌 Connecting to ${config.host}...`);

        await sftp.connect(config);
        console.log('✅ Connected!');

        // --- 1. Upload Frontend ---
        console.log('\n📦 Uploading Frontend...');
        console.log(`Local: ${LOCAL_FRONTEND_DIST}`);
        console.log(`Remote: ${REMOTE_PUBLIC_HTML}`);

        // Ensure remote directory exists (it should)
        const publicHtmlExists = await sftp.exists(REMOTE_PUBLIC_HTML);
        if (!publicHtmlExists) {
            console.error('❌ Error: public_html does not exist!');
            return;
        }

        // Upload Frontend Files
        await sftp.uploadDir(LOCAL_FRONTEND_DIST, REMOTE_PUBLIC_HTML, {
            useFastput: false // Windows sometimes has issues with fastput
        });
        console.log('✅ Frontend Uploaded Successfully!');

        // --- 2. Upload Backend ---
        console.log('\n📦 Uploading Backend...');
        // Create backend directory if not exists
        const backendExists = await sftp.exists(REMOTE_BACKEND);
        if (!backendExists) {
            console.log(`Creating remote directory: ${REMOTE_BACKEND}`);
            await sftp.mkdir(REMOTE_BACKEND, true);
        }

        console.log(`Local: ${LOCAL_BACKEND}`);
        console.log(`Remote: ${REMOTE_BACKEND}`);

        // Upload Backend Files
        // Filter out node_modules and .git to save time
        const filterFunc = (src, dest) => {
            const basename = path.basename(src);
            // Skip large/unnecessary folders
            if (basename === 'node_modules' || basename === '.git' || basename === 'dist' || basename === 'coverage') {
                return false;
            }
            return true;
        };

        await sftp.uploadDir(LOCAL_BACKEND, REMOTE_BACKEND, {
            filter: filterFunc
        });
        console.log('✅ Backend Uploaded Successfully!');

        // --- 3. Upload .htaccess to public_html ---
        const localHtaccess = path.join(__dirname, '../../frontend/.htaccess');
        if (fs.existsSync(localHtaccess)) {
            console.log('\n📄 Uploading .htaccess...');
            await sftp.put(localHtaccess, REMOTE_PUBLIC_HTML + '/.htaccess');
            console.log('✅ .htaccess Uploaded!');
        }

    } catch (err) {
        console.error('❌ Deployment Failed:', err.message);
    } finally {
        await sftp.end();
        console.log('\n🔌 Disconnected.');
    }
}

main();
