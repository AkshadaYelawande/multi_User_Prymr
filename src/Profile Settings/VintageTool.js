import React, { useState, useEffect } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const VintageTool = ({ image, onClose, onApply }) => {
  const [style, setStyle] = useState(1);
  const [strength, setStrength] = useState(50);
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const applyVintageEffect = () => {
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
        // Apply vintage style
        let r = data[i],
          g = data[i + 1],
          b = data[i + 2];

        // Vintage color adjustments based on style
        switch (style) {
          case 1: // Sepia-like
            r = r * 0.393 + g * 0.769 + b * 0.189;
            g = r * 0.349 + g * 0.686 + b * 0.168;
            b = r * 0.272 + g * 0.534 + b * 0.131;
            break;
          case 2: // Cool blue
            r *= 0.9;
            b *= 1.1;
            break;
          case 3: // Warm yellow
            r *= 1.1;
            g *= 1.1;
            b *= 0.9;
            break;
        }

        // Apply strength
        const factor = strength / 100;
        r = r * factor + data[i] * (1 - factor);
        g = g * factor + data[i + 1] * (1 - factor);
        b = b * factor + data[i + 2] * (1 - factor);

        // Apply brightness
        r += brightness;
        g += brightness;
        b += brightness;

        // Apply contrast
        const contrastFactor =
          (259 * (contrast + 255)) / (255 * (259 - contrast));
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;

        // Apply saturation
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        r = gray + (saturation / 100) * (r - gray);
        g = gray + (saturation / 100) * (g - gray);
        b = gray + (saturation / 100) * (b - gray);

        // Ensure values are within 0-255 range
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
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
    applyVintageEffect();
  }, [style, strength, brightness, saturation, contrast]);

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
    applyVintageEffect();
    if (onApply) {
      onApply(previewImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-20">
      <div className="flex-grow relative">
        <img
          src={previewImageUrl || image}
          alt="Preview"
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>

      <div className="bg-gray-800 bg-opacity-50 px-4 py-1 max-w-md mx-auto w-full">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between mb-1">
            {[1, 2, 3].map((styleNum) => (
              <button
                key={styleNum}
                className={`px-4 py-2 m-2 rounded ${
                  style === styleNum ? "bg-blue-500" : "bg-gray-500"
                } text-white`}
                onClick={() => setStyle(styleNum)}
              >
                Style {styleNum}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SliderControl
              label="Strength"
              value={strength}
              onChange={setStrength}
              min="0"
              max="100"
            />
            <SliderControl
              label="Brightness"
              value={brightness}
              onChange={setBrightness}
            />
            <SliderControl
              label="Saturation"
              value={saturation}
              onChange={setSaturation}
            />
            <SliderControl
              label="Contrast"
              value={contrast}
              onChange={setContrast}
            />
          </div>
          <div className="flex  gap-2 justify-between mt-2">
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

export default VintageTool;
