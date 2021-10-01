# Create your own NFT collection Workshop

## Step 1: Design image parts

The image parts should generally include some background and combinable parts with transparent background.

## Step 2: Describe NFT traits

The `attributes.js` file should describe traits of your NFT collection. Each trait should have 

  * A `name` field that is used as a file name prefix for accessing your NFT part images. For example, all "ball" images are kept in files like `images/ball1.png`, `images/ball2.png`, etc.
  * Number of possible trait values in `count` field. In case of the `ball' part it is equal to the total number of `ball*.png` images
  * A `required` field basically tells the image generator that a certain trait should always be present or not
  * The `attrNames` field contains trait names. For example, the `images/car1.png` adds a Blue Car to the NFT.

```
const attributes = [
    { name: "ball",   count: 4, required: true,  attrNames: ["Blue ball", "Green ball", "Red ball", "Black ball"] },
    { name: "car",    count: 3, required: false, attrNames: ["Blue car", "Red car", "Yellow car"] },
    { name: "heart",  count: 2, required: false, attrNames: ["Red heart", "Blue heart"] }
  ];
```

## Step 3: Prepare Substrate Address with Seed

If you have never worked with Substrate addresses and seeds before, use these steps from the Marketplace README guide:

  * [Install Polkadot{.js} Extension](https://github.com/UniqueNetwork/marketplace-docker#step-1---install-polkadotjs-extension)
  * [Create Admin Address](https://github.com/UniqueNetwork/marketplace-docker#step-2---create-admin-address)
  * [Get Unique Tokens](https://github.com/UniqueNetwork/marketplace-docker#step-3---get-unique)


## Step 4: Create your Collection Owner Seed

Once you have the Seed Phrase ready, create `config.js` from `config.example.js` file and add your Seed Phrase to the `config.js` in `ownerSeed` field (replace `//Alice`):

```
const config = {
    wsEndpoint: 'wss://testnet2.unique.network',
    ownerSeed: '//Alice',

    imagePartsFolder: "./images",
    outputFolder: "./generated_nfts",
    outputJSON: "nfts.json",
    outputSchema: "schema.json",
    desiredCount: 20
}
```

## Step 5: Generate NFT Properties

Execute following commands in the terminal. This script will generate a unique set of NFT properties for each NFT.

```
npm install
node nft-generator.js
```

## Step 6: Generate NFT Images

This script will generate NFT images from image parts using the NFT properties generated on the previous step.

```
node image-generator.js
```

## Step 7: Create Collection

At this step you will create the NFT collection and set it's properties on-chain.

First, configure the main collection properties such as name, description, and token prefix in `create_collection.js` file. These properties cannot be changed later:
```
async function createCollectionAsync(api, signer) {
  const name = "NFTWorkshop";
  const description = "NFT Workshop collection";
  const tokenPrefix = "TMP";
  const modeprm = {nft: null};

  const tx = api.tx.nft.createCollection(strToUTF16(name), strToUTF16(description), strToUTF16(tokenPrefix), modeprm);
  return await submitTransaction(signer, tx);
}
```

Now you are ready to execute the blockchain transactions:
```
node create_collection.js
```

## Step 8: 

Now it's time to mint NFTs. Execute this script and wait for it to complete:
```
node create_items.js
```

## Step 9: See your NFTs in the wallet

Open [https://wallet.unique.network](https://wallet.unique.network) and enjoy your new collection!