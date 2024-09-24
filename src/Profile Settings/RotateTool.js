import React, { useState, useRef, useEffect } from "react";

const RotateTool = ({ image, onClose, onRotate }) => {
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  const handleRotate = (degree) => {
    setRotation((prevRotation) => {
      const newRotation = (prevRotation + degree) % 360;
      return newRotation < 0 ? newRotation + 360 : newRotation;
    });
  };

  const handleApply = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    canvas.width = img.naturalWidth * cos + img.naturalHeight * sin;
    canvas.height = img.naturalWidth * sin + img.naturalHeight * cos;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    canvas.toBlob((blob) => {
      onRotate(URL.createObjectURL(blob), rotation);
      onClose();
    }, "image/jpeg");
  };

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <div className="relative">
        <img
          ref={imageRef}
          src={image}
          alt="To rotate"
          className="max-h-[80vh] max-w-[80vw]"
          crossOrigin="anonymous"
        />
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 absolute bottom-0 justify-center text-nowrap">
        <button
          className="bg-gray-800 text-white rounded-full"
          onClick={() => handleRotate(-90)}
        >
          Rotate Left
        </button>
        <button
          className="bg-gray-800 text-white rounded-full"
          onClick={() => handleRotate(90)}
        >
          Rotate Right
        </button>
        <button
          className="bg-gray-800 text-white rounded-full"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white rounded-full"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default RotateTool;
