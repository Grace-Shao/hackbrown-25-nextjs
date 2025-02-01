import Image from "next/image";
import Navbar from "./components/navbar/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <header className="mb-8">
        <Image
          src="/your-logo.svg" // Replace with your logo path
          alt="Your Logo"
          width={180}
          height={60}
          priority
        />
      </header>
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">In 2une</h1>
        <p className="text-lg text-center">
          Make music out of memories.
        </p>
        <Link href="/uploadPicturePage">
        <button className="text-white py-2 px-4 rounded 
            mr-2 bg-grey-900 hover:bg-pink-500 hover:scale-105 transition-all duration-300"
            >Start!</button>
        </Link>
      </main>
    </div>
  );
}
