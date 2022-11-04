const path = require('path');
const fs = require('fs/promises');

async function read(){
    try {
        const files =  await fs.readdir(path.join(__dirname, 'secret-folder'));
      
        for (const file of files) {
            
            const f = await fs.stat(path.join(__dirname, 'secret-folder', file));

            if(f.isFile())
                console.log(`${path.parse(file).name} - ${path.parse(file).ext} - ${(f.size / 1024).toFixed(3) + ' kb'}`);
        }
    } catch (err) {
        console.error(err);
    }
};

read();
