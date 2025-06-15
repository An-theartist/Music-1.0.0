const fs = require("fs");
const path = require("path");

const albumFolder = path.join(__dirname, "albumTest");
const metadataFolder = path.join(__dirname, "metadata");
if (!fs.existsSync(metadataFolder)) fs.mkdirSync(metadataFolder);

// Load IPFS hashes
const ipfsTracks = JSON.parse(fs.readFileSync("ipfs_album.json", "utf8"));
const ipfsCoverMap = JSON.parse(fs.readFileSync("album_cover.json", "utf8"));
const coverHash = Object.values(ipfsCoverMap)[0]; // dùng ảnh bìa đầu tiên

const coverUrl = `https://gateway.pinata.cloud/ipfs/${coverHash}`;

for (const [filename, trackHash] of Object.entries(ipfsTracks)) {
  const name = path.basename(filename, ".mp3");

  const metadata = {
    name: name,
    description: `NFT âm nhạc cho bài hát "${name}"`,
    image: coverUrl,
    animation_url: `https://gateway.pinata.cloud/ipfs/${trackHash}`,
    attributes: []
  };


  const outPath = path.join(metadataFolder, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(metadata, null, 2));
  console.log(` Metadata đã tạo: ${name}.json`);
}


const ipfsMap = JSON.parse(fs.readFileSync("ipfs_album.json", "utf-8"));

const tracks = Object.entries(ipfsMap).map(([name, hash]) => ({
  name: name.replace(".mp3", ""),
  audio: `https://gateway.pinata.cloud/ipfs/${hash}`
}));

const metadata = {
  artist: "Hẹ hẹ hẹ",
  year: "2025",
  image: coverUrl,
  tracks
};

fs.writeFileSync("album_metadata.json", JSON.stringify(metadata, null, 2));
console.log(" album_metadata.json đã được tạo!");
