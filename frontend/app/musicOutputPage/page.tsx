import Navbar from "../components/navbar/Navbar";

export default function MusicOutputPage() {
    const song = "Song Title"; // Replace with actual song title
    const author = "Song Author"; // Replace with actual song author

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Navbar />
            <h1>Music Output</h1>
            <p>Song: {song}</p>
            <p>Author: {author}</p>
        </div>
    );
}