const config = require('./config');
const faces = require(`${config.outputFolder}/${config.outputJSON}`);
const initializeSdk = require('./scripts/initialize-sdk');

async function main() {

  const { sdk, signer } = await initializeSdk();

  console.log("=== Create items ===");

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

  let result = [];
  let chunkNumber = 0;
  while (result.length < config.desiredCount) {
    if (chunkNumber > config.desiredCount / config.numberElementsInChunk) throw new Error('unexpected value chunkNumber');
    const chunkData = data.slice(chunkNumber * config.numberElementsInChunk, (chunkNumber + 1) * config.numberElementsInChunk);
    const { parsed } = await sdk.tokens.createMultiple.submitWaitResult({
      address: signer.instance.address,
      collectionId: config.collectionId,
      data: chunkData
    });

    result = [ ...result, ...parsed];
    await new Promise(resolve => setTimeout(resolve, 1000));
    chunkNumber++;
    console.log(`successfully created batch of tokens ${chunkNumber}`);
  }

  console.log('Items created');
  console.log(`Token Ids: ${result.map(el => el.tokenId).join(', ')}`);
}

main().catch(console.error).finally(() => process.exit());
