const config = require('./config');
const fs = require('fs');
const {serializeNft, deserializeNft} = require('./protobuf.js');
const faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
const schema = fs.readFileSync(`${config.outputFolder}/${config.outputSchema}`);
const attributes = require('./attributes');

function encode(payload) {
  return serializeNft(schema, payload);
};

async function main() {

  // Test items
  const startItem = 1;
  // for (let i=startItem; i<=config.desiredCount; i++) {
  for (let i=startItem; i<=1; i++) {
    console.log(`=================================================\nTesting item ${i} from attributes [${faces[i-1]}]`);

    let traits = [];
    let offset = 0;
    for (let j=0; j<6; j++) {
      traits.push(faces[i-1][j] + offset - 1);
      offset += attributes[j].count;
    }
    const nft = {
      "Traits": traits,
      "Workaholic Name": faces[i-1][6]
    };
    console.log("Original payload:", nft);

    const buffer = encode(nft);
    console.log("Serialized NFT properties:", Array.from(buffer));

    // Test
    const payload = deserializeNft(schema, buffer, "en");
    console.log("Deserialized NFT properties:", payload);

  }

}

main().catch(console.error).finally(() => process.exit());
