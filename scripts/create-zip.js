const config = require('../config');
const AdmZip = require('adm-zip');
const path = require('path');
const {readCSV} = require('./utils');

let faces;


async function createZipArchive() {
    faces = await readCSV(`${config.outputFolder}/${config.outputCSV}`);
    try {
        const zipPath = path.resolve(
            config.outputFolder,
            'archive.zip',
        );

        const zip = new AdmZip();

        if (config.coverFileName) {
            zip.addLocalFile(path.resolve(
                config.imagePartsFolder,
                config.coverFileName,
            ));
        }

        const indexes = Array.from({ length: config.desiredCount },(_, i) => i+1);
        indexes.forEach((i) => {
            const face = faces[i-1];
            if (face) {
                zip.addLocalFile(path.resolve(
                    config.outputFolder,
                    `${config.imagePrefix}${i}.png`,
                ));
            }
        });

        zip.writeZip(zipPath);
        return zipPath;
    } catch (e) {
        throw new Error(`error creating zip: ${e}`);
    }
}

module.exports = createZipArchive;
