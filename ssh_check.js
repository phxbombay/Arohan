import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connection Ready!');
    conn.exec('mysql -u haspranahealth -p"R@,sx-UbS)H$" -e "SHOW DATABASES;"', (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('close', (code, signal) => {
            console.log('--- REMOTE OUTPUT START ---');
            console.log(output);
            console.log('--- REMOTE OUTPUT END ---');
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            output += data.toString();
        }).stderr.on('data', (data) => {
            console.error('REMOTE STDERR:', data.toString());
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Connection Failed:', err.message);
}).connect({
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
});
