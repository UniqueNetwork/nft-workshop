const config = require('../config');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));


async function createZipArchive() {
    try {
        const zip = new AdmZip();

        const indexes = Array.from({ length: config.desiredCount },(_, i) => i+1);
        indexes.forEach((i) => {
            const face = faces[i-1];
            if (face) {
                zip.addLocalFile(path.resolve(
                    config.outputFolder,
                    config.imagePrefix + i + '.png',
                ));
            }
        });

        const zipPath = path.resolve(
            config.outputFolder,
            'images.zip',
        );

        zip.writeZip(zipPath);

        return zipPath;
    } catch (e) {
        throw new Error(`error creating zip: ${e}`);
    }
}

module.exports = createZipArchive;
