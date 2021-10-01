const { Root } = require('protobufjs');

function defineMessage (schema) {
  return Root.fromJSON(JSON.parse(schema));
}

function serializeNft(schema, payload) {
  const root = defineMessage(schema);
  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');
  
  const errMsg = NFTMeta.verify(payload);
  if (errMsg) throw Error(errMsg);
  const message = NFTMeta.create(payload);
  return NFTMeta.encode(message).finish();
};

function convertEnumToString (value, key, NFTMeta, locale) {
  let result = value;

  try {
    const options = NFTMeta?.fields[key]?.resolvedType?.options;
    const valueJsonComment = options[value];
    const translationObject = JSON.parse(valueJsonComment);

    if (translationObject && (translationObject[locale])) {
      result = translationObject[locale];
    }
  } catch (e) {
    console.log('Error parsing schema when trying to convert enum to string: ', e);
  }

  return result;
}

function deserializeNft (schema, buffer, locale) {
  const root = defineMessage(schema);

  // Obtain the message type
  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');

  // Decode a Uint8Array (browser) or Buffer (node) to a message
  const message = NFTMeta.decode(buffer);
  console.log("message:", message);

  // Maybe convert the message back to a plain object
  const objectItem = NFTMeta.toObject(message, {
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true
  });

  for (const key in objectItem) {
    if (NFTMeta?.fields[key]?.resolvedType?.options && Object.keys(NFTMeta?.fields[key]?.resolvedType?.options).length > 0) {
      if (Array.isArray(objectItem[key])) {
        const item = objectItem[key];

        objectItem[key] = [];
        item.forEach((value) => {
          objectItem[key].push(convertEnumToString(value, key, NFTMeta, locale));
        });
      } else {
        objectItem[key] = convertEnumToString(objectItem[key], key, NFTMeta, locale);
      }
    }
  }

  return objectItem;
}


module.exports = {
    serializeNft,
    deserializeNft
}