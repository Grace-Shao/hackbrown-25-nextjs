import Link from "next/link";
import Navbar from "../components/navbar/Navbar";

export default function UploadPicturePage() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Navbar />
            <h1>Upload a Picture</h1>
            <p>Upload a picture to get started.</p>
            <input type="file" />
            <Link href="/musicOutputPage">Click Me: Music Output Page</Link>
        </div>
    )
}