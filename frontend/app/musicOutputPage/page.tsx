import Navbar from "../components/navbar/Navbar";

export default function MusicOutputPage() {
    const song = "Song Title"; // Replace with actual song title
    const author = "Song Author"; // Replace with actual song author

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Navbar />
                <div className="w-full max-w-md mt-12 p-8 bg-[#a375ca] rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-4 text-center">Music Output</h1>
                <p>Song: {song}</p>
                <p>Author: {author}</p>
            </div>
        </div>
    );
}