const fs = require("fs");

async function uploadImages(sdk, zipPath) {
    try {
        console.log("=== Upload images ===");
        // todo здесь ошибка Error: error upload images: Error [ERR_FR_MAX_BODY_LENGTH_EXCEEDED]: Request body larger than maxBodyLength limit
        // todo она растет из самого сдк, не из реста, надо разобраться
        // todo возможно куда то не туда заливает
        const { fileUrl } = await sdk.ipfs.uploadZip({ file: fs.readFileSync(zipPath) });
        console.log(`Images uploaded and available by ${fileUrl}`);
        return fileUrl;
    } catch (e) {
        throw new Error(`error upload images: ${e}`);
    }
}

module.exports = uploadImages;
