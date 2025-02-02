"use client";

import Image from "next/image";
import Navbar from "./components/navbar/Navbar";
import Link from "next/link";
import background from "../public/arcadebg2.png";
import { useState } from "react";
import { useRouter } from 'next/router';


export default function Home() {
  const [fade, setFade] = useState(false);

  const handleStartClick = () => {
    setFade(true);
    setTimeout(() => {
      router.push('/uploadPicturePage');
    }, 1000); // Match the duration of the fade-out animation
  };
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url(${background.src})`, // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      <Navbar />
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
          <h1 className="text-4xl font-bold italic absolute top-20 mt-4">Music from Memories!</h1>
            <p className="text-lg text-center absolute top-40 mt-4">
            Find the perfect song for your pictures
            </p>
          <Link href="/uploadPicturePage">
          <button className="text-white py-2 px-4 rounded 
              mr-2 bg-white-900 hover:bg-pink-500 hover:scale-105 transition-all duration-300"
              >Start!</button>
          </Link>
        </main>
      </div>
    </div>
  );
}
