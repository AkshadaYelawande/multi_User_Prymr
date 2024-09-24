import React, { useState, useEffect, useRef } from "react";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";

const DetailsModal = ({ image, onClose, onApply }) => {
  const [adjustments, setAdjustments] = useState({
    sharpness: 0,
    structure: 0,
    noiseReduction: 0,
    vignette: 0,
  });
  const [previewImage, setPreviewImage] = useState(image);
  const canvasRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setHistory([adjustments]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = previewImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };
  }, [previewImage]);

  useEffect(() => {
    const updatePreviewImage = async () => {
      const updatedImageDataUrl = await applyDetailAdjustments(
        image,
        adjustments.sharpness,
        adjustments.structure,
        adjustments.noiseReduction,
        adjustments.vignette
      );
      setPreviewImage(updatedImageDataUrl);
    };

    updatePreviewImage();
  }, [image, adjustments]);

  const applyDetailAdjustments = (
    imageUrl,
    sharpness,
    structure,
    noiseReduction,
    vignette
  ) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Ensure cross-origin access
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // Draw the original image on the canvas
        ctx.drawImage(img, 0, 0);

        // Apply sharpness using a simple convolution filter
        if (sharpness !== 0) {
          ctx.filter = `blur(${sharpness < 0 ? Math.abs(sharpness) : 0}px)`;
          ctx.drawImage(canvas, 0, 0);
          if (sharpness > 0) {
            const sharpenFilter = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            applyConvolutionFilter(ctx, img, sharpenFilter);
          }
        }

        // Apply structure (contrast and brightness)
        if (structure !== 0) {
          ctx.filter = `contrast(${100 + structure}%) brightness(${
            100 + structure * 0.5
          }%)`;
          ctx.drawImage(canvas, 0, 0);
        }

        // Apply noise reduction
        if (noiseReduction !== 0) {
          ctx.filter = `blur(${noiseReduction * 0.1}px)`;
          ctx.drawImage(canvas, 0, 0);
        }

        // Apply vignette
        if (vignette !== 0) {
          const vignetteValue = vignette / 100;
          const vignetteRadius =
            (Math.min(img.width, img.height) / 2) *
            (1 - Math.abs(vignetteValue));
          const centerX = img.width / 2;
          const centerY = img.height / 2;
          const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            vignetteRadius
          );
          gradient.addColorStop(
            0,
            `rgba(0, 0, 0, ${1 - Math.abs(vignetteValue)})`
          );
          gradient.addColorStop(1, `rgba(0, 0, 0, ${Math.abs(vignetteValue)})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, img.width, img.height);
        }

        const updatedImageDataUrl = canvas.toDataURL("image/png");
        resolve(updatedImageDataUrl);
      };
    });
  };

  const applyConvolutionFilter = (ctx, img, filter) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const tempCtx = canvas.getContext("2d");
    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const pixels = imageData.data;
    const side = Math.round(Math.sqrt(filter.length));
    const halfSide = Math.floor(side / 2);
    const src = tempCtx.getImageData(0, 0, img.width, img.height).data;
    const canvasWidth = img.width;
    const canvasHeight = img.height;

    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const dstOff = (y * canvasWidth + x) * 4;
        let r = 0,
          g = 0,
          b = 0;

        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = y + cy - halfSide;
            const scx = x + cx - halfSide;
            if (
              scy >= 0 &&
              scy < canvasHeight &&
              scx >= 0 &&
              scx < canvasWidth
            ) {
              const srcOff = (scy * canvasWidth + scx) * 4;
              const wt = filter[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
            }
          }
        }
        pixels[dstOff] = r;
        pixels[dstOff + 1] = g;
        pixels[dstOff + 2] = b;
      }
    }

    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(canvas, 0, 0);
  };

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
    onApply(previewImage);
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="bg-gray-800 bg-opacity-10 p-2 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(adjustments).map(([key, value]) => (
            <div key={key} className="mb-1">
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
          <div className="flex gap-2 justify-between col-span-2">
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
      <div className="w-full bg-black flex justify-center items-center py-1">
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

export default DetailsModal;
