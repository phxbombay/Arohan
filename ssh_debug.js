const { Client } = require('ssh2');

const config = {
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
};

const commands = [
    // 1. Where is the tool?
    'which cloudlinux-selector',
    'find /usr -name cloudlinux-selector 2>/dev/null',
    'ls -la /usr/local/bin/cloudlinux-selector',

    // 2. Try Email again with verbose output
    'uapi --output=jsonpretty Email add_pop email=noreply domain=haspranahealth.com password="Arohan@2026!Health" quota=0',

    // 3. Check what apps exist (maybe my previous run worked?)
    'uapi --output=jsonpretty PassengerApps list_apps'
];

const conn = new Client();
console.log('🚀 Debugging SSH...');

conn.on('ready', () => {
    console.log('✅ Connected!');

    const runCommand = (cmd, index) => {
        if (index >= commands.length) {
            console.log('🏁 Debug Setup Complete');
            conn.end();
            return;
        }

        console.log(`\n> ${cmd}`);
        conn.exec(cmd, (err, stream) => {
            stream.on('close', () => {
                runCommand(commands[index + 1], index + 1);
            }).on('data', (data) => {
                console.log('' + data);
            }).stderr.on('data', (data) => {
                console.log('ERR: ' + data);
            });
        });
    };

    runCommand(commands[0], 0);
}).on('error', (err) => console.log('Conn Error:', err)).connect(config);
