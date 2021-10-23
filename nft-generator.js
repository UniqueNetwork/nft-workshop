const fs = require("fs");
var BigNumber = require('bignumber.js');
const config = require('./config');
const attributes = require('./attributes');

function generateNFTs() {
  // generate NFT codes
  // ACG doesn't use a random algorithm. Instead, 30 NFTs are generated with following properties:
  // Each have consecutive number in trait 1
  //  1-10 have color 1
  // 11-20 have color 2
  // 21-30 have color 3
  // All have the same author (1)
  let faces = [];
  for (let i=0; i<30; i++) {
    faces.push([i+1, parseInt(i/10)+1, 1]);
  }

  // Save faces
  if (!fs.existsSync(config.outputFolder)){
    fs.mkdirSync(config.outputFolder);
  }
  fs.writeFileSync(`${config.outputFolder}/${config.outputJSON}`, JSON.stringify(faces));
}

/**
 * Generate protobuf JSON schema
 */
function generateSchema() {
  // Empty schema
  let schema = {
    nested: {
      onChainMetaData: {
        nested: {
          NFTMeta: {
            fields: {
              traits: {
                id: 1,
                rule: 'repeated',
                type: 'FTMTrait'
              }
            }
          },
          FTMTrait: {
            options: {
            },
            values: {
            }
          }
        }
      }
    }
  };

  // Fill schema with attributes (traits)
  let value = 0;
  for (let i=0; i<attributes.length; i++) {
    for (let j=0; j<attributes[i].count; j++) {
      schema.nested.onChainMetaData.nested.FTMTrait.options[`PROP_${value}`] = `{"en": "${attributes[i].attrNames[j]}"}`;
      schema.nested.onChainMetaData.nested.FTMTrait.values[`PROP_${value}`] = value;
      value++;
    }
  }

  fs.writeFileSync(`${config.outputFolder}/${config.outputSchema}`, JSON.stringify(schema));
}

function main() {
  generateNFTs();
  generateSchema();
}

main();
