const fs = require('fs');
const { writeData } = require('./utils');

async function uploadImages(sdk, zipPath) {
    try {
        console.log('=== Upload images ===');
        const { fileUrl } = await sdk.ipfs.uploadZip({ file: fs.readFileSync(zipPath) });

        console.log(`Images uploaded and available at ${fileUrl}`);
        await writeData('fileUrl', fileUrl);
        return fileUrl;
    } catch (e) {
        throw new Error(`error upload images: ${e}`);
    }
}

module.exports = uploadImages;
