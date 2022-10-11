const config = {
    endpoint: 'https://rest.unique.network/opal',
    ownerSeed: '//Alice',

    imagePartsFolder: "./images",
    outputFolder: "./generated-nfts",
    outputJSON: "nfts.json",
    desiredCount: 15,
    imagePrefix: 'workoholic_',
    numberElementsInChunk: 10,

    collectionId: 415,

    attributes: [
        { name: "head", required: true, values: ["Regular Head"] },
        { name: "eye", required: true, values: ["Normal Eyes", "Tired Eyes", "Brused Eyes"] },
        { name: "brow", required: true, values: ["Thick Brows", "Greyish Brows", "Flat Brows"] },
        { name: "nose", required: true, values: ["Snub Nose", "Button Nose", "Droopy Nose"] },
        { name: "hair", required: false, values: ["Normal Hair", "Hipster Style", "Messy Hair", "Overdue for Haircut", "Bald Patches"] },
        { name: "mouth", required: true, values: ["Smirk", "Regular Smile", {value: "Wide Smile", weight: 3}] }
    ]
}

module.exports = config;
