const config = require('./config');
const faces = require(`${config.outputFolder}/${config.outputJSON}`);
const { KeyringProvider } = require("@unique-nft/accounts/keyring");
const { Sdk } = require("@unique-nft/sdk");
const numberElementsInChunk = 50; // todo убрать в конфиг

async function main() {
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

  // todo ты забыла здесь заливку архива с изображениями
  // todo файлик create-nfts.js надо будет удалить
  // todo я бы еще в названия файлов добавил типа step_1_create_collection

  // todo attributes.js сможем убрать в конфиг?

  // todo много файлов в корне, надо хотя бы generate-image.worker.js убрать в ./sripts/...

  // todo runtime_types.json может удалить?

  let result = [];
  let chunkNumber = 0;
  while (result.length < config.desiredCount) {
    if (chunkNumber > config.desiredCount / numberElementsInChunk) throw new Error('unexpected value chunkNumber');
    const chunkData = data.slice(chunkNumber * numberElementsInChunk, (chunkNumber + 1) * numberElementsInChunk);
    const { parsed } = await sdk.tokens.createMultiple.submitWaitResult({
      address: signer.instance.address,
      collectionId: config.collectionId,
      data: chunkData
    }); // todo здесь надо заюзать buildBatch, и добавить типа chunksPerBlock
    // todo надо попробовать 200-500 в блок положить

    result = [ ...result, ...parsed];
    await new Promise(resolve => setTimeout(resolve, 1000));
    chunkNumber++;
    console.log(`successfully created batch of tokens ${chunkNumber}`);
  }

  console.log('Items created');
  console.log(`Token Ids: ${result.map(el => el.tokenId).join(', ')}`);
}

main().catch(console.error).finally(() => process.exit());
