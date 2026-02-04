const { Client } = require('ssh2');

const config = {
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
};

const commands = [
    // Try to trigger a restart for any Node.js processes
    'mkdir -p tmp && touch tmp/restart.txt',
    'mkdir -p public_html/tmp && touch public_html/tmp/restart.txt',
    'echo "✅ Restart triggers created (if Node.js is running)."'
];

const conn = new Client();

console.log('🚀 Connecting via SSH to restart services...');

conn.on('ready', () => {
    console.log('✅ Connected via SSH!');
    const runCommand = (cmd, index) => {
        if (index >= commands.length) {
            console.log('🎉 Restart sequence finished!');
            conn.end();
            return;
        }
        console.log(`\n⏳ Executing: ${cmd}`);
        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error(`❌ SSH Error on command "${cmd}":`, err);
                conn.end();
                return;
            }
            stream.on('close', (code) => {
                console.log(`> Command finished with code ${code}`);
                runCommand(commands[index + 1], index + 1);
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    };
    runCommand(commands[0], 0);
}).on('error', (err) => {
    console.error('❌ SSH Connection Failed:', err);
}).connect(config);
