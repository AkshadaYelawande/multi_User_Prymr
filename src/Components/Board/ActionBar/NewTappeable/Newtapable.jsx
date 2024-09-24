import React, { useState } from "react";
import dottedCircle from "../../../../assets/dottedCircle.svg";
import createButton from "../../../../assets/createButton.svg";
import smily from "../../../../assets/smily.svg";
import questionmarkcircle from "../../../../assets/questionmarkcircle.svg";
import cross from "../../../../assets/x-mark.svg";
import EmojiPicker from "emoji-picker-react";
const NewTappable = ({
  onClose,
  onSelectTappableArea,
  onImageSelect,
  onEmojiSelect,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
    setShowEmojiPicker(false);
    onClose();
  };

  if (showEmojiPicker) {
    return (
      <div className="absolute bottom-full left-0 z-10">
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>
    );
  }

  return (
    <div className="px-1  text-white bg-gray-800 bg-opacity-75 justify-center">
      <div className="flex scroll-pt-20">
        <img
          src={cross}
          alt="X"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />
        <h1> Create a Button (Tappable)</h1>
      </div>
      <div
        className="flex px-8 m-4 gap-1 items-center py-2 rounded-[20px] border-[1px] p-[10px_15px_10px_15px]"
        onClick={onSelectTappableArea}
        style={{ cursor: "pointer" }}
      >
        <img src={dottedCircle} alt="" className="mr-2" />
        <div className="flex flex-col justify-center">
          <h3>Select Tappable Area</h3>
          <span>Creates a tappable space</span>
        </div>
        <img src={questionmarkcircle} alt="" className="ml-auto" />
      </div>
      <div className="flex px-8 m-4 gap-1 items-center py-2 rounded-[20px] border-[1px] p-[0px_5px_5px_1px] cursor-pointer">
        <label
          htmlFor="image-upload"
          className="flex text-wrap flex-col justify-center w-full"
        >
          <div className="flex items-center w-full cursor-pointer">
            <img src={createButton} className="mr-2" />
            <div className="flex text-wrap flex-col justify-center">
              <h3>Upload Image</h3>
              <span className="text-[#FFFFFFB2]">
                Select an image from your gallery
              </span>
            </div>
            <img src={questionmarkcircle} alt="" className="ml-auto" />
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="image-upload"
        />
      </div>
      <div
        className="flex px-8 mx-4 gap-1 items-center py-2 rounded-[20px] border-[1px] p-[10px_15px_10px_15px] cursor-pointer"
        onClick={() => setShowEmojiPicker(true)}
      >
        <img src={smily} className="mr-2" />
        <div className="flex flex-col justify-center">
          <h3>Choose pre-made buttons </h3>
          <span className="text-[#FFFFFFB2]">from stickers, gifs</span>
        </div>
        <img
          src={questionmarkcircle}
          alt=""
          className="ml-auto cursor-pointer"
        />
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};
export default NewTappable;
