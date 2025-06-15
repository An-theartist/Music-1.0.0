const fs = require("fs");
const path = require("path");
const axios = require("axios");

const PINATA_API_KEY = 'YOUT_PINATA_API_KEY';
const PINATA_SECRET_API_KEY = 'YOUR_PINATA_SECRET_API_KEY';

const metadataFolder = path.join(__dirname, "metadata");
const metadataMap = {};

async function uploadMetadataFile(filePath, fileName) {
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json"
      }
    });

    const ipfsHash = res.data.IpfsHash;
    console.log(` Uploaded: ${fileName} => ${ipfsHash}`);
    metadataMap[fileName] = ipfsHash;

  } catch (error) {
    console.error(` Failed to upload ${fileName}:`, error.response?.data || error.message);
  }
}

async function uploadAllMetadata() {
  const files = fs.readdirSync(metadataFolder).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const fullPath = path.join(metadataFolder, file);
    await uploadMetadataFile(fullPath, file);
  }

  // Save the mapping to a file
  fs.writeFileSync("metadata_ipfs_map.json", JSON.stringify(metadataMap, null, 2));
  console.log(" Đã tạo metadata_ipfs_map.json");
}

uploadAllMetadata();
