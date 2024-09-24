import React, { useState, useEffect } from "react";
import cross from "../assets/images/cross.png";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const RetroluxTool = ({ image, onClose, onApply }) => {
  const [intensity, setIntensity] = useState(50);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [previewImage, setPreviewImage] = useState(image);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const filters = [
    { name: "Classic", colors: ["#ff9966", "#ff5e62"] },
    { name: "Faded", colors: ["#4CA1AF", "#C4E0E5"] },
    { name: "Analog", colors: ["#603813", "#b29f94"] },
    { name: "Nostalgic", colors: ["#DAD299", "#B0DAB9"] },
    { name: "Cinematic", colors: ["#000046", "#1CB5E0"] },
  ];

  useEffect(() => {
    applyRetroluxEffect();
  }, [intensity, selectedFilter]);

  const applyRetroluxEffect = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Apply color overlay
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, filters[selectedFilter].colors[0]);
      gradient.addColorStop(1, filters[selectedFilter].colors[1]);
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = intensity / 100;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply grain effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grainAmount = Math.random() * 0.1 * intensity;
        data[i] += grainAmount;
        data[i + 1] += grainAmount;
        data[i + 2] += grainAmount;
      }
      ctx.putImageData(imageData, 0, 0);

      // Apply light leak effect
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.3 * (intensity / 100);
      const leakGradient = ctx.createRadialGradient(
        canvas.width * Math.random(),
        canvas.height * Math.random(),
        0,
        canvas.width * Math.random(),
        canvas.height * Math.random(),
        canvas.width * 0.6
      );
      leakGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      leakGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = leakGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const newImageDataUrl = canvas.toDataURL();
      const newHistory = [
        ...history.slice(0, historyIndex + 1),
        newImageDataUrl,
      ];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setPreviewImage(newImageDataUrl);
    };
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPreviewImage(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPreviewImage(history[newIndex]);
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

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
      <div className="flex-grow relative">
        <img
          src={previewImage}
          alt="Preview"
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>

      <div className="bg-gray-800 bg-opacity-50 px-4 max-w-md mx-auto">
        <div className="grid grid-cols-1 gap-1">
          <SliderControl
            label="Intensity"
            value={intensity}
            onChange={setIntensity}
          />
          <div className="mb-1">
            <div className="flex justify-between gap-2 mt-1 overflow-x-auto">
              {filters.map((filter, index) => (
                <button
                  key={filter.name}
                  className={`px-2 rounded ${
                    index === selectedFilter ? "bg-blue-500" : "bg-gray-600"
                  } text-white text-xs`}
                  onClick={() => setSelectedFilter(index)}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2  justify-between">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 rounded"
              onClick={() => onApply(previewImage)}
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

export default RetroluxTool;
