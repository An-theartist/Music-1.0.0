import { useState, useEffect, useRef } from 'react';
import { useIPFS } from './useIPFS';
import axios from "axios";


const useAudio = (nftAlbum, currentAccount) => {
  const { resolveLink } = useIPFS();

  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [newSong, setNewSong] = useState(0);

  const audioRef = useRef(new Audio(resolveLink(JSON.parse(nftAlbum[trackIndex].metadata).audio)));
  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration } = audioRef.current;

  const toPrevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + nftAlbum.length) % nftAlbum.length);
  };

  const toNextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % nftAlbum.length);
  };

  const toggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const hasCountedRef = useRef(false);


  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        const currentTime = Math.round(audioRef.current.currentTime);
        setTrackProgress(Math.round(audioRef.current.currentTime));

      if (currentTime >= 2 && !hasCountedRef.current) {
        hasCountedRef.current = true;

        // ✅ Gửi lượt nghe hợp lệ (duy nhất 1 lần)
        console.log("✅ Đã nghe ít nhất 2s - tính là 1 lượt");

        axios.post("/api/listen", {
          tokenId: trackIndex,
          address: currentAccount, // truyền vào từ props nếu cần
        });
      }}

    }, 1000);
  };

  useEffect(() => {
    toggle();
    if (trackIndex === 0) {
      setNewSong((prev) => prev + 1);
    } else {
      setTrackIndex(0);
    }
  }, [nftAlbum]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Phát nhạc lỗi:", e));
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(resolveLink(JSON.parse(nftAlbum[trackIndex].metadata).audio));
    audioRef.current.volume = volume;
    setTrackProgress(0);

    if (isReady.current) {
      audioRef.current.play().catch(e => console.error("Phát nhạc lỗi:", e));
      setIsPlaying(true);
      startTimer();
    } else {
      isReady.current = true;
    }
  }, [trackIndex, newSong]);

  const onSearch = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(value);
  };

  const onSearchEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      startTimer();
    }
  };

  const onVolume = (vol) => {
    audioRef.current.volume = vol;
    setVolume(vol);
  };

  return [
    isPlaying,
    duration,
    toggle,
    toNextTrack,
    toPrevTrack,
    trackProgress,
    onSearch,
    onSearchEnd,
    onVolume,
    trackIndex,
    setTrackIndex
  ];
};

export default useAudio;
