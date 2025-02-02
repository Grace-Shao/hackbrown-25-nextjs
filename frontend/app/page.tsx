"use client";
import Link from "next/link";

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
              <button className="absolute inset-0 w-full h-full bg-transparent text-white text-4xl font-bold flex items-center justify-center"
              ></button>
            </Link>
        </main>
      </div>
    </div>
  );
}
