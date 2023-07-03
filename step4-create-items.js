const config = require('./config');
const initializeSdk = require('./scripts/initialize-sdk');
const { readData, readCSV } = require('./scripts/utils');

let faces;
async function main() {
  faces = await readCSV(`${config.outputFolder}/nfts.csv`);
  console.log('=== Create items ===');

  const collectionId = await readData('collectionId');
  if (!collectionId) throw new Error('not found collectionId');

  const { sdk, signer } = await initializeSdk();

  const { tokenId: lastTokenId } = await sdk.collections.lastTokenId({ collectionId });
  const offset = lastTokenId || 0;
  if (config.desiredCount <= offset) {
    console.log('tokens already created');
    return;
  }

  const data = Array(config.desiredCount)
    .slice(offset || 0)
    .fill({})
    .map((el, i) => {
      const n = i + 1;
      const image = { urlInfix: `${config.imagePrefix}${n}.png`};
      const encodedAttributes = {};
      faces[i].forEach((el, j) => {
        if (el) {
          const imageIdx = config.attributes[j].values.findIndex(v => v === el || v.value === el) + 1;
          if(imageIdx === 0) throw Error('imageIdx cannot be null');    
          encodedAttributes[j] = imageIdx - 1;
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
  while (result.length + offset < config.desiredCount) {
    if (chunkNumber > config.desiredCount / config.numberOfTokensGeneratedAtOnce) throw new Error('unexpected value chunkNumber');
    const chunkData = data.slice(chunkNumber * config.numberOfTokensGeneratedAtOnce, (chunkNumber + 1) * config.numberOfTokensGeneratedAtOnce);
    const { parsed } = await sdk.tokens.createMultiple.submitWaitResult({
      address: signer.instance.address,
      collectionId: collectionId,
      tokens: chunkData
    });

    result = [ ...result, ...parsed];
    await new Promise(resolve => setTimeout(resolve, 1000));
    chunkNumber++;
    console.log(`successfully created ${chunkNumber} part of tokens`);
  }

  console.log('Items created');
  console.log(`Token Ids: ${result.map(el => el.tokenId).join(', ')}`);
}

main().catch(console.error).finally(() => process.exit());
