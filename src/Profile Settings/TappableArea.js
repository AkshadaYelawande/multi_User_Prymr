import React, { useState } from "react";

const TappableArea = () => {
  const [buttons, setButtons] = useState([]);

  const handleAreaClick = (e) => {
    const newButton = {
      id: Date.now(),
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    setButtons([...buttons, newButton]);
  };

  return (
    <div
      className="relative w-full h-96 bg-gray-200 cursor-pointer"
      onClick={handleAreaClick}
    >
      {buttons.map((button) => (
        <button
          key={button.id}
          className="absolute px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          style={{ left: button.x, top: button.y }}
          onClick={(e) => e.stopPropagation()}
        >
          Button
        </button>
      ))}
    </div>
  );
};

export default TappableArea;
