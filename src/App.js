import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Album from './pages/Album';
import './App.css';
import { Layout } from 'antd';
import Spotify from "./images/Spotify.png";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import AudioPlayer from './components/AudioPlayer';

const { Footer, Sider, Content } = Layout;

const App = () => {
  const [nftAlbum, setNftAlbum] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    async function getWallet() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setCurrentAccount(accounts[0]);

          // Tự động update khi user chuyển ví
          window.ethereum.on("accountsChanged", (accounts) => {
            setCurrentAccount(accounts[0]);
          });
        } catch (error) {
          console.error("Lỗi kết nối ví:", error);
        }
      } else {
        alert("Bạn cần cài MetaMask!");
      }
    }

    getWallet();
  }, []);

  return (
    <Layout>
      <Layout>
        <Sider width="25%" className="sideBar">
          <img src={Spotify} alt="Logo" className="logo" />
          <div className="searchBar">
            <span>Search</span>
            <SearchOutlined style={{ fontSize: "30px" }} />
          </div>
          <Link to="/">
            <p style={{ color: "#1DB954" }}> Home </p>
          </Link>
          <p>Your Music</p>
          <div className="recentPlayed">
            <p className="recentTitle">RECENTLY PLAYED</p>
            <div className="install">
              <span>Install App</span>
              <DownloadOutlined style={{ fontSize: "30px" }} />
            </div>
          </div>
        </Sider>

        <Content className="contentWindow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album" element={<Album setNftAlbum={setNftAlbum} />} />
          </Routes>
        </Content>
      </Layout>

      <Footer className="footer">
        {nftAlbum && (
          <>
            <AudioPlayer nftAlbum={nftAlbum} currentAccount={currentAccount} />
          </>
        )}
      </Footer>
    </Layout>
  );
};

export default App;
