const fs = require('fs');
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

module.exports = {
    writeData,
    readData
};
