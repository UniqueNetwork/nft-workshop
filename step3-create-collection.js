const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');
const config = require('./config');
const attributes = config.attributes;
const createZipArchive = require("./scripts/create-zip");
const initializeSdk = require("./scripts/initialize-sdk");
const uploadImages = require("./scripts/upload-images");

const inputDataForCreateCollection = {
  mode: 'Nft',
  name: 'NFTWorkshop',
  description: 'NFT Workshop collection',
  tokenPrefix: 'TMP',
  metaUpdatePermission: 'ItemOwner',
  readOnly: true,
  schema: {
    coverPicture: {
      ipfsCid: '',
    },
    image: {
      urlTemplate: '<base URL>/ipfs/<your IPFS folder hash>/{infix}.png'
    },
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0'
  }
}

async function main() {

  const zipPath = await createZipArchive();
  const { sdk, signer } = await initializeSdk();
  const fileUrl = await uploadImages(sdk, zipPath);

  console.log("=== Create collection ===");
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
  inputDataForCreateCollection.schema.image.urlTemplate = `${fileUrl}/{infix}.png`;

  const {parsed: {collectionId}} =
      await sdk.collections.creation.submitWaitResult(
          {
            ...inputDataForCreateCollection,
            address: signer.instance.address
          },
      );
  console.log(`Collection created: ${collectionId}`);
}

main().catch(console.error).finally(() => process.exit());
