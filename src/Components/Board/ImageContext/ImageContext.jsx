import React, { createContext, useState } from "react";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [layerImageUrl, setImageUrl] = useState(null);

  return (
    <ImageContext.Provider value={{ layerImageUrl, setImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
};
