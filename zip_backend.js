import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const output = fs.createWriteStream(path.join(process.cwd(), 'backend.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
    console.log('✅ Backend zipped successfully!');
    console.log(archive.pointer() + ' total bytes');
    console.log('📂 File created: backend.zip');
    console.log('👉 Upload this file to your cPanel backend directory and unzip it there.');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

// Append files from local 'backend' directory, putting them at the root of the zip
archive.directory('backend/', false, (entry) => {
    // Exclude node_modules and other non-production files
    if (entry.name.includes('node_modules') ||
        entry.name.includes('.git') ||
        entry.name.includes('tests') ||
        entry.name.includes('coverage')) {
        return false;
    }
    return entry;
});

archive.finalize();
