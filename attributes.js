const attributes = [
    { name: "head",   count: 1, required: true, attrNames: ["Regular Head"] },
    { name: "eye",    count: 3, required: true, attrNames: ["Normal Eyes", "Tired Eyes", "Brused Eyes"] },
    { name: "brow",   count: 3, required: true, attrNames: ["Thick Brows", "Greyish Brows", "Flat Brows"] },
    { name: "nose",   count: 3, required: true, attrNames: ["Snub Nose", "Button Nose", "Droopy Nose"] },
    { name: "hair",   count: 5, required: true, attrNames: ["Normal Hair", "Hipster Style", "Messy Hair", "Overdue for Haircut", "Bald Patches"] },
    { name: "mouth",  count: 3, required: true, attrNames: ["Smirk", "Regular Smile", "Wide Smile"] }
  ];

module.exports = attributes;