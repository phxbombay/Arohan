import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connection Ready! Starting automation...');

    // Sequence of commands to run on the server
    const commands = [
        'cd backend && unzip -o backend.zip', // Extract backend
        'sed -i "s/DB_USER=postgres/DB_USER=haspranahealth/g" backend/.env', // Update User
        'sed -i "s/DB_NAME=arohan_health_db/DB_NAME=haspranahealth_arohan_db/g" backend/.env', // Update Name
        'sed -i "s/DB_PASSWORD=arohan_secure_2026/DB_PASSWORD=R\\\\@,sx-UbS)H\$/g" backend/.env', // Update Password (with escapes for sed)
        'mysql -u haspranahealth -p"R@,sx-UbS)H$" haspranahealth_arohan_db < backend/schema.sql' // Import SQL
    ];

    const runCommand = (command) => {
        return new Promise((resolve, reject) => {
            console.log(`🏃 Running: ${command}`);
            conn.exec(command, (err, stream) => {
                if (err) return reject(err);
                stream.on('close', (code, signal) => {
                    if (code === 0) resolve();
                    else reject(new Error(`Command failed with code ${code}`));
                }).on('data', (data) => {
                    process.stdout.write(data);
                }).stderr.on('data', (data) => {
                    process.stderr.write(data);
                });
            });
        });
    };

    const main = async () => {
        try {
            for (const cmd of commands) {
                await runCommand(cmd);
            }
            console.log('✨ ALL DONE! Server extracted and database imported.');
        } catch (error) {
            console.error('❌ Automation Failed:', error.message);
        } finally {
            conn.end();
        }
    };

    main();
}).on('error', (err) => {
    console.error('❌ SSH Connection Failed:', err.message);
}).connect({
    host: '111.118.215.98',
    port: 22,
    username: 'haspranahealth',
    password: 'R@,sx-UbS)H$'
});
