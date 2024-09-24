import React, { useState, useEffect, useRef } from "react";
import cross from "../assets/images/cross.png";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const GlamourTool = ({ image, onClose, onApply }) => {
  const [glamourLevel, setGlamourLevel] = useState(50);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);

  const applyGlamourEffect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (isSkinTone(data[i], data[i + 1], data[i + 2])) {
          data[i] = smoothColor(data[i], glamourLevel);
          data[i + 1] = smoothColor(data[i + 1], glamourLevel);
          data[i + 2] = smoothColor(data[i + 2], glamourLevel);
        }

        if (isEyeOrLip(data[i], data[i + 1], data[i + 2])) {
          data[i] = enhanceColor(data[i], glamourLevel);
          data[i + 1] = enhanceColor(data[i + 1], glamourLevel);
          data[i + 2] = enhanceColor(data[i + 2], glamourLevel);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const newImageDataUrl = canvas.toDataURL("image/png");

      const newHistory = [
        ...history.slice(0, historyIndex + 1),
        newImageDataUrl,
      ];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setPreviewImageUrl(newImageDataUrl);
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  };

  useEffect(() => {
    applyGlamourEffect();
  }, [glamourLevel]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPreviewImageUrl(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPreviewImageUrl(history[newIndex]);
    }
  };

  const handleApply = () => {
    applyGlamourEffect();
    if (onApply) {
      onApply(previewImageUrl);
    }
  };

  const isSkinTone = (r, g, b) => {
    return r > 60 && g > 40 && b > 20 && r > g && g > b;
  };

  const isEyeOrLip = (r, g, b) => {
    return (r > g + 10 && r > b + 10) || (b > r + 10 && b > g + 10);
  };

  const smoothColor = (color, level) => {
    return color + (255 - color) * (level / 200);
  };

  const enhanceColor = (color, level) => {
    return Math.min(255, color * (1 + level / 100));
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
      <div className="flex-grow relative">
        <img
          src={previewImageUrl || image}
          alt="Preview"
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>

      <div className="bg-gray-800 bg-opacity-50 px-4 py-2 max-w-md mx-auto">
        <div className="mb-4">
          <label className="text-white capitalize">Glamour Level</label>
          <input
            type="range"
            min="0"
            max="100"
            value={glamourLevel}
            onChange={(e) => setGlamourLevel(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <div className="text-white text-opacity-80 text-xs font-bold font-['Nunito']">
            {glamourLevel}
          </div>
        </div>
        <div className="flex gap-2 justify-between">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>

      <div className="w-full h-[40px] bg-black flex justify-center items-center">
        <div
          className="px-2 flex flex-col items-center cursor-pointer"
          onClick={handleUndo}
        >
          <img src={undo} alt="undo" className="w-5 h-5" />
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Undo
          </div>
        </div>
        <div
          className="px-2 flex flex-col items-center cursor-pointer"
          onClick={handleRedo}
        >
          <img src={redo} alt="redo" className="w-5 h-5" />
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Redo
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default GlamourTool;
