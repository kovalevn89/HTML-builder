const path = require('path');
const fs = require('fs/promises');
const fs1 = require('fs');


async function copy(srcPath, dstPath){
    await fs.rm(dstPath, { recursive: true, force: true });
    await fs.mkdir(dstPath, { recursive: true });

    const files =  await fs.readdir(srcPath);
    
    for (const file of files) {
        const f = await fs.stat(path.join(srcPath, file));

        if(f.isDirectory()){
            copy(path.join(srcPath, file), path.join(dstPath, file))
        }
        else{
            let _src = path.join(srcPath, file);
            let _dst = path.join(dstPath, file);

            await fs.copyFile(_src, _dst);
            
            console.log(` - copied ${path.join(srcPath,file)}... done.`);
        }
    }
}

async function creatStyle(){
    const output = fs1.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

    const files =  await fs.readdir(path.join(__dirname, 'styles'));
  
    for (const file of files) {
        
        const f = await fs.stat(path.join(__dirname, 'styles', file));

        if(f.isFile() && path.parse(file).ext === '.css'){
            let tempData = [];

            const stream = fs1.createReadStream(path.join(__dirname, 'styles', file),'utf-8');

            stream.on('data', chunk => tempData.push(chunk));
            stream.on('end', () => {
                output.write(tempData.join(''));
                console.log(` - add ${file} to style.css... done.`);
            });
        }
    }
}

async function creatHtml(template){
    //read template
    let templateData = await new Promise((resolve, reject) => {
        const stream = fs1.createReadStream(path.join(__dirname, template),'utf-8');

        let templateData = [];
        stream.on('data', chunk => templateData.push(chunk));
        stream.on('end', () => {
            templateData = templateData.join('');
            resolve(templateData);
        });
        stream.on('error',(error)=>reject(error));
    });

    console.log(' - read html template file... done.');

    //read components
    let components = {};
    const files =  await fs.readdir(path.join(__dirname, 'components'));
  
    for (const file of files) {
        
        const f = await fs.stat(path.join(__dirname, 'components', file));

        if(f.isFile() && path.parse(file).ext === '.html'){

            let tempData = await new Promise((resolve, reject) => {
                let tempData = [];
                const stream = fs1.createReadStream(path.join(__dirname, 'components', file),'utf-8');

                stream.on('data', chunk => tempData.push(chunk));
                stream.on('end', () => {
                    resolve(tempData.join(''))
                });
                stream.on('error',(error)=>reject(error));
            });

            components[path.parse(file).name] = tempData;
            console.log(` - read html component - ${file}... done.`);
        }
    }

    //console.log(components);

    //replace
    for (component in components) {
        templateData = templateData.replace(`{{${component}}}`, components[component]);
    }

    //console.log(templateData);

    const output = fs1.createWriteStream(path.join(__dirname,'project-dist', 'index.html'));

    output.write(templateData);
}

async function build(){
    try {
        //creat 'project-dist'
        await fs.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });
        await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

        //coppy assets
        copy(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

        //creat index.html
        creatHtml('template.html');

        //creat style.css
        creatStyle();
    } catch (err) {
        console.error(err);
    }
};

build();