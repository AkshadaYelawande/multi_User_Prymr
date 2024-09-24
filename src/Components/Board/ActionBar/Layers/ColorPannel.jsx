import React from "react";

const ColorPanel = ({ onSelectColor, onClose }) => {
  const colors = [
    "#4B4B4B",
    "#FF0000",
    "#00EEFF",
    "#FFFF00",
    "#00FF00",
    "#9E00FF",
    "#FFFF",
  ];

  return (
    <div className="relative z-10 bg-[#4B4B4B] rounded shadow-md flex items-center">
      <div className="flex space-x-2">
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => onSelectColor(color)}
            className="w-5 h-5 rounded-full cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <button
        onClick={onClose}
        className="p-1 ml-3  text-white hover:text-gray-300"
      >
        X
      </button>
    </div>
  );
};

export default ColorPanel;
