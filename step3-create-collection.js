const config = require('./config');
const attributes = config.attributes;
const createZipArchive = require('./scripts/create-zip');
const initializeSdk = require('./scripts/initialize-sdk');
const uploadImages = require('./scripts/upload-images');
const { readData, writeData } = require('./scripts/utils');

const inputDataForCreateCollection = {
  mode: 'Nft',
  name: config.collectionName,
  description: config.collectionDescription,
  tokenPrefix: config.tokenPrefix,
  metaUpdatePermission: 'ItemOwner',
  readOnly: true,
  schema: {
    coverPicture: {},
    image: {
      urlTemplate: '<base URL>/ipfs/<your IPFS folder hash>/{infix}'
    },
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0'
  }
}

async function main() {

  const zipPath = await createZipArchive();
  const { sdk, signer } = await initializeSdk();
  // todo remove with @unique-nft/sdk@^0.1.6
  sdk.instance.defaults.maxBodyLength = Infinity;
  let fileUrl = await readData('fileUrl');
  if (!fileUrl) fileUrl = await uploadImages(sdk, zipPath);

  console.log('=== Create collection ===');
  const attributesSchema = {};
  attributes.forEach(({ name, required, values }, i) => {
    const enumValues = {};
    values.forEach((value, j) => {
      enumValues[j.toString()] = { _: value.value ?? value  };
    });
    attributesSchema[i.toString()] = {
      name: {
        _: name,
      },
      type: 'string',
      optional: !required,
      isArray: false,
      enumValues: enumValues
    };
  });

  inputDataForCreateCollection.schema.attributesSchema = attributesSchema;
  inputDataForCreateCollection.schema.image.urlTemplate = `${fileUrl}/{infix}`;
  inputDataForCreateCollection.schema.coverPicture = config.coverFileName
    ? { urlInfix: config.coverFileName }
    : { ipfsCid: '' };

  const { parsed: { collectionId }} =
      await sdk.collections.creation.submitWaitResult(
          {
            ...inputDataForCreateCollection,
            address: signer.instance.address
          },
      );
  await writeData('collectionId', collectionId);
  console.log(`Collection created: ${collectionId}`);
}

main().catch(console.error).finally(() => process.exit());
