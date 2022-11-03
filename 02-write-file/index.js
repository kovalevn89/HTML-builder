const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));

stdout.write('Hello!\nWrite text here:\n');

stdin.on('data', data => {
    if(data == 'exit\r\n' || data == 'exit\n' || data == 'exit')
        process.exit();

    stdout.write('out -> ' + data);
    output.write(data);
});

process.on('exit', () => stdout.write('Bye - bye!\n'));