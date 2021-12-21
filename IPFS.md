# Unique Ambassador Images in IPFS

## IPNS Key

```
QmTerFhVZ45pa8FLxkyStiqJrok7uQKCXWb91Bm7tY6SGE
```

## Current IPFS Hash

```
QmcaQqzLGTXpK85xvZKcnfE7yLQSo3DoDWB3FKquTLPqQf
```

## Updating IPFS Hash

**Note: Update Current IPFS Hash**

```
ipfs pin rm <insert old IPFS hash here>
ipfs repo gc
ipfs add -r images
ipfs name publish <insert new IPFS hash> --key QmTerFhVZ45pa8FLxkyStiqJrok7uQKCXWb91Bm7tY6SGE
```
