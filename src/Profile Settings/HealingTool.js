import React, { useState, useEffect, useRef } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const HealingTool = ({ image, onClose, onApply }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
  img.crossOrigin = "Anonymous"; 
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
  }, [image]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    healImage(e);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    healImage(e.touches[0]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    healImage(e);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    healImage(e.touches[0]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    saveToHistory();
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    saveToHistory();
  };

  const healImage = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const brushRadius = brushSize / 2;

    // Get the surrounding area for blending
    const surroundingSize = brushSize + 20;
    const surroundingData = ctx.getImageData(
      Math.max(0, x - brushRadius - 10),
      Math.max(0, y - brushRadius - 10),
      Math.min(canvas.width - 1, surroundingSize),
      Math.min(canvas.height - 1, surroundingSize)
    );

    const imageData = ctx.getImageData(
      Math.max(0, x - brushRadius),
      Math.max(0, y - brushRadius),
      Math.min(canvas.width - 1, brushSize),
      Math.min(canvas.height - 1, brushSize)
    );
    const data = imageData.data;
    const { width, height } = imageData;

    // Find the most similar color in the surrounding area
    let bestColor = { r: 0, g: 0, b: 0, diff: Infinity };
    for (let i = 0; i < surroundingData.data.length; i += 4) {
      const r = surroundingData.data[i];
      const g = surroundingData.data[i + 1];
      const b = surroundingData.data[i + 2];
      const diff =
        Math.abs(data[0] - r) + Math.abs(data[1] - g) + Math.abs(data[2] - b);
      if (diff < bestColor.diff) {
        bestColor = { r, g, b, diff };
      }
    }

    // Apply the best color to the brushed area
    for (let i = 0; i < data.length; i += 4) {
      data[i] = bestColor.r;
      data[i + 1] = bestColor.g;
      data[i + 2] = bestColor.b;
    }

    ctx.putImageData(
      imageData,
      Math.max(0, x - brushRadius),
      Math.max(0, y - brushRadius)
    );
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    const newImageDataUrl = canvas.toDataURL("image/png");
    onApply(newImageDataUrl);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      setRedoStack([history.pop(), ...redoStack]);
      const previousState = history[history.length - 1];
      setHistory([...history]);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(previousState, 0, 0);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const redoState = redoStack.shift();
      setHistory([...history, redoState]);
      setRedoStack([...redoStack]);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(redoState, 0, 0);
    }
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setHistory([
      ...history,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);
    setRedoStack([]);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-75">
      <canvas
        ref={canvasRef}
        className="border w-full sm:w-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      ></canvas>
      <div className="grid grid-cols-2 gap-1 mt-4 items-center justify-center bg-black flex-wrap">
        <label className="text-white">Brush Size:</label>
        <input
          type="range"
          min="5"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="mr-4"
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
      <div className="flex">
        <div
          className="px-2 flex flex-col items-center cursor-pointer mr-2"
          onClick={handleUndo}
        >
          <img src={undo} alt="undo" className="w-5 h-5" />
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Undo
          </div>
        </div>
        <div
          className="px-2 flex flex-col items-center cursor-pointer mr-2"
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

export default HealingTool;
