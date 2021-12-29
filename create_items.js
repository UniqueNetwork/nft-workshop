const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const config = require('./config');
const fs = require('fs');
const {serializeNft, deserializeNft} = require('./protobuf.js');
const faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
const schema = fs.readFileSync(`${config.outputFolder}/${config.outputSchema}`);
const attributes = require('./attributes');
const delay = require('delay');

function submitTransaction(sender, transaction) {
  return new Promise(async function(resolve, reject) {
    try {
      const unsub = await transaction
      .signAndSend(sender, (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          resolve();
          unsub();
        }
      });
    }
    catch (e) {
      reject(e.toString());
    }
  });
}

async function createItemAsync(api, signer, buffer, recipient) {
  const createData = {
    NFT: { constData: Array.from(buffer), variableData: [] },
  };

  const tx = api.tx.unique.createItem(config.collectionId, {Substrate: recipient}, createData);
  return await submitTransaction(signer, tx);
}


function encode(payload) {
  return serializeNft(schema, payload);
};

async function getLastCreatedNFTId(api) {
  return parseInt(await api.rpc.unique.lastTokenId(config.collectionId));
}

async function main() {
  // Initialise the provider to connect to the node
  const wsProvider = new WsProvider(config.wsEndpoint);

  // Create the API and wait until ready
  const defs = require('@unique-nft/types/definitions');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    rpc: { unique: defs.unique.rpc }
  });

  // Owners's keypair
  const keyring = new Keyring({ type: 'sr25519' });
  const owner = keyring.addFromUri(config.ownerSeed);
  console.log("Collection owner address: ", owner.address);

  // Create items
  const startItem = await getLastCreatedNFTId(api) + 1;

  console.log(`WARNING: Will start with NFT ${startItem} in 10 seconds...`);
  await delay(10000);

  for (let i=startItem; i<=faces.length; i++) {
    console.log(`=================================================\nCreating item ${i} from attributes [${faces[i-1]}]`);
    await delay(3000);

    // Create traits from attributes
    const nft = {
      "Badge Type": faces[i-1][1],
    };
    if (faces[i-1][0].length > 0) nft["Ambassador Name"] = faces[i-1][0];
    console.log("Original payload:", nft);

    const buffer = encode(nft);
    console.log("Serialized NFT properties:", Array.from(buffer));

    // Test
    const payload = deserializeNft(schema, buffer, "en");
    console.log("Deserialized NFT properties:", payload);

    await createItemAsync(api, owner, buffer, faces[i-1][2] ? faces[i-1][2] : owner.address);
    console.log("Item created");
  }

}

main().catch(console.error).finally(() => process.exit());
