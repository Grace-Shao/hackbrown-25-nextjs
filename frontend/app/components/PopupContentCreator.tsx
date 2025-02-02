import React, { useEffect, useState } from 'react';

interface PopupProps {
  text: string;
  onClose: () => void;
}
const songPairs: [string, string[]][] = [
  ["APT. by Rose and Bruno Mars", ["Penthouse Dreams by Emily Harper", "Rooftop Rendezvous by James Carter", "City Lights by Lana Sky"]],
  ["The Idea of You by Robinne Lee", ["Melody of the Night by Oliver Hayes", "Echoes of Love by Sophia Rivers", "Dancing Shadows by Liam West"]],
  ["Ocean Eyes by Billie Elish", ["Lost in the Rhythm by Ella Knight", "Ocean Waves by Mason Reed", "Falling Stars by Chloe Hart"]],
];

const PopupContentCreator: React.FC<PopupProps> = ({ text, onClose }) => {
  const [selectedSong, setSelectedSong] = useState<[string, string[]] | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * songPairs.length);
    setSelectedSong(songPairs[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg shadow-lg text-center text-white arcade-font">
      <h2 className="text-4xl mb-4">Best Song Based on Trends</h2>
        {selectedSong && (
          <>
            <p className="text-2xl mb-6">{selectedSong[0]}</p>
            <ul className="text-xl mb-6">
              {selectedSong[1].map((relatedSong, index) => (
                <li key={index}>{relatedSong}</li>
              ))}
            </ul>
          </>
        )}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupContentCreator;