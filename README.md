# Tutorial: Create your own NFT Collection

## Who is this tutorial for

This tutorial is created for technologically skillful people (e.g. game developers) who desire to create NFT collections from auto-generated images such as Substrapunks, Crypto-kitties, etc.

## Prerequisites

  * OS: Ubuntu 18.04 or 20.04
  * NodeJS 16 or up
  * Image editor of your choice

## Step 1: Design image parts

The image parts should generally include some background and combinable parts with transparent background. Store them in `images` folder. In this example there is a single background image that is stored in `head1.png` file:

<img src="/images/head1.png" width="300">

If you had three background images, store them respectively in `images/head1.png`, `images/head2.png`, and `images/head3.png` files.

The combinable parts are stored as `eye*.png`, `brow*.png`, `nose*.png`, `hair*.png`, and `mouth*.png`, so when a particular combination of parts is composed, it results in a unqiue NFT image:

![doc/combine.png](doc/combine.png)

The combinable parts are also stored in numbered files like `images/eye1.png`, `images/eye2.png` ... and `images/nose1.png`, `images/nose2.png` ...


## Step 2: Describe NFT traits

Generally, combinable parts produce NFT traits. For example, if the `nose1.png` image is used to generate the NFT image, it will have `Snub Nose` trait. Here is how to code this:

The `attributes.js` file should describe traits of your NFT collection. Each trait should have 

  * A `name` field that is used as a file name prefix for accessing your NFT part images. For example, all "nose" images are kept in files like `images/nose1.png`, `images/nose2.png`, etc.
  * Number of possible trait values in `count` field. In case of the `nose' part it is equal to the total number of `nose*.png` images, i.e. 3 (three)
  * A `required` field basically tells the image generator that a certain trait should always be present or not
  * The `attrNames` field contains trait names. For example, the `images/nose1.png` adds a Snub Nose to the NFT.

```
const attributes = [
    { name: "head",   count: 1, required: true, attrNames: ["Regular Head"] },
    { name: "eye",    count: 3, required: true, attrNames: ["Normal Eyes", "Tired Eyes", "Brused Eyes"] },
    { name: "brow",   count: 3, required: true, attrNames: ["Thick Brows", "Greyish Brows", "Flat Brows"] },
    { name: "nose",   count: 3, required: true, attrNames: ["Snub Nose", "Button Nose", "Droopy Nose"] },
    { name: "hair",   count: 5, required: true, attrNames: ["Normal Hair", "Hipster Style", "Messy Hair", "Overdue for Haircut", "Bald Patches"] },
    { name: "mouth",  count: 3, required: true, attrNames: ["Smirk", "Regular Smile", "Wide Smile"] }
  ];
```

The order in which traits come is important: It is used as a z-order when images are merged. The traits (parts) that come lower in the list of traits will be added to the image later, so they will cover up parts that come earlier.

## Step 3: Prepare Substrate Address with Seed

If you have never worked with Substrate addresses and seeds before, use these steps from the Marketplace README guide:

  * [Install Polkadot{.js} Extension](https://github.com/UniqueNetwork/marketplace-docker#step-1---install-polkadotjs-extension)
  * [Create Admin Address](https://github.com/UniqueNetwork/marketplace-docker#step-2---create-admin-address)
  * [Get Unique Tokens](https://github.com/UniqueNetwork/marketplace-docker#step-3---get-unique)


## Step 4: Configure Collection Owner Seed

Once you have the Seed Phrase ready, create `config.js` from `config.example.js` file and add your Seed Phrase to the `config.js` in `ownerSeed` field (replace `//Alice`):

```
const config = {
    endpoint: 'https://rest.unique.network/opal',
    ownerSeed: '//Alice',

    imagePartsFolder: "./images",
    outputFolder: "./generated_nfts",
    outputJSON: "nfts.json",
    desiredCount: 20
}
```

#### Public endpoints

You can use public endpoints for access Rest:

#### Opal
```
https://rest.unique.network/opal
```

#### Quartz
```
https://rest.unique.network/quartz
```

#### Unique
```
https://rest.unique.network/unique
```

## Step 5: Generate NFT Properties

Execute following commands in the terminal. The `step1-nft-generator.js` script will generate a unique set of NFT properties for each NFT.

```
npm install
node step1-nft-generator.js
```

This script will create `generated_nfts` folder, and save two files: `nfts.json` - array of NFT properties for each NFT.

## Step 6: Generate NFT Images

First, set the correct image width in the `saveFaceByAttributes` method in `step2-image-generator.js` file as shown below so that the image merging library knows how to offset image parts:
```
async function saveFaceByAttributes(arr, outFile) {
  let images = [];

  for (let i=0; i < arr.length; i++) {
    if (arr[i] > 0) {
      const img = {
        src: `${config.imagePartsFolder}/${attributes[i].name}${arr[i]}.png`,
        offsetX: (i == 0) ? 0 : -1706, // <-------- Put your image width here
        offsetY: 0,
      }
      images.push(img);
    }
  }

  // Generate image
  await mergeImagesToPng(images, outFile);
}
```

This script will generate NFT images from image parts using the NFT properties generated in the previous step.

```
node step2-image-generator.js
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

First, configure the main collection properties such as name, description, and token prefix in `create-collection.js` file. Note that these properties cannot be changed after the collection is created:
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

Second, configure the image path here in `create-collection.js` file (replace `<your IPFS folder hash>` with your IPFS folder hash). This setting is not permanent, you may change the offchain schema later because offchain files may change their location:
```
  console.log("=== Set offchain schema ===");
  const tx3 = api.tx.nft.setOffchainSchema(collectionId, `http://localhost:8080/ipfs/<your IPFS folder hash>/nft_image_{id}.png`);
  await submitTransaction(owner, tx3);
```

Now you are ready to execute the blockchain transactions:
```
node create-collection.js
```

A typical terminal output for this script should look like follows:

<details>
  <summary>Click to expand</summary>

```
$ node create-collection.js 
Collection owner address:  5E1WRCxeRcAv5pxgTTHJTT8dWCBbL2DgPQxK2FESSC42tBiy
=== Create collection ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0xded1c781f928e38b6805139aba421f5def1737b007fcf1aebf3b90b3d7cf854d"}
Transaction included at blockHash 0xded1c781f928e38b6805139aba421f5def1737b007fcf1aebf3b90b3d7cf854d
Current tx status is {"finalized":"0xded1c781f928e38b6805139aba421f5def1737b007fcf1aebf3b90b3d7cf854d"}
Transaction finalized at blockHash 0xded1c781f928e38b6805139aba421f5def1737b007fcf1aebf3b90b3d7cf854d
Collection created: 224
=== Set const on-chain schema ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0xcf2ea835a7282de1e4713b8d0e030d5024fa872976b8d5ae3b97daedde5d9a6a"}
Transaction included at blockHash 0xcf2ea835a7282de1e4713b8d0e030d5024fa872976b8d5ae3b97daedde5d9a6a
Current tx status is {"finalized":"0xcf2ea835a7282de1e4713b8d0e030d5024fa872976b8d5ae3b97daedde5d9a6a"}
Transaction finalized at blockHash 0xcf2ea835a7282de1e4713b8d0e030d5024fa872976b8d5ae3b97daedde5d9a6a
=== Set schema version ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0x7d936ec59a6f8aca235fb9d6ef7646196e9fd146e5774e60d9b68f079e2df047"}
Transaction included at blockHash 0x7d936ec59a6f8aca235fb9d6ef7646196e9fd146e5774e60d9b68f079e2df047
Current tx status is {"finalized":"0x7d936ec59a6f8aca235fb9d6ef7646196e9fd146e5774e60d9b68f079e2df047"}
Transaction finalized at blockHash 0x7d936ec59a6f8aca235fb9d6ef7646196e9fd146e5774e60d9b68f079e2df047
=== Set offchain schema ===
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0x175c58d6ad8685547aea40e09c10a091b8436cdffb1ac60d2de051d72fa2cbf5"}
Transaction included at blockHash 0x175c58d6ad8685547aea40e09c10a091b8436cdffb1ac60d2de051d72fa2cbf5
Current tx status is {"finalized":"0x175c58d6ad8685547aea40e09c10a091b8436cdffb1ac60d2de051d72fa2cbf5"}
Transaction finalized at blockHash 0x175c58d6ad8685547aea40e09c10a091b8436cdffb1ac60d2de051d72fa2cbf5
```  

</details>

Note the output of the collection ID: 
```
Collection created: 224
```

## Step 9: Mint NFTs

1. Configure collection ID in `config.js` file in field `collectionId`:

```
...
    collectionId: 224
...
```

2. Now it's time to mint NFTs. Execute this script and wait for it to complete:
```
node create-items.js
```

A typical terminal output for this script should look like follows:

<details>
  <summary>Click to expand</summary>

```
$ node create-items.js 
Collection owner address:  5E1WRCxeRcAv5pxgTTHJTT8dWCBbL2DgPQxK2FESSC42tBiy
=================================================
Creating item 1 from attributes [1,1,2,3,3,3]
Traits: [ 0, 1, 5, 9, 12, 17 ]
Serialized NFT properties: [
  10, 6,  0,  1,
   5, 9, 12, 17
]
message: NFTMeta { traits: [ 0, 1, 5, 9, 12, 17 ] }
Deserialized NFT properties: {
  traits: [
    'Regular Head',
    'Normal Eyes',
    'Greyish Brows',
    'Droopy Nose',
    'Messy Hair',
    'Wide Smile'
  ]
}
Current tx status is Ready
Current tx status is {"broadcast":["12D3KooWNE7E1TumzsHWJepWxfXPGB1oomc5dyo9WZx3RgNaD8Lm","12D3KooWDbTrD4HXBwCmSqDMhMtwTaHFHToE1QDPLXL1DCqSjDaa","12D3KooWG61UGKRfLs2vTnoKtCZECDmBrABXRs8AqttGbuyAfmRY","12D3KooWGaW9j9SEAXSkawtcJBQVyrkF2SiapvxiJf7EwcyzqCKc"]}
Current tx status is {"inBlock":"0x069e2f39d4593e4cd46b0aa92c68abfd122f1b350a0d39a9b4ddc365814d1cb0"}
Transaction included at blockHash 0x069e2f39d4593e4cd46b0aa92c68abfd122f1b350a0d39a9b4ddc365814d1cb0
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
