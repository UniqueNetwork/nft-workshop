const attributes = [
    { name: "Name",   count: 30, required: true, attrNames: ["Hypercube Space 3 #1/10", "Hypercube Space 3 #2/10", "Hypercube Space 3 #3/10", "Hypercube Space 3 #4/10", "Hypercube Space 3 #5/10", "Hypercube Space 3 #6/10", "Hypercube Space 3 #7/10", "Hypercube Space 3 #8/10", "Hypercube Space 3 #9/10", "Hypercube Space 3 #10/10", "Hypercube Space 3 Kusama #1/10", "Hypercube Space 3 Kusama #2/10", "Hypercube Space 3 Kusama #3/10", "Hypercube Space 3 Kusama #4/10", "Hypercube Space 3 Kusama #5/10", "Hypercube Space 3 Kusama #6/10", "Hypercube Space 3 Kusama #7/10", "Hypercube Space 3 Kusama #8/10", "Hypercube Space 3 Kusama #9/10", "Hypercube Space 3 Kusama #10/10", "Hypercube Space 3 Substrate #1/10", "Hypercube Space 3 Substrate #2/10", "Hypercube Space 3 Substrate #3/10", "Hypercube Space 3 Substrate #4/10", "Hypercube Space 3 Substrate #5/10", "Hypercube Space 3 Substrate #6/10", "Hypercube Space 3 Substrate #7/10", "Hypercube Space 3 Substrate #8/10", "Hypercube Space 3 Substrate #9/10", "Hypercube Space 3 Substrate #10/10"] },
    { name: "Iteration",  count: 3,  required: true, attrNames: ["Original", "Kusama", "Substrate"] },
    { name: "Author", count: 1,  required: true, attrNames: ["Özge Topçu"] },
    { name: "Format", count: 1,  required: true, attrNames: ["Video"] },
    { name: "Video Link", count: 30,  required: true, attrNames: [
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video1.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video2.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video3.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video4.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video5.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video6.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video7.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video8.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video9.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video10.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video11.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video12.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video13.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video14.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video15.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video16.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video17.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video18.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video19.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video20.mp4", 
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video21.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video22.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video23.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video24.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video25.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video26.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video27.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video28.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video29.mp4",
      "https://ipfs.artpool.xyz/ipfs/QmTGY1Xx5nWBpD35JSQWdweATU96QfSy21FztVEdTjrGih/hypercubespace_video30.mp4"
      ]
    }
  ];

module.exports = attributes;