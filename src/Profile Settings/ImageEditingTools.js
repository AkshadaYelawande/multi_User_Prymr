import React, { useState } from "react";
import ReactImagePickerEditor from "react-image-picker-editor";
import "react-image-picker-editor/dist/index.css";

const ImageEditingTools = () => {
  const config = {
    borderRadius: "8px",
    language: "en",
    width: "330px",
    height: "250px",
    objectFit: "contain",
    // aspectRatio: 4 / 3,
    compressInitial: null,
  };

  const [imageSrc, setImageSrc] = useState("");

  const initialImage = "";

  return (
    <div className="container">
      <ReactImagePickerEditor
        config={config}
        imageSrcProp={initialImage}
        imageChanged={(newDataUri) => {
          setImageSrc(newDataUri);
        }}
      />
      <br /> <br />
      <hr />
      <br />
      <p>setImageSrc:</p>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="example"
          style={{
            maxHeight: "900px",
            maxWidth: "100%",
            objectFit: "contain",
            background: "black",
          }}
        />
      ) : (
        <h2 style={{ textAlign: "center" }}>No image loaded yet</h2>
      )}
    </div>
  );
};
export default ImageEditingTools;
