"use client"
import Form from "next/form"
import { useState } from "react"
import axios from "axios"
import Navbar from "../components/navbar/Navbar"
import Popup from "../components/Popup"
import GenreTracksDisplay from "../components/GenreTracksDisplay"

export default function UploadPicturePage() {
  const [musicKeywords, setMusicKeywords] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")
    setMusicKeywords("")

    try {
      // const response = await axios.post("http://127.0.0.1:5000/analyze-image", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // })

      // if (!response.data.music_keywords) {
      //   setError("No music keywords found in the image.")
      //   return
      // }

      setMusicKeywords("pop")
      setShowPopup(true)
    } catch (err) {
      setError("Failed to analyze the image. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="z-10 w-full max-w-4xl px-4">
        <Navbar />
        <h1 className="text-4xl font-bold mb-4 text-center">Analyze Top Trending Songs</h1>
        <Form action={handleSubmit} className="mb-8 flex justify-center">
          <div className="w-full max-w-lg bg-white/80 rounded-lg p-6 shadow-lg">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              {loading ? "Analyzing..." : "Analyze Trends"}
            </button>
          </div>
        </Form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {musicKeywords && <GenreTracksDisplay keywords={musicKeywords} />}
      </div>

      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/vinylDisk.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showPopup && <Popup text={musicKeywords} onClose={handleClosePopup} />}
    </div>
  )
}
