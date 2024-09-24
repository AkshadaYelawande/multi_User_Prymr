import React, { useState, useEffect } from "react";
import cross from "../assets/images/cross.png";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const GrainyFilmTool = ({ image, onClose, onApply }) => {
  const [strength, setStrength] = useState(50);
  const [grainSize, setGrainSize] = useState(50);
  const [contrast, setContrast] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const filmStyles = [
    { name: "Classic", r: 1, g: 1, b: 1 },
    { name: "Mono", r: 1, g: 1, b: 1 },
    { name: "Sepia", r: 1.2, g: 1.1, b: 0.9 },
    { name: "Fade", r: 1.1, g: 1.1, b: 1.1 },
    { name: "Punch", r: 1.2, g: 1, b: 1 },
  ];

  const applyGrainyFilm = () => {
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

      const style = filmStyles[styleIndex];

      for (let i = 0; i < data.length; i += 4) {
        // Apply contrast
        for (let j = 0; j < 3; j++) {
          data[i + j] = applyContrast(data[i + j], contrast);
        }

        // Apply brightness
        for (let j = 0; j < 3; j++) {
          data[i + j] = applyBrightness(data[i + j], brightness);
        }

        // Apply saturation
        const gray =
          0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        for (let j = 0; j < 3; j++) {
          data[i + j] = applySaturation(gray, data[i + j], saturation);
        }

        // Apply film style
        data[i] *= style.r;
        data[i + 1] *= style.g;
        data[i + 2] *= style.b;

        // Add grain
        const noise = Math.random() * 2 - 1;
        const grainFactor = (strength / 100) * (grainSize / 100);
        data[i] += noise * grainFactor * 255;
        data[i + 1] += noise * grainFactor * 255;
        data[i + 2] += noise * grainFactor * 255;

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

  const applyContrast = (value, contrast) => {
    return (value - 128) * (1 + contrast / 100) + 128;
  };

  const applyBrightness = (value, brightness) => {
    return value + (brightness / 100) * 255;
  };

  const applySaturation = (gray, value, saturation) => {
    return value + (saturation / 100) * (value - gray);
  };

  useEffect(() => {
    applyGrainyFilm();
  }, [strength, grainSize, contrast, brightness, saturation, styleIndex]);

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
    applyGrainyFilm();
    if (onApply) {
      onApply(previewImageUrl);
    }
  };

  const handleStyleChange = (index) => {
    setStyleIndex(index);
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

      <div className="bg-gray-800 bg-opacity-50 px-4 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-1">
          <SliderControl
            label="Strength"
            value={strength}
            onChange={setStrength}
          />
          <SliderControl
            label="Grain Size"
            value={grainSize}
            onChange={setGrainSize}
          />
          <SliderControl
            label="Contrast"
            value={contrast}
            onChange={setContrast}
            min="-100"
            max="100"
          />
          <SliderControl
            label="Brightness"
            value={brightness}
            onChange={setBrightness}
            min="-100"
            max="100"
          />
          <SliderControl
            label="Saturation"
            value={saturation}
            onChange={setSaturation}
            min="-100"
            max="100"
          />
          <div className="col-span-3 mb-1">
            <label className="text-white capitalize">Film Style</label>
            <div className="flex justify-between gap-2 mt-1">
              {filmStyles.map((style, index) => (
                <button
                  key={style.name}
                  className={`px-2 rounded ${
                    index === styleIndex ? "bg-blue-500" : "bg-gray-600"
                  } text-white text-xs`}
                  onClick={() => handleStyleChange(index)}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-3 gap-2 flex justify-between">
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

export default GrainyFilmTool;
