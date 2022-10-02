const attributes = [
    { name: "head",   count: 1, required: true, values: ["Regular Head"] },
    { name: "eye",    count: 3, required: true, values: ["Normal Eyes", "Tired Eyes", "Brused Eyes"] },
    { name: "brow",   count: 3, required: true, values: ["Thick Brows", "Greyish Brows", "Flat Brows"] },
    { name: "nose",   count: 3, required: true, values: ["Snub Nose", "Button Nose", "Droopy Nose"] },
    { name: "hair",   count: 5, required: true, values: ["Normal Hair", "Hipster Style", "Messy Hair", "Overdue for Haircut", "Bald Patches"] },
    { name: "mouth",  count: 3, required: true, values: ["Smirk", "Regular Smile", {value: "Wide Smile", weight: 3}] }
  ];

module.exports = attributes;
