import React, { useState, useEffect, useRef } from "react";
import CheckSquare from "../../../../assets/CheckSquare.svg";
import Subtract from "../../../../assets/Subtract.svg";
import plus from "../../../../assets/tappable_plus.svg";
import ArrowCircleDownRight from "../../../../assets/ArrowCircleDownRight.svg";
import DeletePopup from "./DeletePopup"; // Import DeletePopup
import { baseURL } from "../../../../Constants/urls";
import { useToastManager } from "../../../Context/ToastContext";

const TappableArea = ({
  id,
  onRemove,
  onFixContent,
  content,
  position,
  setPosition,
  imageBounds,
  initialSize = { width: 100, height: 100 },
  onCheckSquareClick,
  setSize,
  isFixed,
  setIsFixed,
  setActiveTappableId,
  activeTappableId,
  onLayerActivate,
}) => {
  const toast = useToastManager();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSizeState] = useState(initialSize);
  const tappableRef = useRef(null);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const boardImageId = sessionStorage.getItem("boardImageId");
  useEffect(() => {
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      if (!isFixed) {
        setActiveTappableId(id);
      }
      if (isDragging) {
        let newX = clientX - dragOffset.x;
        let newY = clientY - dragOffset.y;

        newX = Math.max(
          imageBounds.left,
          Math.min(
            newX,
            imageBounds.left +
              imageBounds.width -
              tappableRef.current.offsetWidth
          )
        );
        newY = Math.max(
          imageBounds.top,
          Math.min(
            newY,
            imageBounds.top +
              imageBounds.height -
              tappableRef.current.offsetHeight
          )
        );

        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const newWidth = Math.max(
          50,
          clientX - tappableRef.current.getBoundingClientRect().left
        );
        const newHeight = Math.max(
          50,
          clientY - tappableRef.current.getBoundingClientRect().top
        );

        const maxWidth = imageBounds.width - (position.x - imageBounds.left);
        const maxHeight = imageBounds.height - (position.y - imageBounds.top);
        setSizeState({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight),
        });
        setSize({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight),
        });
      }
    };

    const handleUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, isResizing, dragOffset, imageBounds, setPosition, setSize]);

  useEffect(() => {
    if (activeTappableId === id) {
      // Logic to make this tappable area active and editable
      setIsFixed(false);
    }
  }, [activeTappableId]);

  const handleTappableClick = (e) => {
    if (activeTappableId && activeTappableId !== id) return;
    if (!isFixed) {
      setActiveTappableId(id);
    }
    if (onLayerActivate) {
      onLayerActivate(id);
    }
    e.stopPropagation();
  };

  const handleMouseDown = (e) => {
    if (activeTappableId && activeTappableId !== id) return;
    if (isFixed) {
      setIsFixed(false);
      setActiveTappableId(id);
    } else {
      setActiveTappableId(id);
      const rect = tappableRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleResizeMouseDown = (e) => {
    if (!isFixed) {
      e.stopPropagation();
      setIsResizing(true);
    }
  };

  const handleSubtractClick = (e) => {
    e.stopPropagation();
    setIsDeletePopupVisible(true);
  };

  const confirmDeleteTappable = () => {
    if (typeof onRemove === "function") {
      onRemove();
      setActiveTappableId(null);
    }
    setIsDeletePopupVisible(false);
  };

  const cancelDeleteTappable = () => {
    setIsDeletePopupVisible(false);
  };

  const handleCheckSquareClick = async (e) => {
    e.stopPropagation();
    console.log("Check square clicked, setting isFixed to true");
    setIsFixed(true);
    setActiveTappableId(null);

    try {
      console.log("Retrieving token from local storage");
      const storedToken = localStorage.getItem("token");

      console.log("Preparing payload for tappable creation");
      const payload = {
        addContentImagesLinks: [],

        imageId: boardImageId,
        top: position.y.toString(),
        left: position.x.toString(),
      };
      const tappableData = {
        tappableId: id,
        left: position.x.toString(),
        top: position.y.toString(),
        imageId: boardImageId,
      };
      sessionStorage.setItem("tappableData", JSON.stringify(tappableData));

      const response = await fetch(`${baseURL}/board/createTappable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Tappable created successfully:", result);
      } else {
        console.error(
          "Failed to create tappable:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error creating tappable:", error);
    }

    if (typeof onCheckSquareClick === "function") {
      console.log("Calling onCheckSquareClick with parameters:", {
        id,
        content,
        position,
        size,
      });
      onCheckSquareClick(id, content, position, size);
      sessionStorage.setItem(
        "tappableData",
        JSON.stringify({
          imageId: boardImageId,
          tappableId: id,
          top: position.y.toString(),
          left: position.x.toString(),
        })
      );
    }
  };

  const handleBlueDotClick = (e) => {
    e.stopPropagation();
    if (activeTappableId && activeTappableId !== id) {
      return;
    }
    setIsFixed(false);
    setActiveTappableId(id);
  };

  const isActive = id === activeTappableId;
  return (
    <>
      <div
        ref={tappableRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          transform: `translate(-50%, -50%)`,
          height: `${size.height}px`,
          cursor: isFixed
            ? "pointer"
            : isDragging || isResizing
            ? "grabbing"
            : "grab",
          pointerEvents:
            isActive || !activeTappableId || isFixed ? "auto" : "none",

          opacity: isActive || !activeTappableId ? 1 : 0.5,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={handleTappableClick}
      >
        <div
          className={`relative rounded-[28px] ${
            isFixed ? "" : "border-4 border-[#0085FF]"
          } flex items-center justify-center`}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {content &&
            (typeof content === "string" && content.startsWith("data:image") ? (
              <img
                src={content}
                alt="Uploaded"
                className="max-w-full max-h-full object-contain"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <span
                className="text-9xl"
                style={{
                  fontSize: `${Math.min(
                    size.width / 1.2,
                    size.height / 1.2
                  )}px`,
                }}
              >
                {content}
              </span>
            ))}
          {!isFixed && (
            <div
              className="absolute bottom-0 right-0 bg-[#7e7e7e]/40 p-1 cursor-se-resize select-none rounded-br-[28px] rounded-tl-[28px]"
              onMouseDown={handleResizeMouseDown}
              onTouchStart={handleResizeMouseDown} // Add touch support
            >
              <img src={ArrowCircleDownRight} alt="↘" />
            </div>
          )}
          {isFixed && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
              onClick={handleBlueDotClick}
            />
          )}
        </div>
        {!isFixed && (
          <div
            className="absolute bg-[#0085FF] rounded-[13.68px] flex items-center justify-center"
            style={{
              width: "auto",
              height: "40px",
              left: "50%",
              transform: `translateX(-50%)`,
            }}
          >
            <div className="flex justify-center items-center w-full h-full">
              <div
                className="flex justify-center items-center"
                onClick={handleCheckSquareClick}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "50px",
                  }}
                >
                  <img
                    src={CheckSquare}
                    alt="CheckSquare"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
              <div
                style={{
                  width: "1.3px",
                  height: "100%",
                  backgroundColor: "white",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              ></div>
              <div
                className="flex justify-center items-center"
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    width: "25px",
                    height: "30px",
                  }}
                >
                  <img
                    src={plus}
                    alt="Plus"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
              <div
                style={{
                  width: "1.3px",
                  height: "100%",
                  backgroundColor: "white",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              ></div>
              <div
                className="flex justify-center items-center"
                onClick={handleSubtractClick}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    width: "25px",
                    height: "30px",
                  }}
                >
                  <img
                    src={Subtract}
                    alt="Subtract"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isDeletePopupVisible && (
        <DeletePopup
          onConfirm={confirmDeleteTappable}
          onCancel={cancelDeleteTappable}
        />
      )}
    </>
  );
};

export default TappableArea;
