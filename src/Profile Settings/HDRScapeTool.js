import React, { useState, useEffect, useRef } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const HDRScapeTool = ({ image, onClose, onApply }) => {
  const [intensity, setIntensity] = useState(50);
  const [previewImageUrl, setPreviewImageUrl] = useState(image);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);

  const applyHDREffect = () => {
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
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Apply HDR-like effect
        const factor = 1 + intensity / 100;
        data[i] = Math.min(255, r * factor);
        data[i + 1] = Math.min(255, g * factor);
        data[i + 2] = Math.min(255, b * factor);
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
    applyHDREffect();
  }, [intensity]);

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

  const SliderControl = ({
    label,
    value,
    onChange,
    min = "0",
    max = "100",
  }) => (
    <div className="mb-0">
      <label className="text-white capitalize">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
      <div className="text-white text-opacity-80 text-xs font-bold font-['Nunito']">
        {value}
      </div>
    </div>
  );

  const handleApply = () => {
    applyHDREffect();
    if (onApply) {
      onApply(previewImageUrl);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
      <div className="flex-grow relative">
        <img
          src={previewImageUrl}
          alt="Preview"
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>

      <div className="bg-gray-800 bg-opacity-50 px-4 max-w-md mx-auto">
        <div className="grid grid-cols-1 gap-1">
          <SliderControl
            label="HDR Intensity"
            value={intensity}
            onChange={setIntensity}
          />
          <div className="flex gap-2 justify-between mt-4">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 rounded"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
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

export default HDRScapeTool;
