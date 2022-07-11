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

function vec2str(arr) {
  return arr.map(x => String.fromCharCode(parseInt(x))).join('');
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
  const options = {
    mode: modeprm,
    name: strToUTF16(name),
    description: strToUTF16(description),
    tokenPrefix: tokenPrefix
  };

  console.log(`=== Create collection ${name} ===`);
  const tx = api.tx.unique.createCollectionEx(options);
  return await submitTransaction(signer, tx);
}

async function main() {
  // Initialise the provider to connect to the node
  const wsProvider = new WsProvider(config.wsEndpoint);

  // Create the API and wait until ready
  const defs = require('@unique-nft/unique-mainnet-types/definitions');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    rpc: { unique: defs.unique.rpc }
  });

  // Owners's keypair
  const keyring = new Keyring({ type: 'sr25519' });
  const owner = keyring.addFromUri(config.ownerSeed);
  console.log("Collection owner address: ", owner.address);

  // Output chain info for clarity
  const chain = await api.rpc.system.chain();
  console.log('===============================================')  
  console.log('Connected to chain: ' + chain)  
  console.log('----------------------')  

  // // Create collection as owner
  const collectionId = await createCollectionAsync(api, owner);
  console.log(`Collection created: ${collectionId}`);
  // const collectionId = 1;

  // Test created collection
  const c = (await api.rpc.unique.collectionById(collectionId)).toHuman();
  console.log('===============================================')  
  console.log('Testing collection')  
  console.log(`    Collection name:        ${vec2str(c.name)}`);
  console.log(`    Collection description: ${vec2str(c.description)}`);
  console.log(`    Token Prefix:           ${c.tokenPrefix}`);
  console.log('----------------------')  

  // Set onchain schema
  // console.log("=== Set const on-chain schema ===");
  // const schema = "{\"nested\":{\"onChainMetaData\":{\"nested\":{\"NFTMeta\":{\"fields\":{\"ipfsJson\":{\"id\":1,\"rule\":\"required\",\"type\":\"string\"},\"gender\":{\"id\":2,\"rule\":\"required\",\"type\":\"Gender\"},\"traits\":{\"id\":3,\"rule\":\"repeated\",\"type\":\"PunkTrait\"}}},\"Gender\":{\"options\":{\"Female\":\"{\\\"en\\\": \\\"Female\\\"}\",\"Male\":\"{\\\"en\\\": \\\"Male\\\"}\"},\"values\":{\"Female\":1,\"Male\":0}},\"PunkTrait\":{\"options\":{\"BLACK_LIPSTICK\":\"{\\\"en\\\": \\\"Black Lipstick\\\"}\",\"RED_LIPSTICK\":\"{\\\"en\\\": \\\"Red Lipstick\\\"}\",\"SMILE\":\"{\\\"en\\\": \\\"Smile\\\"}\",\"TEETH_SMILE\":\"{\\\"en\\\": \\\"Teeth Smile\\\"}\",\"PURPLE_LIPSTICK\":\"{\\\"en\\\": \\\"Purple Lipstick\\\"}\",\"NOSE_RING\":\"{\\\"en\\\": \\\"Nose Ring\\\"}\",\"ASIAN_EYES\":\"{\\\"en\\\": \\\"Asian Eyes\\\"}\",\"SUNGLASSES\":\"{\\\"en\\\": \\\"Sunglasses\\\"}\",\"RED_GLASSES\":\"{\\\"en\\\": \\\"Red Glasses\\\"}\",\"ROUND_EYES\":\"{\\\"en\\\": \\\"Round Eyes\\\"}\",\"LEFT_EARRING\":\"{\\\"en\\\": \\\"Left Earring\\\"}\",\"RIGHT_EARRING\":\"{\\\"en\\\": \\\"Right Earring\\\"}\",\"TWO_EARRINGS\":\"{\\\"en\\\": \\\"Two Earrings\\\"}\",\"BROWN_BEARD\":\"{\\\"en\\\": \\\"Brown Beard\\\"}\",\"MUSTACHE_BEARD\":\"{\\\"en\\\": \\\"Mustache Beard\\\"}\",\"MUSTACHE\":\"{\\\"en\\\": \\\"Mustache\\\"}\",\"REGULAR_BEARD\":\"{\\\"en\\\": \\\"Regular Beard\\\"}\",\"UP_HAIR\":\"{\\\"en\\\": \\\"Up Hair\\\"}\",\"DOWN_HAIR\":\"{\\\"en\\\": \\\"Down Hair\\\"}\",\"MAHAWK\":\"{\\\"en\\\": \\\"Mahawk\\\"}\",\"RED_MAHAWK\":\"{\\\"en\\\": \\\"Red Mahawk\\\"}\",\"ORANGE_HAIR\":\"{\\\"en\\\": \\\"Orange Hair\\\"}\",\"BUBBLE_HAIR\":\"{\\\"en\\\": \\\"Bubble Hair\\\"}\",\"EMO_HAIR\":\"{\\\"en\\\": \\\"Emo Hair\\\"}\",\"THIN_HAIR\":\"{\\\"en\\\": \\\"Thin Hair\\\"}\",\"BALD\":\"{\\\"en\\\": \\\"Bald\\\"}\",\"BLONDE_HAIR\":\"{\\\"en\\\": \\\"Blonde Hair\\\"}\",\"CARET_HAIR\":\"{\\\"en\\\": \\\"Caret Hair\\\"}\",\"PONY_TAILS\":\"{\\\"en\\\": \\\"Pony Tails\\\"}\",\"CIGAR\":\"{\\\"en\\\": \\\"Cigar\\\"}\",\"PIPE\":\"{\\\"en\\\": \\\"Pipe\\\"}\"},\"values\":{\"BLACK_LIPSTICK\":0,\"RED_LIPSTICK\":1,\"SMILE\":2,\"TEETH_SMILE\":3,\"PURPLE_LIPSTICK\":4,\"NOSE_RING\":5,\"ASIAN_EYES\":6,\"SUNGLASSES\":7,\"RED_GLASSES\":8,\"ROUND_EYES\":9,\"LEFT_EARRING\":10,\"RIGHT_EARRING\":11,\"TWO_EARRINGS\":12,\"BROWN_BEARD\":13,\"MUSTACHE_BEARD\":14,\"MUSTACHE\":15,\"REGULAR_BEARD\":16,\"UP_HAIR\":17,\"DOWN_HAIR\":18,\"MAHAWK\":19,\"RED_MAHAWK\":20,\"ORANGE_HAIR\":21,\"BUBBLE_HAIR\":22,\"EMO_HAIR\":23,\"THIN_HAIR\":24,\"BALD\":25,\"BLONDE_HAIR\":26,\"CARET_HAIR\":27,\"PONY_TAILS\":28,\"CIGAR\":29,\"PIPE\":30}}}}}}";
  // const tx4 = api.tx.unique.setConstOnChainSchema(collectionId, strToUTF16(schema));
  // await submitTransaction(owner, tx4);

  // // Set offchain schema
  // console.log("=== Set schema version ===");
  // const tx2 = api.tx.unique.setSchemaVersion(collectionId, 'ImageURL');
  // await submitTransaction(owner, tx2);

  // console.log("=== Set offchain schema ===");
  // const tx3 = api.tx.unique.setOffchainSchema(collectionId, `https://ipfs-gateway.usetech.com/ipfs/QmdgxocQzdseLhVqcDGUrSyJhq8bsiKqzGdUqzgj8j5zSt/image{id}.gif`);
  // await submitTransaction(owner, tx3);
}

main().catch(console.error).finally(() => process.exit());
