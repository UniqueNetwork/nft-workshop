# Tutorial: Create your own NFT Collection

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
[https://docs.ipfs.io/install/command-line/#official-distributions](https://docs.ipfs.io/install/command-line/#official-distributions)

2. Initialize IPFS repository:

```
ipfs init
```

3. Add NFT images to IPFS:

```
$ ipfs add -r generated_nfts/
```

You will see this output:
```
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

Look for the folder hash that is usually output last: `QmPWcNUZmnitYKmvPXXGL6mjyGdXJLtk3yJDMABjDWQWoM`

4. Start IPFS daemon locally to speed IPFS up:

```
ipfs daemon
```

Replace `your_folder_hash` with your folder hash and open this URL to test your local IPFS gateway:
http://localhost:8080/ipfs/your_folder_hash/nft_image_1.png

It will take IPFS up to a few days to propagate your files. After this period of time they will be visible on other IPFS gateways too:

* https://ipfs-gateway.usetech.com/ipfs/your_folder_hash
* https://ipfs.infura.io/ipfs/your_folder_hash

## Step 8: Create Collection

At this step you will create the NFT collection and set it's properties on-chain.

First, configure the main collection properties such as name, description, and token prefix in `create_collection.js` file. Note that these properties cannot be changed after the collection is created:
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

Second, configure the image path here in `create_collection.js` file (replace `<your IPFS folder hash>` with your IPFS folder hash). This setting is not permanent, you may change the offchain schema later because offchain files may change their location:
```
  console.log("=== Set offchain schema ===");
  const tx3 = api.tx.nft.setOffchainSchema(collectionId, `http://localhost:8080/ipfs/<your IPFS folder hash>/nft_image_{id}.png`);
  await submitTransaction(owner, tx3);
```

Now you are ready to execute the blockchain transactions:
```
node create_collection.js
```

A typical terminal output for this script should look like follows:

<details>
  <summary>Click to expand</summary>

```
Collection owner address:  5EKt48hu4vPTUGy2Fgmb8M5YCP8WnX6SNg4Pb2ZnCUXhqVFU
=== Create collection ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0x56bd99120e99b8cb6f5780e88965e1c87c68d019184adf3a4e2bcd7f3438b816"}
Transaction included at blockHash 0x56bd99120e99b8cb6f5780e88965e1c87c68d019184adf3a4e2bcd7f3438b816
Current tx status is {"finalized":"0x56bd99120e99b8cb6f5780e88965e1c87c68d019184adf3a4e2bcd7f3438b816"}
Transaction finalized at blockHash 0x56bd99120e99b8cb6f5780e88965e1c87c68d019184adf3a4e2bcd7f3438b816
Collection created: 209
=== Set const on-chain schema ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0xb60fc964a3d19643c7590b7643547da649039d97acb8bb7e62b03fe7bdaa1d6a"}
Transaction included at blockHash 0xb60fc964a3d19643c7590b7643547da649039d97acb8bb7e62b03fe7bdaa1d6a
Current tx status is {"finalized":"0xb60fc964a3d19643c7590b7643547da649039d97acb8bb7e62b03fe7bdaa1d6a"}
Transaction finalized at blockHash 0xb60fc964a3d19643c7590b7643547da649039d97acb8bb7e62b03fe7bdaa1d6a
=== Set schema version ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0xad525909d49ba62453e8571c2610ac7fa5fd9d52f3bbeffbbb3c944bad215a1c"}
Transaction included at blockHash 0xad525909d49ba62453e8571c2610ac7fa5fd9d52f3bbeffbbb3c944bad215a1c
Current tx status is {"finalized":"0xad525909d49ba62453e8571c2610ac7fa5fd9d52f3bbeffbbb3c944bad215a1c"}
Transaction finalized at blockHash 0xad525909d49ba62453e8571c2610ac7fa5fd9d52f3bbeffbbb3c944bad215a1c
=== Set offchain schema ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0x404a7195c7899d870f215e853a39bba097f5880728a4111bde866ca7f877c9e3"}
Transaction included at blockHash 0x404a7195c7899d870f215e853a39bba097f5880728a4111bde866ca7f877c9e3
Current tx status is {"finalized":"0x404a7195c7899d870f215e853a39bba097f5880728a4111bde866ca7f877c9e3"}
Transaction finalized at blockHash 0x404a7195c7899d870f215e853a39bba097f5880728a4111bde866ca7f877c9e3
```  

</details>

Note the output of the collection ID: 
```
Collection created: 209
```

## Step 9: Mint NFTs

1. Configure collection ID in `config.js` file in field `collectionId`:

```
...
    collectionId: 209
...
```

2. Now it's time to mint NFTs. Execute this script and wait for it to complete:
```
node create_items.js
```

A typical terminal output for this script should look like follows:

<details>
  <summary>Click to expand</summary>

```
Collection owner address:  5EKt48hu4vPTUGy2Fgmb8M5YCP8WnX6SNg4Pb2ZnCUXhqVFU
=================================================
Creating item 1 from attributes [2,1,0]
Traits: [ 1, 4 ]
Serialized NFT properties: [ 10, 2, 1, 4 ]
message: NFTMeta { traits: [ 1, 4 ] }
Deserialized NFT properties: { traits: [ 'Green ball', 'Blue car' ] }
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0x576883a8b04e4e530538abdd9492843fa087efdee46868d570ee369ab21fd4db"}
Transaction included at blockHash 0x576883a8b04e4e530538abdd9492843fa087efdee46868d570ee369ab21fd4db
Current tx status is {"finalized":"0x576883a8b04e4e530538abdd9492843fa087efdee46868d570ee369ab21fd4db"}
Transaction finalized at blockHash 0x576883a8b04e4e530538abdd9492843fa087efdee46868d570ee369ab21fd4db
Item created
...
```

</details>

## Step 10: See your NFTs in the wallet

Open [https://wallet.unique.network](https://wallet.unique.network) and enjoy your new collection!

## Step 11 (Optional): Start your own marketplace to trade your collection

Follow this guide to start the marketplace (and remember to configure the collection ID in fronend .env file):

[https://github.com/UniqueNetwork/marketplace-docker](https://github.com/UniqueNetwork/marketplace-docker)

After your marketplace is up, you will see your collection in your wallet:

![Marketplace](doc/marketplace.png)