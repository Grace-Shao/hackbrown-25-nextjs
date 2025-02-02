"use client";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import { useState } from "react";

export default function UploadPicturePage() {
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
        <div className="min-h-screen flex flex-col items-center">
            <Navbar />
            <div className="w-full max-w-md mt-12 p-8 bg-[#a375ca] rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-4">Upload a Picture</h1>
                <p>Upload a picture to get started.</p>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <Link href="/musicOutputPage">
                        <button type="submit">Upload</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}