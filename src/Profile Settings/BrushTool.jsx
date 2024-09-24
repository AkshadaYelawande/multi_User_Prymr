import React, { useRef, useEffect, useState } from "react";
import cross from "../assets/images/cross.png";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const BrushTool = ({ image, onClose, onBrush }) => {
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPreviewCircle, setShowPreviewCircle] = useState(true); // State to control preview circle visibility
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Set the crossOrigin attribute
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      saveToHistory();
    };

    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;
  }, [image]);

  useEffect(() => {
    if (contextRef.current) {
      const context = contextRef.current;
      context.lineWidth = brushSize;
      const r = parseInt(brushColor.slice(1, 3), 16);
      const g = parseInt(brushColor.slice(3, 5), 16);
      const b = parseInt(brushColor.slice(5, 7), 16);
      context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${brushOpacity})`;
    }
  }, [brushSize, brushColor, brushOpacity]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = (event) => {
    setShowPreviewCircle(false); // Hide preview circle when drawing starts
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();
    setShowPreviewCircle(true); // Show preview circle when drawing stops
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        contextRef.current.drawImage(img, 0, 0);
      };
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        contextRef.current.drawImage(img, 0, 0);
      };
    }
  };

  const handleBrushSizeChange = (event) => {
    setBrushSize(event.target.value);
  };

  const handleBrushColorChange = (event) => {
    setBrushColor(event.target.value);
  };

  const handleBrushOpacityChange = (event) => {
    setBrushOpacity(event.target.value);
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    startDrawing(touch);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    draw(touch);
  };

  const handleApplyChanges = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onBrush(url);
      } else {
        console.error("Failed to create blob");
      }
    }, "image/png");
  };

  // Function to get preview circle style
  const getPreviewCircleStyle = () => {
    return {
      display: showPreviewCircle ? "block" : "none", // Control visibility based on state
      width: brushSize + "px",
      height: brushSize + "px",
      backgroundColor: brushColor,
      opacity: brushOpacity,
      borderRadius: "50%",
      position: "absolute",
      pointerEvents: "none",
      zIndex: 999,
      marginLeft: "-0.5 * brushSize",
      marginTop: "-0.5 * brushSize",
    };
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center z-20 touch-none">
      <div className="flex justify-center items-center flex-grow bg-black bg-opacity-50 overflow-hidden w-full">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
          className="max-w-full max-h-full object-contain"
        />
        {/* Preview Circle */}
        <div style={getPreviewCircleStyle()}></div>
      </div>

      <div className="bg-gray-800 bg-opacity-50 p-2 max-w-md w-full sm:w-50 h-auto">
        <div className="flex justify-between items-center mb-1">
          <label className="text-white mr-2">Size:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={handleBrushSizeChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-white mr-2">Color:</label>
          <input
            type="color"
            value={brushColor}
            onChange={handleBrushColorChange}
          />
        </div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-white mr-2">Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={brushOpacity}
            onChange={handleBrushOpacityChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-between mt-2">
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
            className="bg-green-500 text-white px-4 py-1 rounded"
            onClick={handleApplyChanges}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrushTool;
