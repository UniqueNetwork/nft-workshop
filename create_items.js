const config = require('./config');
const faces = require(`${config.outputFolder}/${config.outputJSON}`);
const { KeyringProvider } = require("@unique-nft/accounts/keyring");
const { Sdk } = require("@unique-nft/sdk");

async function main() {
  // Initialise the SDK
  const provider = new KeyringProvider({ type: 'sr25519' });
  await provider.init();
  const signer = provider.addSeed(config.ownerSeed);

  const clientOptions = {
    baseUrl: config.endpoint,
    signer
  };
  const sdk = new Sdk(clientOptions);

  let data = Array(config.desiredCount).fill({});
  data = data.map((el, i) => {
    const n = i + 1;
    const image = { urlInfix: `${config.imagePrefix}${n}`};
    const encodedAttributes = {};
    faces[i].forEach((el, j) => {
      if (el) {
        encodedAttributes[j] = el - 1;
      }
    });
    return {
      data: {
        image,
        encodedAttributes
      }
    }
  });
  // todo create by 50-100 tokens in circle
  const { parsed } = await sdk.tokens.createMultiple.submitWaitResult({
    address: signer.instance.address,
    collectionId: config.collectionId,
    data
  });
  console.log('Items created');
  console.log(`Token Ids: ${parsed.map(el => el.tokenId).join(', ')}`);
}


main().catch(console.error).finally(() => process.exit());
