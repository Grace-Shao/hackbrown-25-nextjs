"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      <video
        autoPlay
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/arcadeVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-10 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col items-center gap-8">
        <header className="absolute top-4 mt-4">
          <Image
            src="/logoCrop.png" // Replace with your logo path
            alt="Your Logo"
            width={360} // Increased width
            height={120} // Increased height
            priority
          />
        </header>
            <Link href="/userTypePage">
              <button className="absolute inset-0 w-full h-full bg-transparent text-white text-4xl font-bold flex items-center justify-center"
              ></button>
            </Link>
        </main>
      </div>
    </div>
  );
}
