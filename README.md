# Create your own NFT Collection Workshop

## Step 1: Design image parts

The image parts should generally include some background and combinable parts with transparent background. Store them in `images` folder. In this example the background images are stoted in `ball*.png` files like this one:

![images/ball1.png](images/ball1.png)

If you have three background images, store them respectively in `images/ball1.png`, `images/ball2.png`, `images/ball3.png`, and `images/ball4.png` files.

The combinable parts are stored as `car*.png` and `heart*.png`, so when a particular combination of parts is composed, it results in a unqiue NFT image:

![doc/combine.png](doc/combine.png)

The combinable parts are also stored in numbered files like `images/car1.png`, `images/car2.png` ... and `images/heart1.png`, `images/heart2.png` ...


## Step 2: Describe NFT traits

Generally, combinable parts produce NFT traits. For example, if the `car1.png` image is used to generate the NFT image, it will have `Blue car` trait. Here is how to code this:

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

The order in which traits come is important: It is used as a z-order when images are combined. The traits (parts) that come lower in the list of traits will be added to the image later, so they will cover up parts that come earlier.

## Step 3: Prepare Substrate Address with Seed

If you have never worked with Substrate addresses and seeds before, use these steps from the Marketplace README guide:

  * [Install Polkadot{.js} Extension](https://github.com/UniqueNetwork/marketplace-docker#step-1---install-polkadotjs-extension)
  * [Create Admin Address](https://github.com/UniqueNetwork/marketplace-docker#step-2---create-admin-address)
  * [Get Unique Tokens](https://github.com/UniqueNetwork/marketplace-docker#step-3---get-unique)


## Step 4: Configure Collection Owner Seed

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

Execute following commands in the terminal. The `nft-generator.js` script will generate a unique set of NFT properties for each NFT.

```
npm install
node nft-generator.js
```

This script will create `generated_nfts` folder, and save two files: `nfts.json` - array of NFT properties for each NFT, and `schema.json` - the protobuf schema file with programmatic description of properties that will be later used to mint the collection.

## Step 6: Generate NFT Images

This script will generate NFT images from image parts using the NFT properties generated in the previous step.

```
node image-generator.js
```

This script will add NFT images to `generated_nfts` folder.

## Step 7: Host images on IPFS

1. Install IPFS daemon on your computer:
https://docs.ipfs.io/install/command-line/#official-distributions

2. ipfs init

3. ipfs add -r generated_nfts/

```
$ ipfs add -r generated_nfts/
added Qmd2uwLhrt8EvBE4xuMMFd9vbT97yzeeRtGx2aqJxAoD8S generated_nfts/nft_image_1.png
added Qmd2uwLhrt8EvBE4xuMMFd9vbT97yzeeRtGx2aqJxAoD8S generated_nfts/nft_image_10.png
added QmaZaiwabE48ijXhp4dUKfA6NVE4ef9gsmKX2Ws5RH4deF generated_nfts/nft_image_11.png
added QmbXbxAL5S3kdDTi3JRyB8vGu3FvrDs9gqVzBNUWqBpAjV generated_nfts/nft_image_12.png
added QmTqyPWPwXex1UaCLFtwcFKcAp8V4mieovNqpDDA2jz9Lo generated_nfts/nft_image_13.png
added QmQQFfbLLk8aQ69HBanCtMM9dCd36JqoQzaUCLGMbhytze generated_nfts/nft_image_14.png
added QmPtdJXgbZwxCzdtxWshx1vVyC3oQfeNNpTgrT74tHzir2 generated_nfts/nft_image_15.png
added QmYkCtwQaoM3bydNCwBB9ajSaxvJoohMPgAfGQSX3HkcjB generated_nfts/nft_image_16.png
added QmNbmdg4yBeZghZgGfRptTGZZ3kdsAm81C3ivQUsx1353W generated_nfts/nft_image_17.png
added Qme2DStpDHgh3GGMY7hVMXGvzgCWSK2fG8twudfvyRf82s generated_nfts/nft_image_18.png
added Qmd29iPiLHeWE6NRc8vumDqimJNFzankdDdRa9gmrQZZ7B generated_nfts/nft_image_19.png
added QmNbmdg4yBeZghZgGfRptTGZZ3kdsAm81C3ivQUsx1353W generated_nfts/nft_image_2.png
added QmbXbxAL5S3kdDTi3JRyB8vGu3FvrDs9gqVzBNUWqBpAjV generated_nfts/nft_image_20.png
added QmRLsfhos7dLqzd4Y6PijgvmTqRfJLb8nafjkteamUEkSW generated_nfts/nft_image_3.png
added QmYkCtwQaoM3bydNCwBB9ajSaxvJoohMPgAfGQSX3HkcjB generated_nfts/nft_image_4.png
added QmQQFfbLLk8aQ69HBanCtMM9dCd36JqoQzaUCLGMbhytze generated_nfts/nft_image_5.png
added Qmcisrkhza4onXAdqeVnJF9Zn14uqZr2X4dPNmAM9JYB83 generated_nfts/nft_image_6.png
added QmbwdrrWgNo2Vpsu7vCkTZTTKHcKE1f5LTrwgEzX1YRtAa generated_nfts/nft_image_7.png
added QmPtdJXgbZwxCzdtxWshx1vVyC3oQfeNNpTgrT74tHzir2 generated_nfts/nft_image_8.png
added Qme9BDZ9k5m3dcvbrgbQjsuE6NdTtkVxVMuCkczsVMxNnK generated_nfts/nft_image_9.png
added QmS4Sskhvuepykb5FUNpsKbXY1qgcY4efFbcBjUyUvN39c generated_nfts/nfts.json
added QmZAYT7xTJWrU3mPFZrfAAaAaL4JhvtHRbh25UrtkBcUH6 generated_nfts/schema.json
added QmPWcNUZmnitYKmvPXXGL6mjyGdXJLtk3yJDMABjDWQWoM generated_nfts
```

Look for the folder hash: QmPWcNUZmnitYKmvPXXGL6mjyGdXJLtk3yJDMABjDWQWoM

4. Test it after 10-15 minutes:

https://ipfs-gateway.usetech.com/ipfs/<your folder hash>
https://ipfs.infura.io/ipfs/<your folder hash>

5. How to make IPFS work faster:

Install IPFS gateway:

ipfs daemon

Open:
http://localhost:8080/ipfs/QmPWcNUZmnitYKmvPXXGL6mjyGdXJLtk3yJDMABjDWQWoM/nft_image_1.png

## Step 8: Create Collection

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

Second, configure the image path here in `create_collection.js` file:

```
  console.log("=== Set offchain schema ===");
  const tx3 = api.tx.nft.setOffchainSchema(collectionId, `http://localhost:8080/ipfs/<your IPFS folder hash>/nft_image_{id}.png`);
  await submitTransaction(owner, tx3);
```

Now you are ready to execute the blockchain transactions:
```
node create_collection.js
```

Note the output with collection ID: 
```

```

## Step 9: 

Now it's time to mint NFTs. Execute this script and wait for it to complete:
```
node create_items.js
```

## Step 10: See your NFTs in the wallet

Open [https://wallet.unique.network](https://wallet.unique.network) and enjoy your new collection!