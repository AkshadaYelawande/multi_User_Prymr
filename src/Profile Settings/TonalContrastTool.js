import React, { useState, useEffect } from "react";
import cross from "../assets/images/cross.png";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const TonalContrastTool = ({ image, onClose, onApply }) => {
  const [highContrast, setHighContrast] = useState(0);
  const [midContrast, setMidContrast] = useState(0);
  const [lowContrast, setLowContrast] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const applyTonalContrast = () => {
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
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        let contrastFactor;
        if (luminance < 85) {
          contrastFactor = 1 + lowContrast / 100;
        } else if (luminance < 170) {
          contrastFactor = 1 + midContrast / 100;
        } else {
          contrastFactor = 1 + highContrast / 100;
        }

        data[i] = Math.min(255, Math.max(0, (r - 128) * contrastFactor + 128));
        data[i + 1] = Math.min(
          255,
          Math.max(0, (g - 128) * contrastFactor + 128)
        );
        data[i + 2] = Math.min(
          255,
          Math.max(0, (b - 128) * contrastFactor + 128)
        );
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
    applyTonalContrast();
  }, [highContrast, midContrast, lowContrast]);

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

  const ContrastSlider = ({ label, value, onChange }) => (
    <div className="mb-4">
      <label className="text-white capitalize">{label}</label>
      <input
        type="range"
        min="-100"
        max="100"
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
    // Optionally, you can pass the modified image data back to the parent component
    // using the `onApply` prop if needed.
    applyTonalContrast();
    if (onApply) {
      onApply(previewImageUrl); // Passes the preview image URL back to the parent component
    }
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

      <div className="bg-gray-800 bg-opacity-30 px-4 py-2 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-1">
          <ContrastSlider
            label="High Contrast"
            value={lowContrast}
            onChange={setLowContrast}
          />
          <ContrastSlider
            label="Mid Contrast"
            value={midContrast}
            onChange={setMidContrast}
          />
          <ContrastSlider
            label="Low Contrast"
            value={highContrast}
            onChange={setHighContrast}
          />
          <div className="col-span-3 gap-2 flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleApply} // Call handleApply instead of applyTonalContrast directly
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

export default TonalContrastTool;
