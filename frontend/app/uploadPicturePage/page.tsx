"use client";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";

export default function UploadPicturePage() {
  const [file, setFile] = useState(null);
  const [musicKeywords, setMusicKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // @ts-ignore
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setLoading(true);
    setError('');
    setMusicKeywords('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(response)

      if (!response.data.music_keywords) {
        setError('No music keywords found in the image.');
        return;
      }

      setMusicKeywords(response.data.music_keywords);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
        <div className="z-10">
        <Navbar />
        <h1 className="text-4xl font-bold mb-4">Upload a Picture</h1>      
        <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
        </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {musicKeywords && (
        <div style={{ marginTop: '20px' }}>
          <h2>Music Keywords:</h2>
          <p>{musicKeywords}</p>
        </div>
      )}
      </div>
       <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
            <source src="/vinylDisk.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
  );
}