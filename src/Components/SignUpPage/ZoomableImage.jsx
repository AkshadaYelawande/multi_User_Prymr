import React, { useState, useRef, useEffect } from "react";

const ZoomableImage = ({ src, alt, onImageChange }) => {
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 4);
    setScale(newScale);
    updateImage(newScale, position);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setPanning(true);
    setOrigin({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseUp = () => {
    setPanning(false);
  };

  const handleMouseMove = (e) => {
    if (!panning) return;
    const newX = e.clientX - origin.x;
    const newY = e.clientY - origin.y;
    setPosition({ x: newX, y: newY });
    updateImage(scale, { x: newX, y: newY });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setPanning(true);
    setOrigin({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!panning) return;
    const touch = e.touches[0];
    const newX = touch.clientX - origin.x;
    const newY = touch.clientY - origin.y;
    setPosition({ x: newX, y: newY });
    updateImage(scale, { x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setPanning(false);
  };

  const updateImage = (currentScale, currentPosition) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = 200; // Set to desired output size
    canvas.height = 200;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(currentScale, currentScale);
    ctx.translate(
      -centerX + currentPosition.x / currentScale,
      -centerY + currentPosition.y / currentScale
    );

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/png");
    if (onImageChange && typeof onImageChange === "function") {
      onImageChange(dataUrl);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scale, position]);

  return (
    <div
      ref={containerRef}
      className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden cursor-move"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center",
          transition: "transform 0.1s ease-out",
          objectFit: "contain",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default ZoomableImage;
