const { KeyringProvider } = require('@unique-nft/accounts/keyring');
const { Sdk } = require('@unique-nft/sdk');
const config = require('./config');
const attributes = require('./attributes');

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
      urlTemplate: 'http://localhost:8080/ipfs/<your IPFS folder hash>/{infix}.png'
    },
    schemaName: 'unique',
    schemaVersion: '1.0.0',
    attributesSchemaVersion: '1.0.0'
  }
}

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

  const { parsed: { collectionId } } =
      await sdk.collections.creation.submitWaitResult(
          {
            ...inputDataForCreateCollection,
            address: signer.instance.address
          },
      );
  console.log(`Collection created: ${collectionId}`);
}

main().catch(console.error).finally(() => process.exit());
