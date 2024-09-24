import React, { useState, useRef, useEffect, useCallback } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const TuneImageTool = ({ image, onClose, onApply }) => {
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = image;
    img.onload = () => {
      imageRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      setHistory([{ ...adjustments }]);
      setHistoryIndex(0);
    };
  }, [image]);

  const applyAdjustments = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      data[i] = Math.min(255, Math.max(0, data[i] + adjustments.brightness));
      data[i + 1] = Math.min(
        255,
        Math.max(0, data[i + 1] + adjustments.brightness)
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, data[i + 2] + adjustments.brightness)
      );

      // Apply contrast
      const contrast = adjustments.contrast / 100 + 1;
      const intercept = 128 * (1 - contrast);
      data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept));
      data[i + 1] = Math.min(
        255,
        Math.max(0, data[i + 1] * contrast + intercept)
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, data[i + 2] * contrast + intercept)
      );

      // Apply saturation
      const sat = adjustments.saturation / 100 + 1;
      const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.min(255, Math.max(0, gray * (1 - sat) + data[i] * sat));
      data[i + 1] = Math.min(
        255,
        Math.max(0, gray * (1 - sat) + data[i + 1] * sat)
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, gray * (1 - sat) + data[i + 2] * sat)
      );

      // Apply temperature
      data[i] += adjustments.temperature;
      data[i + 2] -= adjustments.temperature;

      // Apply tint
      data[i + 1] += adjustments.tint;

      // Apply highlights and shadows (simplified)
      if (data[i] > 128) {
        data[i] += adjustments.highlights;
        data[i + 1] += adjustments.highlights;
        data[i + 2] += adjustments.highlights;
      } else {
        data[i] += adjustments.shadows;
        data[i + 1] += adjustments.shadows;
        data[i + 2] += adjustments.shadows;
      }

      // Ensure values are within 0-255 range
      data[i] = Math.min(255, Math.max(0, data[i]));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
    }

    ctx.putImageData(imageData, 0, 0);
  }, [adjustments]);

  useEffect(() => {
    applyAdjustments();
  }, [applyAdjustments]);

  const handleAdjustmentChange = (type, value) => {
    const newAdjustments = { ...adjustments, [type]: parseInt(value, 10) };
    setAdjustments(newAdjustments);
    updateHistory(newAdjustments);
  };

  const updateHistory = (newAdjustments) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newAdjustments];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAdjustments(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAdjustments(history[historyIndex + 1]);
    }
  };

  const handleApply = () => {
    onApply(canvasRef.current.toDataURL("image/jpeg"));
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="bg-gray-800 bg-opacity-10 p-1 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(adjustments).map(([key, value]) => (
            <div key={key} className="mb-2">
              <label className="text-white capitalize">{key}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={value}
                onChange={(e) => handleAdjustmentChange(key, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
          <div className="flex justify-between items-center col-span-3 bg-black">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <div className="flex space-x-2">
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
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuneImageTool;