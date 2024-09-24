import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import Avatar_pizzaboy from "../../assets/Avatar_pizzaboy.png";
import Smily2 from "../../assets/Smily2.svg";
import ImageSquare from "../../assets/ImageSquare.svg";
import gif from "../../assets/gif.svg";
import PaperPlaneRight from "../../assets/PaperPlaneRight.svg";
import Line68 from "../../assets/Line68.png";
import Gift_pop from "../../assets/Gift_pop.svg";
import X from "../../assets/X.svg";
import EmojiPicker from "emoji-picker-react";
import Draggable from "react-draggable";

const LongPressPopUp = ({
  onClose,
  onTextEnter,
  reactionData,
  popupPosition,
  onEmojiSelect,
  scale,
  onCapture,
}) => {
  const stageRef = useRef(null);

  const yellowBoxRef = useRef(null);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [gifs, setGifs] = useState([]);
  const userName = localStorage.getItem("userName");
  const profileImage = localStorage.getItem("profileImage");
  const initialIconUrl = localStorage.getItem("initialIconUrl");
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [position, setPosition] = useState("bottom"); // State to manage position
  const whiteBoxRef = useRef(null);
  const smileyButtonRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateYellowBoxPosition = () => {
      if (yellowBoxRef.current) {
        const rect = yellowBoxRef.current.getBoundingClientRect();
        onCapture(rect);
      }
    };

    updateYellowBoxPosition();
    window.addEventListener("resize", updateYellowBoxPosition);

    return () => {
      window.removeEventListener("resize", updateYellowBoxPosition);
    };
  }, [onCapture]);

  useEffect(() => {
    const checkPosition = () => {
      if (whiteBoxRef.current && smileyButtonRef.current) {
        const whiteBoxRect = whiteBoxRef.current.getBoundingClientRect();
        const smileyButtonRect =
          smileyButtonRef.current.getBoundingClientRect();

        // Calculate available space above and below
        const spaceAbove = smileyButtonRect.top;
        const spaceBelow = window.innerHeight - smileyButtonRect.bottom;

        // If space below is less than the white box height, position it above
        if (spaceBelow < whiteBoxRect.height) {
          setPosition("top");
        } else {
          setPosition("bottom");
        }
      }
    };
    window.addEventListener("resize", checkPosition);
    checkPosition(); // Initial check on mount
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  useEffect(() => {
    if (reactionData) {
      setIsLoading(false);
    }
    // console.log(reactionData);
  }, [reactionData]);

  const fetchGifs = async (searchTerm = "") => {
    // console.log("Fetching GIFs...");
    const apiKey = "LIVDSRZULELA"; // This is a test API key, replace with your own from Tenor
    const url = `https://g.tenor.com/v1/search?q=${searchTerm}&key=${apiKey}&limit=50`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log("GIFs fetched:", data.results);
      setGifs(data.results || []); // Ensure we always set an array
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setGifs([
        {
          id: "1",
          media: [
            {
              tinygif: {
                url: "https://media1.tenor.com/images/xxxxxx/tenor.gif",
              },
            },
          ],
        },
        {
          id: "2",
          media: [
            {
              tinygif: {
                url: "https://media2.tenor.com/images/xxxxxx/tenor.gif",
              },
            },
          ],
        },
      ]);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.innerText.replace(/\n$/, "");
    setText(newText);
    setText(e.target.innerText);
  };

  const handleAddText = async () => {
    if (text.trim() !== "" || selectedImage || selectedGif || selectedEmoji) {
      const yellowBoxRect = yellowBoxRef.current.getBoundingClientRect();

      console.log("yellowBoxRect", yellowBoxRect);

      // const capturedImage = await captureBackground(yellowBoxPosition);

      const capturedImage = await onCapture(yellowBoxRect);
      // Capture the background
      onCapture(popupPosition);

      // Prepare payload for the reaction creation
      const reactionPayload = {
        text,
        image: selectedImage,
        gif: selectedGif,
        emoji: selectedEmoji,
        // yellowBoxPosition: {
        //   x: yellowBoxRect.left,
        //   y: yellowBoxRect.top,
        //   width: yellowBoxRect.width,
        //   height: yellowBoxRect.height,
        // },
        capturedImage,
      };
      onTextEnter(reactionPayload);

      // Reset state after adding reaction
      setText("");
      setSelectedImage(null);
      setSelectedGif(null);
      setSelectedEmoji(null);
      inputRef.current.innerText = "";
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleEmojiClick = (emojiData, event) => {
    const selectedEmoji = emojiData.emoji;
    setSelectedEmoji(selectedEmoji);
    setShowEmojiPicker(false);
    onEmojiSelect(selectedEmoji); // Pass the selected emoji back to the parent
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    console.log("file");
    console.log(event.target.files[0]);
    console.log(event);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // console.log("showGifPicker:", showGifPicker);
    if (showGifPicker) {
      fetchGifs();
    }
  }, [showGifPicker]);

  const handleGifClick = (gif) => {
    setSelectedGif(gif.media[0].gif.url);
    setShowGifPicker(false);
  };

  const removeSelectedMedia = () => {
    setSelectedImage(null);
    setSelectedGif(null);
  };

  const handleAddReaction = () => {
    const newReaction = {
      text: inputRef.current.textContent,
      emoji: selectedEmoji,
      image: selectedImage,
      gif: selectedGif,
    };
    setReactions([...reactions, newReaction]);

    // Reset input and selections
    inputRef.current.textContent = "";
    setSelectedEmoji(null);
    setSelectedImage(null);
    setSelectedGif(null);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setShowEmojiPicker(false);
  };

  const handleDragStop = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    console.log("Stage mounted:", stageRef.current); // Check if the stage is accessible after rendering
  }, []);

  // Function to capture the background within the yellow box
  const captureBackground = () => {
    const yellowBoxPosition = yellowBoxRef.current.getBoundingClientRect();
    // Send the captured image to parent component via callback
    onCapture(yellowBoxPosition);
  };

  return (
    <div
      className="popup-container relative overflow-hidden z-10"
      style={{
        width: "90vw",
        maxWidth: "400px",
        height: "90vh",
        maxHeight: "500px",
        overflowY: "auto",
      }}
    >
      {/* Yellow box for capturing area */}
      <div
        ref={yellowBoxRef}
        onClick={captureBackground}
        className="w-[75px] h-[75px] left-[105.14px] top-[3px] absolute bg-white/0 rounded-xl border-2 border-[#fff400] flex items-center justify-center overflow-hidden z-20 "
        style={{
          width: "20vw", // Responsive size
          height: "20vw",
          maxWidth: "75px", // Set maximum dimensions
          maxHeight: "75px",
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          onTouchStart={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {selectedEmoji ? (
            <span className="text-2xl absolute">{selectedEmoji}</span>
          ) : (
            <img
              src={Smily2}
              alt="Smiley"
              className="absolute bottom-1 left-1 w-[30.86px] h-[30.86px]"
            />
          )}
        </div>
      </div>
      <div
        ref={whiteBoxRef}
        className={`w-[296px] absolute bg-gray-200 rounded-xl flex flex-col items-center z-10 
          ${position === "top" ? "bottom-[calc(100%+10px)]" : "top-[84px]"}`}
        style={{
          left: "0",
          width: "80%", // Set percentage width for responsiveness
          maxWidth: "296px", // Maximum width for larger screens
        }}
      >
        {/* Scrollable container */}
        <div className="max-h-[500px] overflow-y-auto w-full">
          <div className="w-full flex justify-between items-center p-2">
            <div className="flex items-center">
              <div className="w-7 h-7 p-0.5 bg-white rounded-[31px] border border-black justify-center items-center inline-flex">
                <img
                  className="grow shrink basis-0 self-stretch rounded-[28.50px] "
                  src={profileImage}
                  alt="Avatar"
                />
              </div>
              <div className="ml-2 text-[#282828] text-sm font-bold font-['Nunito']">
                {userName || "User"}
              </div>
            </div>
            <div
              className="w-8 h-8 p-[10.29px] bg-[#adadad]/20 rounded-[6.86px] border-white justify-center items-center inline-flex cursor-pointer"
              onClick={onClose}
              onTouchStart={onClose}
            >
              <img src={X} alt="X" className="w-[23.72px] h-[23.72px]" />
            </div>
          </div>

          {/* Input box */}
          <div className="w-[276.58px]  mx-auto">
            <div
              ref={inputRef}
              contentEditable
              className="w-full pl-[22.86px] pr-[22.86px] py-[11px] bg-[#f4f4f4] rounded text-black border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
              onInput={handleTextChange}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                minHeight: "2.5em",
                maxHeight: "3.5em",
                cursor: "text",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
              data-placeholder="Write a Reaction"
            ></div>
          </div>

          {/* Selected Image or GIF Display */}

          {(selectedImage || selectedGif) && (
            <div className="m-1 w-auto h-auto flex items-center justify-center relative">
              <img
                src={selectedImage || selectedGif}
                alt="Selected Media"
                className="w-24 h-24 object-contain"
              />
              <button
                onClick={removeSelectedMedia}
                onTouchStart={removeSelectedMedia}
                className="absolute top-0 right-0  text-black rounded-full w-10 h-10 flex items-center justify-center"
              >
                <img src={X} alt="Remove" className="w-20 h-20" />
              </button>
            </div>
          )}
          {/* "Drop a reaction" text */}
          <div className="p-1 text-[#8a8a8a] text-xs font-semibold font-['Nunito'] ml-1">
            Add image, video, GIF to reaction
          </div>

          {/* Action buttons */}
          <div className="w-full flex justify-between items-center p-1">
            <div className="flex items-center gap-6">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer"
                onTouchStart={() =>
                  document.getElementById("imageUpload").click()
                }
              >
                <img src={ImageSquare} alt="ImageSquare" className="w-8 h-8" />
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                onTouchEnd={handleImageUpload}
                style={{ display: "none" }}
              />
              <div
                className="w-8 h-8 justify-center items-center flex cursor-pointer"
                onClick={() => setShowGifPicker((prev) => !prev)}
                onTouchStart={() => setShowGifPicker((prev) => !prev)}
              >
                <img src={gif} alt="gif" className="w-full h-full" />
              </div>
            </div>
            <div
              className="w-[28.57px] h-[28.57px] items-center flex cursor-pointer"
              onClick={handleAddText}
              onTouchStart={handleAddText}
            >
              <img
                src={Line68}
                alt="PaperPlaneRight"
                className="w-full h-full"
              />
              <img
                src={PaperPlaneRight}
                alt="PaperPlaneRight"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Gift icon */}

          <div className="justify-end w-auto  float-end pr-20 p-2">
            <div className="w-[32.28px] h-[32.28px] cursor-pointer flex gap-2  ">
              <span className="text-gray-400 text-nowrap">Send gift </span>
              <img
                src={Gift_pop}
                alt="gift"
                className="w-[24.21px] h-[22.73px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && !isDragging && (
        <div className="absolute z-30 bg-white p-2 rounded shadow-lg">
          <button
            className="absolute w-full text-black text-end pr-8 pb-2 text-sm z-10 cursor-pointer"
            onClick={() => setShowEmojiPicker(false)}
            onTouchStart={() => setShowEmojiPicker(false)}
          >
            X
          </button>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {/* GIF Picker */}
      {showGifPicker && (
        <div className="absolute z-30 left-1 w-64 h-64 overflow-auto bg-white border border-gray-300 rounded relative">
          <button
            className="absolute w-full text-black text-end pr-8 pb-2 text-sm z-10 cursor-pointer"
            onClick={() => setShowGifPicker(false)}
            onTouchStart={() => setShowGifPicker(false)}
          >
            X
          </button>
          <div className="grid grid-cols-3 gap-2 p-2 mt-7">
            {gifs && gifs.length > 0 ? (
              gifs.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.media[0].tinygif.url}
                  alt="GIF"
                  className="w-full h-auto cursor-pointer"
                  onTouchStart={() => handleGifClick(gif)}
                  onClick={() => handleGifClick(gif)}
                />
              ))
            ) : (
              <p>Loading GIFs...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LongPressPopUp;
