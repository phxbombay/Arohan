const { Client } = require('ssh2');

const config = {
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
};

// These are the specific commands to register a Node.js app in cPanel/CloudLinux
const commands = [
    // 1. Create 'api' subdomain (safe to run even if exists)
    'uapi SubDomain addsubdomain domain=api rootdomain=haspranahealth.com dir=public_html/api',

    // 2. Register the App (CloudLinux Selector)
    // This tells cPanel: "This folder 'backend' is a Node.js 18 app at api.haspranahealth.com"
    '/usr/bin/cloudlinux-selector create --json --interpreter nodejs --version 18 --app-root backend --domain api.haspranahealth.com --startup-file src/index.js',

    // 3. Start the App (Ensures it's running)
    '/usr/bin/cloudlinux-selector start --json --interpreter nodejs --app-root backend',

    // 4. Check Status
    '/usr/bin/cloudlinux-selector read --json --interpreter nodejs --app-root backend'
];

const conn = new Client();

console.log('🚀 Connecting via SSH to Launch App...');

conn.on('ready', () => {
    console.log('✅ Connected! Running launch commands...');

    const runCommand = (cmd, index) => {
        if (index >= commands.length) {
            console.log('🎉 App Launch Sequence Finish!');
            conn.end();
            return;
        }

        console.log(`\n⏳ Executing Step ${index + 1}...`);
        // console.log(`Command: ${cmd}`); 

        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error(`❌ SSH Error:`, err);
                conn.end();
                return;
            }

            stream.on('close', (code, signal) => {
                console.log(`> Step finished with code ${code}`);
                if (code !== 0 && index === 1) {
                    console.log("⚠️ (App might already exist, attempting to start it anyway...)");
                }
                runCommand(commands[index + 1], index + 1);
            }).on('data', (data) => {
                console.log('OUTPUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('LOG: ' + data);
            });
        });
    };

    runCommand(commands[0], 0);

}).on('error', (err) => {
    console.error('❌ SSH Failed:', err);
}).connect(config);
