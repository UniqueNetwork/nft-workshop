const fs = require('fs');
const config = require('./config');
const {readCSV} = require('./scripts/utils');
const { spawn, Pool, Worker } = require('threads');

const attributes = config.attributes;

let faces;

function getImageData(arr) {
  let images = [];

  for (let i=0; i < arr.length; i++) {
    // if image part optional it could be skipped
    if (arr[i] !== "") {
      const imageIdx = attributes[i].values.findIndex(v => v === arr[i] || v.value === arr[i]) + 1;
      if(imageIdx === 0) throw Error('imageIdx cannot be null');
      const img = {
        src: `${config.imagePartsFolder}/${attributes[i].name}${imageIdx}.png`,
        offsetX: (i == 0) ? 0 : -config.imageWidth,
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

  const pool = Pool(() => spawn(new Worker('./scripts/generate-image.worker')), config.imagesInParallel);

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
  faces = await readCSV();
  console.time('images');
  await generateImages();
  console.timeEnd('images');
}

main();

