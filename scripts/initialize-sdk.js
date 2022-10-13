const config = require('../config');
const { KeyringProvider } = require("@unique-nft/accounts/keyring");
const { Sdk } = require("@unique-nft/sdk");

async function initializeSdk() {
    try {
        const provider = new KeyringProvider({ type: 'sr25519' });
        await provider.init();
        const signer = provider.addSeed(config.ownerSeed);

        const clientOptions = {
            baseUrl: config.endpoint,
            signer
        };
        return {
            sdk: new Sdk(clientOptions),
            signer
        };
    } catch (e) {
        throw new Error(`error initialize sdk: ${e}`);
    }
}

module.exports = initializeSdk;
