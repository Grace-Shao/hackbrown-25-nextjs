"use client";
import { useRouter } from 'next/router';
import Navbar from "../components/navbar/Navbar";
import Image from 'next/image';
import Link from 'next/link';
export default function UserTypePage() {

  const handleChoiceClick = (choice) => {
    // Navigate to different pages based on the choice
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      <Navbar />
    <div className="w-full max-w-md mt-12 p-8 bg-[#a375ca] rounded-lg shadow-md z-10 h-70">
        <h1 className="text-4xl font-bold mb-4 text-center">Choose Your User Type</h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Link href="/uploadPicturePage" className="flex-1">
              <button
              onClick={() => handleChoiceClick('personal')}
              className="w-full py-4 bg-[#d8b4fe] text-white text-xl rounded-lg hover:bg-[#c084fc] transition duration-300"
              >
              Personal Use
              </button>
            </Link>
            <Link href="/uploadPicturePageContentCreator" className="flex-1">
              <button
              onClick={() => handleChoiceClick('content')}
              className="w-full py-4 bg-[#7c3aed] text-white text-xl rounded-lg hover:bg-[#6d28d9] transition duration-300 flex flex-col items-center justify-center gap-2"
              >
              Content Creator
              <Image
                src="/instagram.png" // Replace with the actual path to your image in the public directory
                alt="Instagram Icon"
                width={50} // Set the desired width
                height={50} // Set the desired height
              />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}