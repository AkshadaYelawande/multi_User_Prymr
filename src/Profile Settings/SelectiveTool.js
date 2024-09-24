import React, { useState, useRef, useEffect, useCallback } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const SelectiveTool = ({ image, onClose, onApply }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
  });
  const [radius, setRadius] = useState(100);
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
      updateHistory({ selectedPoint: null, adjustments, radius });
    };
  }, [image]);

  const drawSelectionCircle = useCallback(() => {
    if (!selectedPoint || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(selectedPoint.x, selectedPoint.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [selectedPoint, radius]);

  const applySelectiveAdjustment = useCallback(() => {
    if (!selectedPoint || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);

      const distance = Math.sqrt(
        Math.pow(x - selectedPoint.x, 2) + Math.pow(y - selectedPoint.y, 2)
      );

      if (distance <= radius) {
        const factor = 1 - distance / radius;

        // Apply brightness
        const brightness = adjustments.brightness * factor;
        data[i] = Math.min(255, Math.max(0, data[i] + brightness));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));

        // Apply contrast
        const contrast = (adjustments.contrast / 100) * factor + 1;
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
        const sat = (adjustments.saturation / 100) * factor + 1;
        const gray =
          0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.min(255, Math.max(0, gray * (1 - sat) + data[i] * sat));
        data[i + 1] = Math.min(
          255,
          Math.max(0, gray * (1 - sat) + data[i + 1] * sat)
        );
        data[i + 2] = Math.min(
          255,
          Math.max(0, gray * (1 - sat) + data[i + 2] * sat)
        );
      }
    }

    ctx.putImageData(imageData, 0, 0);
    drawSelectionCircle();
  }, [selectedPoint, adjustments, radius, drawSelectionCircle]);

  useEffect(() => {
    applySelectiveAdjustment();
  }, [applySelectiveAdjustment]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const newSelectedPoint = { x, y };
    setSelectedPoint(newSelectedPoint);
    updateHistory({ selectedPoint: newSelectedPoint, adjustments, radius });
    applySelectiveAdjustment();
  };

  const handleAdjustmentChange = (type, value) => {
    const newAdjustments = { ...adjustments, [type]: parseInt(value, 10) };
    setAdjustments(newAdjustments);
    updateHistory({ selectedPoint, adjustments: newAdjustments, radius });
  };

  const handleRadiusChange = (value) => {
    const newRadius = parseInt(value, 10);
    setRadius(newRadius);
    updateHistory({ selectedPoint, adjustments, radius: newRadius });
    applySelectiveAdjustment();
  };

  const updateHistory = (state) => {
    const newHistory = [...history.slice(0, historyIndex + 1), state];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevState = history[historyIndex - 1];
      setSelectedPoint(prevState.selectedPoint);
      setAdjustments(prevState.adjustments);
      setRadius(prevState.radius);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      setSelectedPoint(nextState.selectedPoint);
      setAdjustments(nextState.adjustments);
      setRadius(nextState.radius);
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
          onClick={handleCanvasClick}
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="bg-gray-800 bg-opacity-50 p-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="mb-2">
            <label className="text-white">Radius</label>
            <input
              type="range"
              min="10"
              max="300"
              value={radius}
              onChange={(e) => handleRadiusChange(e.target.value)}
              className="w-full"
            />
          </div>
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
          <div className="flex justify-between items-center col-span-2 bg-black">
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

export default SelectiveTool;
