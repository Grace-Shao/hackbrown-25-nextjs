import React from 'react';

interface PopupProps {
  text: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ text, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg shadow-lg text-center text-white arcade-font">
        <h2 className="text-4xl mb-4">Best Song Based on Trends</h2>
        <p className="text-2xl mb-6">{text}</p>
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

export default Popup;