const config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    ownerSeed: '//Alice',

    imagePartsFolder: './images',
    imagePrefix: 'workoholic_',
    imageWidth: 1706,
    coverFileName: 'cover.png',
    collectionName: 'NFTWorkshop',
    collectionDescription: 'NFT Workshop collection',
    tokenPrefix: 'TMP',

    desiredCount: 120,
    numberOfTokensGeneratedAtOnce: 50,

    attributes: [
        { name: 'head', required: true, values: ['Regular Head'] },
        { name: 'eye', required: true, values: ['Normal Eyes', 'Tired Eyes', 'Brused Eyes'] },
        { name: 'brow', required: true, values: ['Thick Brows', 'Greyish Brows', 'Flat Brows'] },
        { name: 'nose', required: true, values: ['Snub Nose', 'Button Nose', 'Droopy Nose'] },
        { name: 'hair', required: false, values: ['Normal Hair', 'Hipster Style', 'Messy Hair', 'Overdue for Haircut', 'Bald Patches'] },
        { name: 'mouth', required: true, values: ['Smirk', 'Regular Smile', {value: 'Wide Smile', weight: 3}] }
    ],
    outputFolder: './generated-nfts',
    outputJSON: 'nfts.json',
    imagesInParallel: require('os').cpus().length,
}

module.exports = config;
