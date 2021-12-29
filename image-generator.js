const fs = require("fs");
const mergeImg = require('merge-img');
const config = require('./config');
const attributes = require('./attributes');

let faces;

function generateImages() {
  for (let i=0; i<faces.length; i++) {
    if (typeof faces[i][0] === 'string' || faces[i][0] instanceof String) {
      const dest = `./images/image${i+1}.gif`;
      let src = '';
      switch (faces[i][1]) {
        case 0: // Candidate
          src = './images/candidate.gif';
          break;
        case 1: // Polka King
          src = './images/polka_king.gif';
          break;
        case 2: // Polka Queen
          src = './images/polka_queen.gif';
          break;
        case 3: // Kusama Prince
          src = './images/kusama_prince.gif';
          break;
        case 4: // Kusama Princess
          src = './images/kusama_princess.gif';
          break;
      }
      fs.copyFileSync(src, dest);
    }
  }
}

async function main() {
  faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
  generateImages();
}

main();

