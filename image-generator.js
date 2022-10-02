const fs = require("fs");
const mergeImg = require('merge-img');
const config = require('./config');
const attributes = require('./attributes');
const { spawn, Pool, Worker } = require("threads");

let faces;

function getImageData(arr) {
  let images = [];

  for (let i=0; i < arr.length; i++) {
    if (arr[i] > 0) {
      const img = {
        src: `${config.imagePartsFolder}/${attributes[i].name}${arr[i]}.png`,
        offsetX: (i == 0) ? 0 : -1706, // <-------- Put your image width here
        offsetY: 0,
      }
      images.push(img);
    }
  }

  return images;
}

function printAttributes(i) {
  let attrs = '[' + faces[i] + '] => ';
  for (let j=0; j<attributes.length; j++) {
    if (faces[i][j] > 0) {
      attrs += attributes[j].values[faces[i][j]-1] + ", ";
    }
  }

  console.log(`Attributes for NFT ${i+1}:`, attrs);
}

async function generateImages() {

  const pool = Pool(() => spawn(new Worker("./generate-image.worker")), 10 /* optional size */);

  for (let i=0; i<faces.length; i++) {

    const face = faces[i];
    const output = `${config.outputFolder}/${config.imagePrefix}${i+1}.png`;

    const images = getImageData(face);

    pool.queue(async (generateImage) => {
      const num = await generateImage({ images, output, num: i });
      printAttributes(num);
    });
  }

  await pool.completed()
  await pool.terminate()

}

async function main() {
  faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
  console.time('images');
  await generateImages();
  console.timeEnd('images');
}

main();

