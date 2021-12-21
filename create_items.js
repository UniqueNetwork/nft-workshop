const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const config = require('./config');
const fs = require('fs');
const {serializeNft, deserializeNft} = require('./protobuf.js');
const faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));
const schema = fs.readFileSync(`${config.outputFolder}/${config.outputSchema}`);
const attributes = require('./attributes');

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

async function createItemAsync(api, signer, buffer) {
  const createData = {
    NFT: { constData: Array.from(buffer), variableData: [] },
  };

  const tx = api.tx.unique.createItem(config.collectionId, {Substrate: config.nftOwner}, createData);
  // const tx = api.tx.unique.createItem(config.collectionId, {Substrate: signer.address}, createData);
  return await submitTransaction(signer, tx);
}


function encode(payload) {
  return serializeNft(schema, payload);
};

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
  const startItem = 51;
  for (let i=startItem; i<=config.desiredCount; i++) {
    console.log(`=================================================\nCreating item ${i} from attributes [${faces[i-1]}]`);

    // Create traits from attributes
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

    await createItemAsync(api, owner, buffer);
    console.log("Item created");
  }

}

main().catch(console.error).finally(() => process.exit());
