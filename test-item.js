const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const config = require('./config');
const fs = require('fs');
const {serializeNft, deserializeNft} = require('./protobuf.js');
const schema = fs.readFileSync(`${config.outputFolder}/${config.outputSchema}`);

async function main() {
  // Initialise the provider to connect to the node
  const wsProvider = new WsProvider(config.wsEndpoint);

  // Create the API and wait until ready
  const defs = require('@unique-nft/types/definitions');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    rpc: { unique: defs.unique.rpc }
  });

  // Test item
  const itemId = 1;

  const metadata = await api.rpc.unique.constMetadata(config.collectionId, itemId);
  console.log(metadata.toString());

  const payload = deserializeNft(schema, Buffer.from(metadata, "hex"), "en");
  console.log("Deserialized NFT properties:", payload);
}

main().catch(console.error).finally(() => process.exit());
