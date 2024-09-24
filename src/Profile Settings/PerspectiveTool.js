import React, { useState, useRef, useEffect } from "react";

const PerspectiveTool = ({ image, onClose, onApply }) => {
  const [perspectiveValues, setPerspectiveValues] = useState({
    topLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
    bottomLeft: { x: 0, y: 0 },
    bottomRight: { x: 0, y: 0 },
  });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      imgRef.current = img;
      drawImage();
    };
    window.addEventListener("resize", drawImage);
    return () => window.removeEventListener("resize", drawImage);
  }, [image]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100; // Adjust for button area

    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );
    const x = canvas.width / 2 - (img.width / 2) * scale;
    const y = canvas.height / 2 - (img.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Draw perspective grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      x + perspectiveValues.topLeft.x,
      y + perspectiveValues.topLeft.y
    );
    ctx.lineTo(
      x + img.width * scale + perspectiveValues.topRight.x,
      y + perspectiveValues.topRight.y
    );
    ctx.lineTo(
      x + img.width * scale + perspectiveValues.bottomRight.x,
      y + img.height * scale + perspectiveValues.bottomRight.y
    );
    ctx.lineTo(
      x + perspectiveValues.bottomLeft.x,
      y + img.height * scale + perspectiveValues.bottomLeft.y
    );
    ctx.closePath();
    ctx.stroke();

    // Draw control points
    const points = [
      {
        x: x + perspectiveValues.topLeft.x,
        y: y + perspectiveValues.topLeft.y,
      },
      {
        x: x + img.width * scale + perspectiveValues.topRight.x,
        y: y + perspectiveValues.topRight.y,
      },
      {
        x: x + perspectiveValues.bottomLeft.x,
        y: y + img.height * scale + perspectiveValues.bottomLeft.y,
      },
      {
        x: x + img.width * scale + perspectiveValues.bottomRight.x,
        y: y + img.height * scale + perspectiveValues.bottomRight.y,
      },
    ];

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    });
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    const pointer = e.touches ? e.touches[0] : e;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = pointer.clientX - rect.left;
    const y = pointer.clientY - rect.top;

    // Find the closest control point and update its position
    const points = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
    let closestPoint = null;
    let minDistance = Infinity;

    points.forEach((point) => {
      const dx = x - (rect.width / 2 + perspectiveValues[point].x);
      const dy = y - (rect.height / 2 + perspectiveValues[point].y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    if (closestPoint) {
      setPerspectiveValues((prev) => ({
        ...prev,
        [closestPoint]: {
          x: x - rect.width / 2,
          y: y - rect.height / 2,
        },
      }));
      drawImage();
    }
  };

  const applyPerspective = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    const srcPoints = [
      0,
      0,
      img.width,
      0,
      0,
      img.height,
      img.width,
      img.height,
    ];

    const dstPoints = [
      perspectiveValues.topLeft.x,
      perspectiveValues.topLeft.y,
      img.width + perspectiveValues.topRight.x,
      perspectiveValues.topRight.y,
      perspectiveValues.bottomLeft.x,
      img.height + perspectiveValues.bottomLeft.y,
      img.width + perspectiveValues.bottomRight.x,
      img.height + perspectiveValues.bottomRight.y,
    ];

    const transform = getProjectiveTransform(srcPoints, dstPoints);
    applyTransform(ctx, transform, img);

    onApply(canvas.toDataURL());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className="flex-grow"
      />
      <div className="flex justify-center gap-4 p-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={applyPerspective}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

// Helper functions for perspective transformation
function getProjectiveTransform(src, dst) {
  const matrix = [];
  const b = [];

  for (let i = 0; i < 4; i++) {
    const x = src[i * 2];
    const y = src[i * 2 + 1];
    const X = dst[i * 2];
    const Y = dst[i * 2 + 1];

    matrix.push([x, y, 1, 0, 0, 0, -X * x, -X * y]);
    matrix.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]);
    b.push(X);
    b.push(Y);
  }

  const a = solve(matrix, b);
  return [a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], 1];
}

function solve(A, b) {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[j][i]) > Math.abs(A[maxRow][i])) {
        maxRow = j;
      }
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    for (let j = i + 1; j < n; j++) {
      const factor = A[j][i] / A[i][i];
      b[j] -= factor * b[i];
      for (let k = i; k < n; k++) {
        A[j][k] -= factor * A[i][k];
      }
    }
  }

  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = b[i];
    for (let j = i + 1; j < n; j++) {
      x[i] -= A[i][j] * x[j];
    }
    x[i] /= A[i][i];
  }

  return x;
}

function applyTransform(ctx, transform, img) {
  const [a, b, c, d, e, f] = transform;

  ctx.save();
  ctx.transform(a, d, b, e, c, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

export default PerspectiveTool;
