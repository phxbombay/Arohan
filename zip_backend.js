import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

async function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .glob('**/*', {
                cwd: sourceDir,
                ignore: ['node_modules/**', 'dist/**', 'logs/**', '.git/**', '.env']
            })
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

const source = path.join(process.cwd(), 'backend');
const destination = path.join(process.cwd(), 'backend.zip');

console.log(`📦 Zipping ${source} to ${destination}...`);

zipDirectory(source, destination)
    .then(() => console.log('✅ Backend zipped successfully!'))
    .catch(err => console.error('❌ Zipping failed:', err));
