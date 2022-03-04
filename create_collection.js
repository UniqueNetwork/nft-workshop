const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const config = require('./config');
const fs = require('fs');

function strToUTF16(str) {
  let buf = [];
  for (let i=0, strLen=str.length; i < strLen; i++) {
    buf.push(str.charCodeAt(i));
  }
  return buf;
}

function getCreatedCollectionId(events) {
  let success = false;
  let collectionId = 0;
  events.forEach(({ phase, event: { data, method, section } }) => {
    // console.log(`    ${phase}: ${section}.${method}:: ${data}`);
    if (method == 'ExtrinsicSuccess') {
      success = true;
    } else if ((section == 'common')  && (method == 'CollectionCreated')) {
      collectionId = parseInt(data[0].toString());
    }
  });
  return collectionId;
}

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
          let id = getCreatedCollectionId(result.events);
          resolve(id);
          unsub();
        }
      });
    }
    catch (e) {
      reject(e.toString());
    }
  });
}

async function createCollectionAsync(api, signer) {
  const name = "Chelobrick";
  const description = "Unique NFT collection dedicated to Polkadot Decoded 2021";
  const tokenPrefix = "CHEL";
  const modeprm = {nft: null};

  console.log(`=== Create collection ${name} ===`);
  const tx = api.tx.unique.createCollection(strToUTF16(name), strToUTF16(description), strToUTF16(tokenPrefix), modeprm);
  return await submitTransaction(signer, tx);
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

  // // Create collection as owner
  // const collectionId = await createCollectionAsync(api, owner);
  // console.log(`Collection created: ${collectionId}`);
  const collectionId = 2;

  // Set onchain schema
  console.log("=== Set const on-chain schema ===");
  const schema = "{\"nested\":{\"onChainMetaData\":{\"nested\":{\"NFTMeta\":{\"fields\":{\"ipfsJson\":{\"id\":1,\"rule\":\"required\",\"type\":\"string\"},\"traits\":{\"id\":2,\"rule\":\"repeated\",\"type\":\"CheloTrait\"}}},\"CheloTrait\":{\"options\":{\"EYES_1\":\"{\\\"en\\\": \\\"Blah-blah Eyes\\\"}\",\"EYES_2\":\"{\\\"en\\\": \\\"Eyes To The Left\\\"}\",\"EYES_3\":\"{\\\"en\\\": \\\"Eyes To The Right\\\"}\",\"EYES_4\":\"{\\\"en\\\": \\\"Eyes Up\\\"}\",\"EYES_5\":\"{\\\"en\\\": \\\"Eyes Wide Open\\\"}\",\"EYES_6\":\"{\\\"en\\\": \\\"Pirate Eye\\\"}\",\"EYES_7\":\"{\\\"en\\\": \\\"Professor Eyes\\\"}\",\"EYES_8\":\"{\\\"en\\\": \\\"Red Pixel Glasses\\\"}\",\"EYES_9\":\"{\\\"en\\\": \\\"Sunglasses\\\"}\",\"EARRINGS_1\":\"{\\\"en\\\": \\\"Long Black Earrings\\\"}\",\"EARRINGS_2\":\"{\\\"en\\\": \\\"Black Earrings\\\"}\",\"EARRINGS_3\":\"{\\\"en\\\": \\\"Long Black Left Earring\\\"}\",\"EARRINGS_4\":\"{\\\"en\\\": \\\"Black Left Earring\\\"}\",\"EARRINGS_5\":\"{\\\"en\\\": \\\"Long Black Right Earring\\\"}\",\"EARRINGS_6\":\"{\\\"en\\\": \\\"Black Right Earring\\\"}\",\"EARRINGS_7\":\"{\\\"en\\\": \\\"Long Red Earrings\\\"}\",\"EARRINGS_8\":\"{\\\"en\\\": \\\"Red Earrings\\\"}\",\"EARRINGS_9\":\"{\\\"en\\\": \\\"Long Red Left Earring\\\"}\",\"EARRINGS_10\":\"{\\\"en\\\": \\\"Red Left Earring\\\"}\",\"EARRINGS_11\":\"{\\\"en\\\": \\\"Long Red Right Earring\\\"}\",\"EARRINGS_12\":\"{\\\"en\\\": \\\"Red Right Earring\\\"}\",\"MOUTH_1\":\"{\\\"en\\\": \\\"LOL Teeth\\\"}\",\"MOUTH_2\":\"{\\\"en\\\": \\\"Mexican Mustache\\\"}\",\"MOUTH_3\":\"{\\\"en\\\": \\\"Black Mustache\\\"}\",\"MOUTH_4\":\"{\\\"en\\\": \\\"Gold Mustache\\\"}\",\"MOUTH_5\":\"{\\\"en\\\": \\\"Oops Left\\\"}\",\"MOUTH_6\":\"{\\\"en\\\": \\\"Oops Right\\\"}\",\"MOUTH_7\":\"{\\\"en\\\": \\\"Piglet Mouth\\\"}\",\"MOUTH_8\":\"{\\\"en\\\": \\\"Sad Face\\\"}\",\"MOUTH_9\":\"{\\\"en\\\": \\\"Smile\\\"}\",\"MOUTH_10\":\"{\\\"en\\\": \\\"Vampire\\\"}\",\"MOUTH_11\":\"{\\\"en\\\": \\\"White Beard\\\"}\",\"MOUTH_12\":\"{\\\"en\\\": \\\"Wide Smile\\\"}\",\"MOUTH_13\":\"{\\\"en\\\": \\\"Wooah\\\"}\",\"BEARD_1\":\"{\\\"en\\\": \\\"Short Box Orange Beard\\\"}\",\"BEARD_2\":\"{\\\"en\\\": \\\"Short Box Black Beard\\\"}\",\"BEARD_3\":\"{\\\"en\\\": \\\"Chin Strap Black Beard\\\"}\",\"BEARD_4\":\"{\\\"en\\\": \\\"Chin Strap Orange Beard\\\"}\",\"BEARD_5\":\"{\\\"en\\\": \\\"Balbo Black Beard\\\"}\",\"BEARD_6\":\"{\\\"en\\\": \\\"Balbo Orange Beard\\\"}\",\"BEARD_7\":\"{\\\"en\\\": \\\"Gunslinger Black Beard\\\"}\",\"BEARD_8\":\"{\\\"en\\\": \\\"Gunslinger Orange Beard\\\"}\",\"BEARD_9\":\"{\\\"en\\\": \\\"3-day Stubble Black\\\"}\",\"BEARD_10\":\"{\\\"en\\\": \\\"3-day Stubble Orange\\\"}\",\"BEARD_11\":\"{\\\"en\\\": \\\"Hipster Black Beard\\\"}\",\"BEARD_12\":\"{\\\"en\\\": \\\"Hipster Orange Beard\\\"}\",\"PRINT_1\":\"{\\\"en\\\": \\\"Berry Print\\\"}\",\"PRINT_2\":\"{\\\"en\\\": \\\"Black Heart Print\\\"}\",\"PRINT_3\":\"{\\\"en\\\": \\\"Blue Parrot Print\\\"}\",\"PRINT_4\":\"{\\\"en\\\": \\\"Hate Print\\\"}\",\"PRINT_5\":\"{\\\"en\\\": \\\"Heart Print\\\"}\",\"PRINT_6\":\"{\\\"en\\\": \\\"Orange Print\\\"}\",\"PRINT_7\":\"{\\\"en\\\": \\\"Unique Black Logo\\\"}\",\"PRINT_8\":\"{\\\"en\\\": \\\"Unique Blue Logo\\\"}\",\"PRINT_9\":\"{\\\"en\\\": \\\"Yellow Parrot Print\\\"}\",\"PRINT_10\":\"{\\\"en\\\": \\\"Berry Print\\\"}\",\"PRINT_11\":\"{\\\"en\\\": \\\"Black Heart Print\\\"}\",\"PRINT_12\":\"{\\\"en\\\": \\\"Blue Parrot Print\\\"}\",\"PRINT_13\":\"{\\\"en\\\": \\\"Love Print\\\"}\",\"PRINT_14\":\"{\\\"en\\\": \\\"Heart Print\\\"}\",\"PRINT_15\":\"{\\\"en\\\": \\\"Orange Print\\\"}\",\"PRINT_16\":\"{\\\"en\\\": \\\"Unique Black Logo\\\"}\",\"PRINT_17\":\"{\\\"en\\\": \\\"Unique Blue Logo\\\"}\",\"PRINT_18\":\"{\\\"en\\\": \\\"Yellow Parrot Print\\\"}\"},\"values\":{\"EYES_1\":0,\"EYES_2\":1,\"EYES_3\":2,\"EYES_4\":3,\"EYES_5\":4,\"EYES_6\":5,\"EYES_7\":6,\"EYES_8\":7,\"EYES_9\":8,\"EARRINGS_1\":9,\"EARRINGS_2\":10,\"EARRINGS_3\":11,\"EARRINGS_4\":12,\"EARRINGS_5\":13,\"EARRINGS_6\":14,\"EARRINGS_7\":15,\"EARRINGS_8\":16,\"EARRINGS_9\":17,\"EARRINGS_10\":18,\"EARRINGS_11\":19,\"EARRINGS_12\":20,\"MOUTH_1\":21,\"MOUTH_2\":22,\"MOUTH_3\":23,\"MOUTH_4\":24,\"MOUTH_5\":25,\"MOUTH_6\":26,\"MOUTH_7\":27,\"MOUTH_8\":28,\"MOUTH_9\":29,\"MOUTH_10\":30,\"MOUTH_11\":31,\"MOUTH_12\":32,\"MOUTH_13\":33,\"BEARD_1\":34,\"BEARD_2\":35,\"BEARD_3\":36,\"BEARD_4\":37,\"BEARD_5\":38,\"BEARD_6\":39,\"BEARD_7\":40,\"BEARD_8\":41,\"BEARD_9\":42,\"BEARD_10\":43,\"BEARD_11\":44,\"BEARD_12\":45,\"PRINT_1\":46,\"PRINT_2\":47,\"PRINT_3\":48,\"PRINT_4\":49,\"PRINT_5\":50,\"PRINT_6\":51,\"PRINT_7\":52,\"PRINT_8\":53,\"PRINT_9\":54,\"PRINT_10\":55,\"PRINT_11\":56,\"PRINT_12\":57,\"PRINT_13\":58,\"PRINT_14\":59,\"PRINT_15\":60,\"PRINT_16\":61,\"PRINT_17\":62,\"PRINT_18\":63}}}}}}";
  const tx4 = api.tx.unique.setConstOnChainSchema(collectionId, strToUTF16(schema));
  await submitTransaction(owner, tx4);

  // // Set offchain schema
  // console.log("=== Set schema version ===");
  // const tx2 = api.tx.unique.setSchemaVersion(collectionId, 'ImageURL');
  // await submitTransaction(owner, tx2);

  // console.log("=== Set offchain schema ===");
  // const tx3 = api.tx.unique.setOffchainSchema(collectionId, `https://ipfs-gateway.usetech.com/ipfs/QmdgxocQzdseLhVqcDGUrSyJhq8bsiKqzGdUqzgj8j5zSt/image{id}.gif`);
  // await submitTransaction(owner, tx3);
}

main().catch(console.error).finally(() => process.exit());
