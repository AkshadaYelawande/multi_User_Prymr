import React, { useState, useRef, useEffect } from "react";

const CurvesModal = ({ image, onClose, onApply }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [curvePoints, setCurvePoints] = useState([
    { x: 0, y: 600 },
    { x: 400, y: 0 },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = image;
    imageRef.current = img;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawImageAndCurve();
    };

    const drawImageAndCurve = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      applyCurveToImage();
      drawCurve(ctx);
    };

    const drawCurve = (ctx) => {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i <= 10; i++) {
        const y = (i / 10) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        const x = (i / 10) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw curve line
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      curvePoints.forEach(({ x, y }) => {
        ctx.lineTo(x, y);
      });
      ctx.lineTo(canvas.width, 0);
      ctx.stroke();

      // Draw curve points
      ctx.fillStyle = "#fff";
      curvePoints.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    const applyCurveToImage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const curveMap = createCurveMap(curvePoints, canvas.width, canvas.height);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = applyCurve(data[i], curveMap);
        data[i + 1] = applyCurve(data[i + 1], curveMap);
        data[i + 2] = applyCurve(data[i + 2], curveMap);
      }

      ctx.putImageData(imageData, 0, 0);
    };

    drawImageAndCurve();

    return () => {
      img.onload = null;
    };
  }, [image, curvePoints]);

  const handleCanvasMouseDown = (e) => {
    handlePointerDown(e.clientX, e.clientY);
  };

  const handleCanvasTouchStart = (e) => {
    const touch = e.touches[0];
    handlePointerDown(touch.clientX, touch.clientY);
  };

  const handlePointerDown = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const closestIndex = findClosestPoint(curvePoints, x, y);
    if (closestIndex !== -1) {
      setIsDragging(true);
      setDragIndex(closestIndex);
    } else {
      const newCurvePoints = [...curvePoints, { x, y }];
      setCurvePoints(newCurvePoints.sort((a, b) => a.x - b.x));
    }
  };

  const handleCanvasMouseMove = (e) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleCanvasTouchMove = (e) => {
    const touch = e.touches[0];
    handlePointerMove(touch.clientX, touch.clientY);
  };

  const handlePointerMove = (clientX, clientY) => {
    if (isDragging && dragIndex !== null) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const newCurvePoints = [...curvePoints];
      newCurvePoints[dragIndex] = { x, y };
      setCurvePoints(newCurvePoints.sort((a, b) => a.x - b.x));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const handleCanvasTouchEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const findClosestPoint = (points, x, y) => {
    let closestIndex = -1;
    let minDistance = Infinity;
    points.forEach((point, index) => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const applyChanges = () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const curveMap = createCurveMap(curvePoints, canvas.width, canvas.height);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = applyCurve(data[i], curveMap);
        data[i + 1] = applyCurve(data[i + 1], curveMap);
        data[i + 2] = applyCurve(data[i + 2], curveMap);
      }

      ctx.putImageData(imageData, 0, 0);
      const newImageDataUrl = canvas.toDataURL("image/png");
      onApply(newImageDataUrl);
    };
  };

  const createCurveMap = (points, width, height) => {
    const curveMap = new Array(256).fill(0);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * width;
      let y = 0;
      for (let j = 0; j < points.length - 1; j++) {
        const p1 = points[j];
        const p2 = points[j + 1];
        if (p1.x <= x && x < p2.x) {
          y = p1.y + ((x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
          break;
        }
      }
      curveMap[i] = 1 - y / height;
    }
    return curveMap;
  };

  const applyCurve = (value, curveMap) => {
    return Math.min(255, Math.max(0, curveMap[Math.round(value)] * 255));
  };

  // Modal style for positioning
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: "8px",
    zIndex: 1000,
    width: "80%", // Adjust width as per your design
  };

  return (
    <div style={modalStyle}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-bold">Curves</h2>
        <button
          className="text-white hover:text-gray-400 w-auto"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", maxHeight: "80vh" }}
          className="border border-gray-600"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={applyChanges}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CurvesModal;
