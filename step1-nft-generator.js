const fs = require('fs');
var BigNumber = require('bignumber.js');
const config = require('./config.js');

const attributes = config.attributes;

function getRandomInt(max) {
  return BigNumber.random(20)
      .multipliedBy(max - 1)
      .plus(1)
      .integerValue();
}

function attributeName(i) {
  return attributes[i].name;
}

function propertyName(i, j) {
  const property = attributes[i].values[j - 1];
  return property?.value ? property?.value : property;
}

function logAttributes(prefix, face) {
  console.log(prefix, face.map((value, index) => {
    return [attributeName(index), propertyName(index, value)];
  }));
}

function getLenByWeights(values, required = false) {
  const weight = values.reduce((acc, v) => {
    return acc + (typeof v === "object" && v.weight ? v.weight : 1);
  }, 0);
  return weight + !+required;
}

function mapValueByWeight(values, property) {
  const map = {};
  values.forEach((value, index) => {
    const weight = typeof value === "object" && value.weight ? value.weight : 1;
    const lastIndex = Object.keys(map).length;
    for (let i=0; i<weight; i++) {
      map[lastIndex + i + 1] = index + 1;
    }
  });
  return property ? map[property] : property;
}

function codeToArray(code) {
  let arr = [];

  for (let i=attributes.length-1; i>=0; i--) {

    const len = getLenByWeights(
        attributes[i].values,
        attributes[i].required,
    );

    let property = parseInt(code.mod(len).toFixed()) + +attributes[i].required;

    arr[i] = mapValueByWeight(attributes[i].values, property);

    code = code.minus(arr[i]).dividedBy(len).integerValue();
  }

  return arr;
}

function bnIncludes(arr, bn) {
  for (let i=0; i<arr.length; i++) {
    if (arr[i].eq(bn)) return true;
  }
  return false;
}

function generateNFTs() {
  // Get a bigint of possible combinations
  let combinations = new BigNumber(1);
  for (let i=0; i<attributes.length; i++) {
    combinations = combinations.multipliedBy(
        getLenByWeights(attributes[i].values, attributes[i].required)
    );
  }
  console.log(`Possible combinations: ${combinations.toString()}`);

  // generate desired count of different random numbers in the range
  let faceCodes = [];
  let faces = [];
  while (
      faces.length < config.desiredCount &&
      combinations.isGreaterThan(faceCodes.length)
  ) {
    let code = getRandomInt(combinations);
    if (!bnIncludes(faceCodes, code)) {
      faceCodes.push(code);

      const face = codeToArray(code);

      logAttributes('Randomized NFT:', face);

      faces.push(face);
    }
  }

  console.log('faces', faces.length);

  // Save faces
  if (!fs.existsSync(config.outputFolder)){
    fs.mkdirSync(config.outputFolder);
  }
  fs.writeFileSync(`${config.outputFolder}/${config.outputJSON}`, JSON.stringify(faces));
}

function main() {
  generateNFTs();
}

main();
