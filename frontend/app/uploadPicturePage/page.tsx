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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Upload an Image to Get Music Keywords</h1>
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
  );
}