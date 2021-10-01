const fs = require("fs");
const mergeImg = require('merge-img');
const config = require('./config');
const attributes = require('./attributes');

let faces;

function mergeImagesToPng(images, output) {
  return new Promise(function(resolve, reject) {
    mergeImg(images)
    .then((img) => {
      // Save image as file
      img.write(output, () => {
        console.log(`Image ${output} saved`);
        resolve();
      });
    });
  });
}

async function saveFaceByAttributes(arr, outFile) {
  let images = [];

  for (let i=0; i < arr.length; i++) {
    if (arr[i] > 0) {
      const img = {
        src: `${config.imagePartsFolder}/${attributes[i].name}${arr[i]}.png`,
        offsetX: (i == 0) ? 0 : -400,
        offsetY: 0,
      }
      images.push(img);
    }
  }

  // Generate image
  await mergeImagesToPng(images, outFile);
}

function printAttributes(i) {
  let attrs = '[' + faces[i] + '] => ';
  for (let j=0; j<attributes.length; j++) {
    if (faces[i][j] > 0) {
      attrs += attributes[j].attrNames[faces[i][j]-1] + ", ";
    }
  }

  console.log(`Attributes for NFT ${i+1}:`, attrs);
}

async function generateImages() {
  for (let i=0; i<faces.length; i++) {
    printAttributes(i);
    await saveFaceByAttributes(faces[i], `${config.outputFolder}/nft_image_${i+1}.png`);
  }
}

async function main() {
  faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
  await generateImages();
}

main();

