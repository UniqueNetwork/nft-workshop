# Unique Ambassador Images in IPFS

## IPNS Key

```
QmTerFhVZ45pa8FLxkyStiqJrok7uQKCXWb91Bm7tY6SGE
```

## Updating IPFS Hash

**Note: Update Current IPFS Hash**

```
ipfs pin rm $(ipfs name resolve QmTerFhVZ45pa8FLxkyStiqJrok7uQKCXWb91Bm7tY6SGE)
ipfs add -r images
ipfs name publish <insert new IPFS hash> --key QmTerFhVZ45pa8FLxkyStiqJrok7uQKCXWb91Bm7tY6SGE
ipfs repo gc
```
