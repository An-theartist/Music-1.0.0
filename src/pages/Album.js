import React from 'react';
import { useEffect, useState } from "react";
import "./Album.css";
import { useLocation } from 'react-router-dom';
import Opensea from "../images/opensea.png";
import { ClockCircleOutlined } from "@ant-design/icons";

const Album = ({ setNftAlbum }) => {
  const { state: album } = useLocation();
  const [albumDetails, setAlbumDetails] = useState(null);
  useEffect(() => {
    const fetchAlbumMetadata = async () => {
      try {
        // Lấy metadata album từ IPFS gateway
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${album.metadataHash}`);
        const data = await res.json();

        // Tạo array các track dạng "NFT"
        const tracks = data.tracks.map((track, index) => ({
          metadata: JSON.stringify({
            name: track.name,
            artist: data.artist,
            year: data.year || "2025",
            audio: track.audio,
            duration: "3:45", // bạn có thể thay bằng thời lượng thật nếu có
          }),
        }));

        setAlbumDetails(tracks);
      } catch (err) {
        console.error("Lỗi tải metadata:", err);
      }
    };

    fetchAlbumMetadata();
  }, [album.metadataHash]);

  return (
    <>

      <div className="albumContent">
        <div className="topBan">
          <img
            src={album.image}
            alt="albumcover"
            className="albumCover"
          ></img>
          <div className="albumDeets">
            <div>ALBUM</div>
            <div className="title">{album.title}</div>
            <div className="artist">
              {albumDetails && JSON.parse(albumDetails[0].metadata).artist}
            </div>
            <div>
              {albumDetails && JSON.parse(albumDetails[0].metadata).year} {" "}
              {albumDetails && albumDetails.length} Songs
            </div>
          </div>
        </div>
        <div className="topBan">
          <div className="playButton" onClick={() => setNftAlbum(albumDetails)}>
            PLAY
          </div>
          <div
            className="openButton"
            onClick={() =>
              window.open(
                `https://sepolia.etherscan.io/address/${album.contract}`,
              )
            }
          >
            TESTNET
            <img src={Opensea} className="openLogo" />
          </div>
        </div>
        <div className="tableHeader">
          <div className="numberHeader">#</div>
          <div className="titleHeader">TITLE</div>
          <div className="numberHeader">
            <ClockCircleOutlined />
          </div>
        </div>
        {albumDetails &&
          albumDetails.map((nft, i) => {
            nft = JSON.parse(nft.metadata);
            return (
              <>
                <div className="tableContent">
                  <div className="numberHeader">{i + 1}</div>
                  <div
                    className="titleHeader"
                    style={{ color: "rgb(205, 203, 203)", cursor: "pointer" }}
                    

                    onClick={() => {
                            const reordered = [...albumDetails.slice(i), ...albumDetails.slice(0, i)];
                            setNftAlbum(reordered);          //chọn bài cần phát
                          }}
                  > {nft.name}  </div>
                  <div className="numberHeader">{nft.duration}</div>
                </div>
              </>
            );
          })}
      </div>
    </>

  )
}

export default Album;
