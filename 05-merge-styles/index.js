const path = require('path');
const fs = require('fs/promises');
const fs1 = require('fs');

async function creatBundle(){
    try {
        const output = fs1.createWriteStream(path.join(__dirname,'project-dist', 'bundle.css'));

        const files =  await fs.readdir(path.join(__dirname, 'styles'));
      
        for (const file of files) {
            
            const f = await fs.stat(path.join(__dirname, 'styles', file));

            if(f.isFile() && path.parse(file).ext === '.css'){
                let tempData = [];

                const stream = fs1.createReadStream(path.join(__dirname, 'styles', file),'utf-8');

                stream.on('data', chunk => tempData.push(chunk));
                stream.on('end', () => {
                    output.write(tempData.join(''));
                    console.log(` - add ${file} to bundle.css`);
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

creatBundle();