const { Client } = require('ssh2');

const config = {
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
};

const commands = [
    // 1. Go to backend and unzip
    'cd backend && unzip -o backend.zip',

    // 2. Install dependencies (if node is available globally)
    'cd backend && npm install --production',

    // 3. Create 'noreply' email
    'uapi Email add_pop email=noreply domain=haspranahealth.com password="Arohan@2026!Health" quota=250',

    // 4. Create 'info' email
    'uapi Email add_pop email=info domain=haspranahealth.com password="Arohan@2026!Health" quota=1000',

    // 5. Enable AutoSSL
    'uapi SSL install_ssl domain=haspranahealth.com'
];

const conn = new Client();

console.log('🚀 Connecting via SSH to automate cPanel tasks...');

conn.on('ready', () => {
    console.log('✅ Connected via SSH!');

    // Helper to run commands sequentially
    const runCommand = (cmd, index) => {
        if (index >= commands.length) {
            console.log('🎉 All remote tasks finished!');
            conn.end();
            return;
        }

        console.log(`\n⏳ Executing: ${cmd}`);

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error(`❌ SSH Error on command "${cmd}":`, err);
                // Continue to next command anyway? No, strict.
                conn.end();
                return;
            }

            stream.on('close', (code, signal) => {
                console.log(`> Command finished with code ${code}`);
                runCommand(commands[index + 1], index + 1); // Next
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    };

    // Start with first command
    runCommand(commands[0], 0);

}).on('error', (err) => {
    console.error('❌ SSH Connection Failed:', err);
    console.log('💡 Note: Many shared hosts disable SSH or use port 2222. If this fails, Manual Steps are the ONLY way.');
}).connect(config);
