const path = require('path');
const fs = require('fs/promises');

async function copy(){
    try {

        await fs.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true });
        await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

        const files =  await fs.readdir(path.join(__dirname, 'files'));
      
        for (const file of files) {
            let src = path.join(__dirname, 'files', file);
            let dst = path.join(__dirname, 'files-copy', file);

            await fs.copyFile(src, dst);

            console.log(`- copied ${src} to ${dst}`);
        }
    } catch (err) {
        console.error(err);
    }
};

copy();