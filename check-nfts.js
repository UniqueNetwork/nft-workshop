const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const config = require('./config');
const fs = require('fs');
const {serializeNft, deserializeNft} = require('./protobuf.js');
const faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
const schema = fs.readFileSync(`${config.outputFolder}/${config.outputSchema}`);

function encode(payload) {
  return serializeNft(schema, payload);
};

function isValidAddressPolkadotAddress(address) {
    try {
        encodeAddress(decodeAddress(address));
        return true;
    } catch (error) {
        return false;
    }
};

async function main() {
  for (let i=1; i<=faces.length; i++) {
    console.log(`Checking item ${i} from attributes [${faces[i-1]}]`);

    // Create traits from attributes
    const nft = {
      "Badge Type": faces[i-1][1],
    };
    if (faces[i-1][0].length > 0) nft["Ambassador Name"] = faces[i-1][0];
    console.log("Original payload:", nft);

    const buffer = encode(nft);
    console.log("Serialized NFT properties:", Array.from(buffer));

    // Test address
    if (faces[i-1][2] && (!isValidAddressPolkadotAddress(faces[i-1][2])))
        throw new Error(`Item ${i} has invalid address: "${faces[i-1][2]}"`);

    // Test deserialization
    const payload = deserializeNft(schema, buffer, "en");
    console.log("Deserialized NFT properties:", payload);

    // Compare
    if (payload['Ambassador Name'] == nft['Ambassador Name'])
        console.log("Item OK");
    else throw new Error(`Item ${i} failed to verify`);
  }

  console.log('All items OK');
}

main().catch(console.error).finally(() => process.exit());
