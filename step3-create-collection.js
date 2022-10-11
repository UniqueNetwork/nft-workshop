const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');
const config = require('./config');
const attributes = config.attributes;
const createZipArchive = require("./scripts/create-zip");
const initializeSdk = require("./scripts/initialize-sdk");
const uploadImages = require("./scripts/upload-images");

const inputDataForCreateCollection = {
  mode: 'Nft',
  name: 'NFTWorkshop', // todo в конфиг
  description: 'NFT Workshop collection', // todo в конфиг
  tokenPrefix: 'TMP', // todo в конфиг
  metaUpdatePermission: 'ItemOwner',
  readOnly: true,
  schema: {
    coverPicture: {
      ipfsCid: '', // todo вот наверно надо тоже предусмотреть заливку кавера. положить куда его и залить
    },
    image: {
      urlTemplate: '<base URL>/ipfs/<your IPFS folder hash>/{infix}.png' // todo в конфиг
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
  // const fileUrl = 'https://ipfs.uniquenetwork.dev/ipfs/QmWpFqmDFUDTb14ZerbH5hqTwAY6433ztcBeCjaP43z4T2';
  // todo после того как залили надо url тоже положить в джейсон
  // todo это для того чтобы если где то грохнулось по дороге -- не заливать заново

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
