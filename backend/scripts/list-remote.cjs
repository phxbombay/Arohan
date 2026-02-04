const Client = require('ssh2-sftp-client');
const sftp = new Client();

const config = {
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
};

async function main() {
    try {
        console.log('🔌 Connecting...');
        await sftp.connect(config);
        console.log('✅ Connected!');

        console.log('📂 Remote root listing (SKIPPED):');
        // const list = await sftp.list('/');
        // console.log(list);

        console.log('📂 Remote current dir listing:');
        const list2 = await sftp.list('.');
        console.log(list2);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await sftp.end();
    }
}

main();
