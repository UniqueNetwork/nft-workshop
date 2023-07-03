const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const path = require('path');
const config = require('../config');

async function writeData(field, value) {
    try {
        const filePath = path.resolve(
            config.outputFolder,
            'data.json',
        );
        let data = {};
        if (fs.existsSync(filePath)) data = JSON.parse(fs.readFileSync(filePath));
        data[field] = value;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch(e) {
        throw new Error(`error write value: ${e}`);
    };
}

async function readData(field) {
    try {
        const filePath = path.resolve(
            config.outputFolder,
            'data.json',
        );
        if (!fs.existsSync(filePath)) return null;
        const data = JSON.parse(fs.readFileSync(filePath));
        return data[field];
    } catch(e) {
        throw new Error(`error read value: ${e}`);
    };
}

async function readCSV() {
    console.log('Reading CSV...');
    const data = [];
    await new Promise((resolve) => {
      let inputStream = fs.createReadStream(`${config.outputFolder}/${config.outputCSV}`, 'utf8');
  
      inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            data.push(row);
            console.log('A row arrived: ', row);
        })
        .on('end', function () {
            console.log('No more rows!');
            resolve();
        });
    })
    return data.splice(1);
  }

module.exports = {
    writeData,
    readData,
    readCSV
};
