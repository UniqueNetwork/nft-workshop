const { KeyringProvider } = require("@unique-nft/accounts/keyring");
const { Client } = require('@unique-nft/client');
const config = require('./config');
const fs = require("fs");
const attributes = require("./attributes");
const AdmZip = require("adm-zip");
const path = require("path");
const faces = JSON.parse(fs.readFileSync(`${config.outputFolder}/${config.outputJSON}`));

function printAttributes(i) {
    let attrs = '[' + faces[i] + '] => ';
    for (let j=0; j<attributes.length; j++) {
        if (faces[i][j] > 0) {
            attrs += attributes[j].values[faces[i][j]-1] + ", ";
        }
    }

    console.log(`Attributes for NFT ${i+1}:`, attrs);
}

async function uploadZip(sdk) {

    const zip = new AdmZip();

    for (let i=1; i<=config.desiredCount; i++) {
        const face = faces[i-1];
        if (face) {
            zip.addLocalFile(path.resolve(
                config.outputFolder,
                config.imagePrefix + i + '.png',
            ));
        }
    }

    const zipPath = path.resolve(
        config.outputFolder,
        'images.zip',
    );

    zip.writeZip(zipPath);

    const { cid } = await sdk.ipfs.uploadZip({
        file: fs.readFileSync(zipPath),
    });

    fs.unlinkSync(zipPath);

    return cid;

}

(async () => {
    const provider = new KeyringProvider({ type: 'sr25519'});
    await provider.init();
    const account = provider.addSeed(config.ownerSeed);
    const signer = account?.getSigner();

    const sdk = new Client({
        signer,
        baseUrl: config.restEndpoint,
    });

    const ipfsCid = config.ipfsCid || await uploadZip(sdk);
    console.log('ipfsCid', ipfsCid);

    const collection = await sdk.collections.get({ collectionId: config.collectionId });

    const perBlock = 50;
    let block = []

    const commonArgs = {
        address: account.instance.address,
        collectionId: collection.id,
    };

    const { tokenId } = await sdk.collections.lastTokenId({
        collectionId: collection.id,
    });
    const from = tokenId + 1;
    const to = config.desiredCount;
    for (let i=from; i<=to; i++) {
        const face = faces[i-1];
        if (face) {
            console.log(`=================================================\nCreating item ${i} from attributes [${faces[i-1]}]`);
            printAttributes(i-1);

            const encodedAttributes = face.reduce((res, next, index) => {
                res[index] = next - 1;
                return res;
            }, {});

            const data = {
                encodedAttributes,
                // attributes
                // properties
                image: {
                    ipfsCid: `${ipfsCid}/${config.imagePrefix}${i}.png`,
                },
            };

            block.push(data);
        }
        if (block.length === perBlock || i === config.desiredCount) {
            await sdk.tokens.createMultiple.submitWaitResult({
                ... commonArgs,
                data: block,
            });
            block = [];
        }
    }

})();
