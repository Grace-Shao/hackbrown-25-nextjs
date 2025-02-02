"use client";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import { useState } from "react";

export default function UploadToInstaPage() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handle submit");
        // call the api to upload the file and call the spotify api
    };
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Navbar />
            <h1>Upload a Picture</h1>
            <p>Upload a picture to get started.</p>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            <Link href="/musicOutputPage">Click Me: Music Output Page</Link>
        </div>
    )
}