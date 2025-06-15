const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const PINATA_API_KEY = 'YOUT_PINATA_API_KEY';
const PINATA_SECRET_API_KEY = 'YOUR_PINATA_SECRET_API_KEY';

const uploadedFiles = [];
const uploadFolderPath = path.join(__dirname, "albumTest");

async function uploadFileToIPFS(filePath, fileName) {

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const metadata = JSON.stringify({ name: fileName });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({ cidVersion: 0 });
  formData.append("pinataOptions", options);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    console.log(` Uploaded: ${fileName}`);
    console.log(` IPFS URL: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    uploadedFiles.push({ filename: fileName, ipfsHash: res.data.IpfsHash });
  } catch (error) {
    console.error(` Failed to upload ${fileName}:`, error.response?.data || error.message);
  }

}
async function uploadAllFiles() {
  const files = fs.readdirSync(uploadFolderPath).filter(file => file.endsWith(".mp3"));

  for (const file of files) {
  const fullPath = path.join(uploadFolderPath, file);
  await uploadFileToIPFS(fullPath, file);
  }
  const ipfsMap = {};
  uploadedFiles.forEach(file => {
    ipfsMap[file.filename] = file.ipfsHash;
  });

  // Ghi vào file JSON
  fs.writeFileSync("ipfs_album.json", JSON.stringify(ipfsMap, null, 2));
  console.log(" Đã tạo file ipfs_album.json");

}


uploadAllFiles();
