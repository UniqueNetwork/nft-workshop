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
        } else if (result.status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
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
    NFT: { const_data: Array.from(buffer), variable_data: [] },
  };

  const tx = api.tx.nft.createItem(config.collectionId, signer.address, createData);
  return await submitTransaction(signer, tx);
}


function encode(_traits) {
  const payload = {
    traits: _traits
  };    
  return serializeNft(schema, payload);
};

async function main() {
  // // Initialise the provider to connect to the node
  // const wsProvider = new WsProvider(config.wsEndpoint);
  // const rtt = JSON.parse(fs.readFileSync("./runtime_types.json"));

  // // Create the API and wait until ready
  // const api = await ApiPromise.create({ 
  //   provider: wsProvider,
  //   types: rtt
  // });

  // // Owners's keypair
  // const keyring = new Keyring({ type: 'sr25519' });
  // const owner = keyring.addFromUri(config.ownerSeed);
  // console.log("Collection owner address: ", owner.address);

  // Create items
  const startItem = 1;
  for (let i=startItem; i<=config.desiredCount; i++) {
    console.log(`=================================================\nCreating item ${i} from attributes [${faces[i-1]}]`);

    // Create traits from attributes
    let traits = [];
    let attrOffset = 0;    
    for (let j=0; j<attributes.length; j++) {
      if (faces[i-1][j] != 0) {
        traits.push(faces[i-1][j] + attrOffset - 1);
      }
      attrOffset += attributes[j].count;
    }
    console.log("Traits:", traits);

    const buffer = encode(traits);
    console.log("Serialized NFT properties:", Array.from(buffer));

    // Test
    const payload = deserializeNft(schema, buffer, "en");
    console.log("Deserialized NFT properties:", payload);

    // await createItemAsync(api, owner, buffer);
    // console.log("Item created");
  }

}

main().catch(console.error).finally(() => process.exit());
