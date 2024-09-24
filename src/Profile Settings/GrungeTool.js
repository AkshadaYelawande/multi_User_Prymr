import React, { useState, useEffect } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const GrungeTool = ({ image, onClose, onApply }) => {
  const [style, setStyle] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [texture, setTexture] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const grungeTones = [
    { name: "Default", color: "#8B4513" },
    { name: "Rust", color: "#B7410E" },
    { name: "Urban", color: "#36454F" },
    { name: "Retro", color: "#704214" },
    { name: "Vintage", color: "#8E4B10" },
  ];

  const applyGrungeEffect = () => {
    const canvas = document.createElement("canvas");
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
        // Apply brightness
        data[i] += brightness;
        data[i + 1] += brightness;
        data[i + 2] += brightness;

        // Apply contrast
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;

        // Apply grunge tone
        const grungeTone = hexToRgb(grungeTones[style].color);
        data[i] = (data[i] + (grungeTone.r * texture) / 100) / 2;
        data[i + 1] = (data[i + 1] + (grungeTone.g * texture) / 100) / 2;
        data[i + 2] = (data[i + 2] + (grungeTone.b * texture) / 100) / 2;

        // Ensure values are within 0-255 range
        for (let j = 0; j < 3; j++) {
          data[i + j] = Math.max(0, Math.min(255, data[i + j]));
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
    applyGrungeEffect();
  }, [style, brightness, contrast, texture]);

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
    min = "-100",
    max = "100",
  }) => (
    <div className="mb-2">
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
    applyGrungeEffect();
    if (onApply) {
      onApply(previewImageUrl);
    }
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
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

      <div className="bg-gray-800 bg-opacity-30 px-4 max-w-md mx-auto">
        <div className="flex justify-between mb-4">
          {grungeTones.map((tone, index) => (
            <button
              key={tone.name}
              className={`w-12 h-12 rounded-full ${
                style === index ? "border-2 border-white" : ""
              }`}
              style={{ backgroundColor: tone.color }}
              onClick={() => setStyle(index)}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <SliderControl
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
          />
          <SliderControl
            label="Contrast"
            value={contrast}
            onChange={setContrast}
          />
          <SliderControl
            label="Texture"
            value={texture}
            onChange={setTexture}
            min="0"
            max="100"
          />
          <div className="flex gap-2 justify-between mt-4 col-span-3">
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
    </div>
  );
};

export default GrungeTool;
