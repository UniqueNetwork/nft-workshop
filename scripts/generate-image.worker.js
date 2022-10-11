const { expose } = require("threads/worker");
const mergeImg = require('merge-img');

expose(async function generateImage({images, output, num}) {
    const img = await mergeImg(images);
    await new Promise(resolve => {
        img.write(output, () => resolve());
    });
    return num;
});
