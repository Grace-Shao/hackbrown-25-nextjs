"use client";

import Image from "next/image";
import Navbar from "./components/navbar/Navbar";
import Link from "next/link";
import background from "../public/arcadebg2.png";
// import arcadeVideo from "../public/arcadeVideo.mp4";
import { useState } from "react";


export default function Home() {
  return (
    <div >
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/arcadeVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-10 font-[family-name:var(--font-geist-sans)]">
        {/* <header className="mb-8">
          <Image
            src="/your-logo.svg" // Replace with your logo path
            alt="Your Logo"
            width={180}
            height={60}
            priority
          />
        </header> */}
        <main className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold italic absolute top-20 mt-4">In 2une!</h1>
            {/* <p className="text-lg text-center absolute top-40 mt-4">
            Find the perfect song for your pictures
            </p> */}
            <Link href="/uploadPicturePage">
            <button className="text-white text-5xl py-6 px-12 rounded 
              mr-2 bg-transparent border-2 border-black hover:bg-pink-500 hover:scale-105 transition-all duration-300
              absolute bottom-40 left-1/2 transform -translate-x-1/2"
              >Start!</button>
            </Link>
        </main>
      </div>
    </div>
  );
}
