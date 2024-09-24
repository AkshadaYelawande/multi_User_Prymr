import React, { useEffect, useState } from "react";
import cross from "../assets/images/cross.png";

const FullScreenTool = ({ image, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black flex justify-center items-center z-30">
      <div className="relative">
        <img src={image} alt="Full Screen" className="max-w-full max-h-full" />
        <div
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
          onClick={onClose}
        >
          <img src={cross} alt="Close" />
        </div>
        <div className="absolute bottom-4 right-4 flex">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded mr-2"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenTool;
