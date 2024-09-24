import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Group,
  Text,
} from "react-konva";

import useImage from "use-image";
import VerticalActionBar from "../Board/ActionBar/VerticalActionBar";
import tappablegif from "../../assets/tappablegif.gif";
import { useNavigate } from "react-router";
import LongPressPopUp from "./LongPressPopUp";
import { useToastManager } from "../Context/ToastContext";
import ViewReaction from "./ViewReaction";
import Avatar_pizzaboy from "../../assets/Avatar_pizzaboy.png";
import XIcon from "../../assets/X.svg";
import { baseURL } from "../../Constants/urls";
import TappableArea from "../../Profile Settings/TappableArea";
import InfoOverlayInHomepg from "./InfoOverlayInHomepg";
import Draggable from "react-draggable";

const FullImageWithTappables = ({
  imageUrl,
  imageId,
  boardId,
  onClose,
  closeFullImage,
  tappableAreas,
  reactionId,
  setReactionId,
  singleTappableId,
  singleReactionId,
  privateBoardImageId,
  publicBoardImageId,
  privateBoardId,
  publicBoardId,
}) => {
  const inputRef = useRef(null);
  const stageRef = useRef(null);
  const popupRef = useRef(null);
  const isTouchDevice = () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth * 0.7,
    height: window.innerHeight,
  });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loadedImage, status] = useImage(imageUrl, "anonymous");
  const isPrivateBoardImageIdValid =
    privateBoardImageId != null && privateBoardImageId !== undefined;
  const isPublicBoardImageIdValid =
    publicBoardImageId != null && publicBoardImageId !== undefined;
  const isPrivateBoardIdValid =
    privateBoardId != null && privateBoardId !== undefined;
  const isPublicBoardIdValid =
    publicBoardId != null && publicBoardId !== undefined;
  const [tappableId, setTappableId] = useState(null);
  const [adjustedTappableAreas, setAdjustedTappableAreas] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapsOn, setIsTapsOn] = useState(true);
  const [isDropsOn, setIsDropsOn] = useState(true);
  const [fixedReactions, setFixedReactions] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const longPressTimeout = useRef(null);
  const canvasRef = useRef(null);
  const toast = useToastManager();
  const navigate = useNavigate();
  const [longPressPosition, setLongPressPosition] = useState({ x: 0, y: 0 });
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [fixedTexts, setFixedTexts] = useState([]);
  const [adjustedReactions, setAdjustedReactions] = useState([]);
  const [newReactions, setNewReactions] = useState([]);
  const [reactionData, setReactionData] = useState();
  const [reactionDetails, setReactionDetails] = useState([]);
  const profileImage = localStorage.getItem("profileIcon");
  const initialIconUrl = localStorage.getItem("initialIconUrl");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [reactionEmojis, setReactionEmojis] = useState();
  const [profileIcon, setProfileIcon] = useState({});
  const [selectedTappableId, setSelectedTappableId] = useState(null); // State to manage the selected tappable
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedTappableContent, setSelectedTappableContent] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [avatarImage, avatarStatus] = useImage(Avatar_pizzaboy, "anonymous");
  const [avatarImg, avatarPosition] = useState({ x: 0, y: 0 });
  const [text, setText] = useState("");
  const [yellowBoxRect, setYellowBoxRect] = useState(null);
  const [currentImageDimention, setCurrentImageDimentions] = useState(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [reactionPopupPosition, setReactionPopupPosition] = useState({
    x: 0,
    y: 0,
  });
  const [initialImageDimensions, setInitialImageDimensions] = useState({
    width: 0,
    height: 0,
    scale: 1,
  });
  // user role
  const [userRole, setUserRole] = useState("");
  const [contentImages, setContentImages] = useState([]);
  const [loadedContentImages, setLoadedContentImages] = useState([]);

  // State to handle the position of the popup for touch dragging
  const [touchStartPosition, setTouchStartPosition] = useState({ x: 0, y: 0 });
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  useEffect(() => {
    if (boardId && imageId) {
      fetchAreas(boardId, imageId);
    }
  }, [boardId, imageId]);

  useEffect(() => {
    if (!isPopupVisible) {
      setIsPopupVisible(false);
      // Use a debounce function if needed to minimize rapid state updates
      const debouncePopupHide = setTimeout(() => setIsPopupVisible(false), 100);
      return () => clearTimeout(debouncePopupHide);
    }

    if (isPopupVisible) {
      // Add click event listener when the popup is visible
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    } else {
      // Remove event listener when the popup is not visible
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }

    // Cleanup the listener when component unmounts or when the visibility changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isPopupVisible]);

  useEffect(() => {
    if (tappableAreas && isVisible) {
      const adjustedCoordinates = tappableAreas.map((area) => {
        return {
          ...area,
          left: parseFloat(area.left) || 0,
          top: parseFloat(area.top) || 0,
          width: area.width || 50,
          height: area.height || 50,
        };
      });

      setAdjustedTappableAreas(adjustedCoordinates);
    }
  }, [tappableAreas, isVisible]);

  useEffect(() => {
    if (reactionId && Array.isArray(reactionId)) {
      setReactionId(reactionId);
    }
  }, []);

  useEffect(() => {
    if (reactionId && reactionId?.length > 0) {
      // console.log("Original area data:", reactionId);
      const adjustedReactionCoordinates = reactionId?.map((reaction) => ({
        ...reaction,
        left: parseFloat(reaction?.left),
        top: parseFloat(reaction?.top),
      }));
      setAdjustedReactions(adjustedReactionCoordinates);
    }
  }, []);

  "Component props:",
    {
      publicBoardId,
      publicBoardImageId,
      privateBoardId,
      privateBoardImageId,
    };
  "Base URL:", baseURL;

  useEffect(() => {
    console.log("Image load status:", status);

    if (
      status === "loaded" &&
      loadedImage &&
      loadedImage.width &&
      loadedImage.height
    ) {
      console.log(
        "Loaded image dimensions:",
        loadedImage.width,
        loadedImage.height
      );
      const imageAspectRatio = loadedImage.width / loadedImage.height;
      const stageAspectRatio = stageSize.width / stageSize.height;

      let newWidth, newHeight, newX, newY;

      if (imageAspectRatio > stageAspectRatio) {
        newWidth = stageSize.width;
        newHeight = stageSize.width / imageAspectRatio;
      } else {
        newHeight = stageSize.height;
        newWidth = stageSize.height * imageAspectRatio;
      }

      // Check if loadedImage height is greater than width

      newX = (stageSize.width - newWidth) / 2;
      newY = (stageSize.height - newHeight) / 2;

      setScale(newWidth / loadedImage.width);
      setPosition({ x: newX, y: newY });

      // Set initial dimensions and scale for future reference
      setInitialImageDimensions({
        width: newWidth,
        height: newHeight,
        scale: newWidth / loadedImage.width,
      });
    } else {
      console.warn("Loaded image is not defined or missing width/height");
    }
  }, [loadedImage, stageSize, status, imageUrl]);

  useEffect(() => {
    if (tappableAreas && tappableAreas.length > 0) {
      const images = tappableAreas.flatMap((area) =>
        area.ContentImagesLinks
          ? area.ContentImagesLinks.map((link) => ({
              ...area,
              imageUrl: link,
            }))
          : []
      );
      setContentImages(images);
    }
  }, [tappableAreas]);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(
        contentImages.map((image) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ ...image, loadedImage: img });
            img.onerror = reject;
            img.src = image.imageUrl;
            img.crossOrigin = "anonymous";
          });
        })
      );
      setLoadedContentImages(loadedImages);
    };

    loadImages();
  }, [contentImages]);

  const renderContentImages = useCallback(() => {
    return loadedContentImages.map((image, index) => {
      if (!image.loadedImage) return null;

      // Parse the position and dimensions
      const dotX = parseFloat(image.left);
      const dotY = parseFloat(image.top);
      const width = parseFloat(image.width);
      const height = parseFloat(image.height);

      // Calculate the position for the image to be centered on the dot
      const x = dotX - width / 2;
      const y = dotY - height / 2;

      return (
        <KonvaImage
          key={`content-image-${index}`}
          image={image.loadedImage}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      );
    });
  }, [loadedContentImages, scale]);

  const fetchReactionInfo = async (reactionId) => {
    let testingURL;
    const token = localStorage.getItem("token");
    if (!token) {
      testingURL = `${baseURL}/board/fetchReactionInfo?reactionId=${reactionId.singleReactionId}`;
    } else {
      testingURL = `${baseURL}/board/fetchLoggedUserReactionInfo?reactionId=${reactionId.singleReactionId}`;
    }

    try {
      const response = await fetch(testingURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setReactionData(data);
    } catch (error) {
      console.error("Error fetching reaction info:", error);
      toast(`Error fetching reaction info: ${error.message}`);
      return null;
    }
  };

  const handleReactionClick = useCallback(
    (reaction, event) => {
      if (!event || !event.target) {
        console.error("Event or target is undefined:", event);
        return;
      }

      setSelectedReaction(reaction);

      // Get the stage's position and scale from the current state
      const stage = stageRef.current.getStage();
      const scale = stage.scaleX(); // Assuming uniform scaling on X and Y axes
      const stagePosition = stage.position(); // Get the stage's current position (after panning/zooming)

      // Calculate the reaction's position in screen coordinates
      const popupX = reaction.left * scale + stagePosition.x;
      const popupY = reaction.top * scale + stagePosition.y;

      // Set the popup position state to render it in the correct location
      setReactionPopupPosition({ x: popupX, y: popupY });

      // Fetch reaction information (API call)
      fetchReactionInfo({ singleReactionId: reaction.reactionId });
    },
    [fetchReactionInfo, scale, stageRef]
  );

  const ReactionImage = React.memo(({ reaction, scale }) => {
    const [profileImage] = useImage(
      reaction.profileIcon || reaction.initialProfileIcon,
      "anonymous"
    );

    const imageSize = 40 / scale;
    const emojiSize = 20 / scale;

    const handleReactionClick = useCallback(
      (event) => {
        setSelectedReaction(reaction);
        const stage = stageRef.current.getStage();
        const scale = stage.scaleX();
        const stagePosition = stage.position();

        const popupX = reaction.left * scale + stagePosition.x;
        const popupY = reaction.top * scale + stagePosition.y + 30;

        setReactionPopupPosition({ x: popupX, y: popupY });
        fetchReactionInfo({ singleReactionId: reaction.reactionId });
      },
      [reaction, fetchReactionInfo, scale, stageRef]
    );

    return (
      <Group
        x={parseFloat(reaction.left)}
        y={parseFloat(reaction.top)}
        onClick={handleReactionClick}
        onTap={handleReactionClick}
      >
        {/* White circle background */}
        <Circle radius={imageSize / 2} fill="white" strokeWidth={1 / scale} />

        {/* Profile Image */}
        {profileImage && (
          <KonvaImage
            image={profileImage}
            width={imageSize}
            height={imageSize}
            offsetX={imageSize / 2}
            offsetY={imageSize / 2}
            cornerRadius={imageSize / 2}
          />
        )}

        {/* Emoji */}
        {reaction.emoji && (
          <Group x={imageSize / 2 - emojiSize / 2} y={-emojiSize / 2}>
            <Text
              text={reaction.emoji}
              fontSize={emojiSize * 0.9}
              fontFamily="Arial"
              align="center"
              verticalAlign="middle"
              offsetX={emojiSize / 2}
              offsetY={emojiSize / 2}
            />
          </Group>
        )}
      </Group>
    );
  });

  const renderReactions = useCallback(() => {
    if (
      !isDropsOn ||
      !loadedImage ||
      !loadedImage.width ||
      !loadedImage.height
    ) {
      console.log("Reactions not rendered due to missing dependencies.");
      return null;
    }

    return reactionId?.reactions?.map((reaction, idx) => (
      <ReactionImage
        key={`reaction-${idx}`}
        reaction={reaction}
        scale={scale}
      />
    ));
  }, [isDropsOn, loadedImage, reactionId, scale]);

  const handleResize = () => {
    if (isTouchDevice()) {
      // Full width for touch devices
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    } else {
      // Keep the size for desktop unchanged
      setStageSize({
        width: window.innerWidth * 0.7,
        height: window.innerHeight,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWheel = (e) => {
    // Prevent default behavior
    e.evt.preventDefault();

    const scaleBy = 1.006;
    const stage = stageRef.current.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Restrict the scale between 0 and 1
    if (newScale > 1) newScale = 1;
    if (newScale < 0) newScale = 0;

    setScale(newScale);

    setPosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const handleTappableClick = async (tappableId, taps) => {
    // navigate(`/infoOverlay?imageId=${imageId}&tappableId=${tappableId}`);
    // Ensure tappableId is valid before proceeding
    if (!tappableId) {
      console.error("Invalid tappableId: ", tappableId);
      toast("Error: Tappable area is missing an ID.");
      return;
    }

    // Validate that tappableId is in UUID format
    const isValidUUID = (id) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      );

    if (!isValidUUID(tappableId)) {
      console.error("Invalid tappableId format: ", tappableId);
      toast("Error: Invalid tappableId format.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/board/fetchTappableContain?imageId=${imageId}&tappableId=${tappableId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedTappableContent(data.data); // Store fetched tappable data
        setShowOverlay(true); // Show the popup
      } else {
        console.error("Failed to fetch tappable content:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching tappable content:", error);
    }
  };

  useEffect(() => {
    const fetchTappableAreas = async () => {
      try {
        const response = await fetch("your-api-endpoint");
        const data = await response.json();

        setApiTappableAreas(data);
      } catch (error) {
        toast("Error fetching tappable areas:", error);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsVisible(true);
    }
  }, [imageUrl, isVisible]);

  const fetchTappableAreas = async () => {
    const storedToken = localStorage.getItem("token");
    "Stored token:", storedToken ? "exists" : "not found";

    if (publicBoardId && publicBoardImageId) {
      ("Fetching public areas");
      await fetchAreas("public", publicBoardId, publicBoardImageId);
    } else {
    }

    if (privateBoardId && privateBoardImageId) {
      ("Fetching private areas");
      await fetchAreas(
        "private",
        privateBoardId,
        privateBoardImageId,
        storedToken
      );
    } else {
    }
  };

  const handleImageTransition = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  useEffect(() => {
    handleImageTransition();
  }, [imageUrl, handleImageTransition]);

  useEffect(() => {
    console.log("Tappable Areas: ", tappableAreas);
  }, [tappableAreas]);

  const handleLongPressEnd = (event) => {
    // event.preventDefault();
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleLongPressPopUpClose = () => {
    setIsLongPressed(false);
  };

  // const handlePopupDragStart = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   setIsDragging(true);
  //   setIsDraggingImage(true);
  //   // const rect = event.currentTarget.getBoundingClientRect();
  //   setDragOffset({
  //     x: event.clientX - popupPosition.x,
  //     y: event.clientY - popupPosition.y,
  //   });
  // };

  const handlePopupDragStart = (e) => {
    const event = e.evt; // Access the original event from Konva
    if (!event) return; // Check if the event exists
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    setIsDraggingImage(true);
    setDragOffset({
      x: event.clientX - popupPosition.x,
      y: event.clientY - popupPosition.y,
    });
  };

  const handlePopupDragEnd = (e) => {
    const event = e.evt; // Access the original event from Konva
    if (!event) return; // Check if the event exists
    event.stopPropagation();
    setIsDragging(false);
    setIsDraggingImage(false);
  };

  // Handle dragging
  const handlePopupDrag = (event) => {
    if (!isDragging) return; // Only allow dragging if dragging has started

    // Calculate the new popup position based on mouse movement
    const newX = event.clientX - dragOffset.x;
    const newY = event.clientY - dragOffset.y;

    // Ensure the popup stays within the window bounds
    const maxX = window.innerWidth - 296; // Width of the popup
    const maxY = window.innerHeight - 302; // Height of the popup

    // Set the new position, ensuring it doesn't go off-screen
    setPopupPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // const handlePopupDragEnd = (event) => {
  //   event.stopPropagation(); // Prevent event from bubbling up
  //   setIsDragging(false); // Stop dragging
  //   setIsDraggingImage(false);
  // };

  // Touch event handlers for drag functionality on touch devices
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
    setIsTouchDragging(true);
  };

  // const handleTouchMove = (e) => {
  //   if (isTouchDragging) {
  //     const touch = e.touches[0];
  //     setPopupPosition((prevPosition) => ({
  //       x: prevPosition.x + (touch.clientX - touchStartPosition.x),
  //       y: prevPosition.y + (touch.clientY - touchStartPosition.y),
  //     }));
  //     setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
  //   }
  // };

  const handleTouchMove = (e) => {
    if (isTouchDragging) {
      const touch = e.touches[0];
      const newX = popupPosition.x + (touch.clientX - touchStartPosition.x);
      const newY = popupPosition.y + (touch.clientY - touchStartPosition.y);

      // Constrain movement within screen boundaries
      const constrainedX = Math.max(
        0,
        Math.min(newX, window.innerWidth - popupRef.current.offsetWidth)
      );
      const constrainedY = Math.max(
        0,
        Math.min(newY, window.innerHeight - popupRef.current.offsetHeight)
      );

      setPopupPosition({ x: constrainedX, y: constrainedY });
      setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
    }
  };
  const handleTouchEnd = () => {
    setIsTouchDragging(false);
  };

  // Effect to add touch event listeners specifically for dragging the popup
  useEffect(() => {
    const popup = popupRef.current;

    if (popup) {
      popup.addEventListener("touchstart", handleTouchStart);
      popup.addEventListener("touchmove", handleTouchMove);
      popup.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (popup) {
        popup.removeEventListener("touchstart", handleTouchStart);
        popup.removeEventListener("touchmove", handleTouchMove);
        popup.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isPopupVisible, isTouchDragging, touchStartPosition]);

  // Function to handle click outside the popup
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      // Click was outside the popup, hide it
      setIsPopupVisible(false);
    }
  };

  const base64ToBlob = (base64Data, contentType = "image/png") => {
    console.log("Converting base64 to Blob...", base64Data);

    // Ensure base64Data includes the prefix
    if (!base64Data.startsWith("data:")) {
      console.error(
        "Invalid Base64 string. Ensure it starts with the correct data URL prefix."
      );
      return null;
    }

    // Extract only the Base64 portion of the string (after the comma)
    const base64String = base64Data.split(",")[1];

    // Check if the base64 string exists
    if (!base64String) {
      console.error(
        "Invalid Base64 string. Ensure it starts with the correct data URL prefix."
      );
      return null;
    }

    // Decode the Base64 string into binary data
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    console.log("Conversion to Blob completed.");
    return new Blob(byteArrays, { type: contentType });
  };

  const uploadImage = async (base64Image) => {
    console.log("Starting image upload...");
    const blob = base64ToBlob(base64Image);

    const formData = new FormData();
    formData.append("file", blob, "reaction-image.png");

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No authorization token found. Please log in.");
      toast("Please log in to upload the image.");
      return null;
    }

    try {
      const response = await fetch(`${baseURL}/file-upload/uploadFile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload image:", response.statusText);
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast(`Error uploading image: ${error.message}`);
      return null;
    }
  };

  //For fetchting tappbles and reaction
  const fetchAreas = async (boardId, imageId) => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    let url;
    if (userRole === "publicUser") {
      url = `${baseURL}/board/fetchPublicUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else if (userRole === "privateUser") {
      url = `${baseURL}/board/fetchPrivateUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else if (userRole === "user") {
      url = `${baseURL}/board/fetchPublicUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else {
      console.error("Invalid user role");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token && userRole === "privateUser") {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const errorData = await response.json();
        console.error("Error details:", errorData);
        return;
      }
      // console.log("REsponse for non pagination  2002 : ", response);

      const data = await response.json();

      const reaction = data?.data;
      console.log("New Reactions 679 : ", reaction);
      setReactionId(reaction);

      if (data?.data?.reaction?.length > 0) {
        const adjustedReactions = data?.data?.reaction?.map((reaction) => ({
          id: reaction.reactionId,
          left: parseFloat(reaction.left),
          top: parseFloat(reaction.top),
          type: reaction.type,
        }));
      }
    } catch (error) {
      console.error("Error fetching tappable areas:", error);
    }
  };

  const fetchAllReactionInfo = async (reactionId) => {
    if (!Array?.isArray(reactionId)) {
      // console.log("reactionId is not an array:", reactionId);
      return;
    }

    const reactionInfoPromises = reactionId?.map((item) =>
      fetchReactionInfo(item?.reactionId)
    );
    const reactionInfoResults = await Promise?.all(reactionInfoPromises);

    // Filter out any null results (failed fetches)
    const validReactionInfo = reactionInfoResults?.filter(
      (info) => info !== null
    );

    // Update state with the fetched information
    setReactionDetails(validReactionInfo);
  };

  const addReactionLike = async (reactionId) => {
    // const testingURL = `${baseURL}/board/addReactionLikes?imageId=${imageId}&reactionId=${reactionId.singleReactionId}`;
    // console.log("testingURL : 472 : ", testingURL);
    try {
      const response = await fetch(
        `${baseURL}/board/addReactionLikes?imageId=${imageId}&reactionId=${reactionId.singleReactionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to add reaction like: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const result = await response.json();
      toast("Reaction like added successfully");
      return result;
    } catch (error) {
      console.error("Error adding reaction like:", error);
      toast(`Error adding reaction like: ${error.message}`);
    }
  };

  const deleteReaction = async (reactionId) => {
    try {
      const response = await fetch(
        `${baseURL}/board/deleteReaction?reactionId=${reactionId.singleReactionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast("Reaction deleted successfully");
      fetchAreas(boardId, imageId);
    } catch (error) {
      console.error("Error deleting reaction:", error);
      toast(`Error deleting reaction: ${error.message}`);
    }
  };
  const handleEmojiSelect = (emoji, reactionId) => {
    setReactionEmojis((prevEmojis) => ({
      ...prevEmojis,
      [reactionId]: emoji,
    }));
    setSelectedEmoji(emoji);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleTaps = () => {
    setIsTapsOn((prevState) => !prevState);
  };

  const toggleDrops = () => {
    setIsDropsOn((prevState) => !prevState);
  };

  const renderFixedTexts = () => {
    return fixedTexts?.map((item, index) => (
      <div
        key={index}
        className="absolute text-black bg-yellow-300 p-2 rounded"
        style={{
          left: `${item.position.x}px`,
          top: `${item.position.y}px`,
        }}
      >
        {item?.text}
        {item?.image && (
          <img
            src={item.image}
            alt="Uploaded"
            className="w-20 h-20 object-cover"
          />
        )}
        {item.gif && (
          <img src={item.gif} alt="GIF" className="w-20 h-20 object-cover" />
        )}
      </div>
    ));
  };

  const handleTextChange = (e) => {
    setText(e.target.innerText);
  };

  const uploadCapturedImage = async (base64Image) => {
    console.log("Starting image upload...");
    const blob = base64ToBlob(base64Image);

    // Check if the blob is correctly created
    if (!blob) {
      console.error(
        "Failed to convert Base64 to Blob. Please check the Base64 string format."
      );
      return null;
    }

    const formData = new FormData();
    formData.append("file", blob, "reaction-image.png");

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No authorization token found. Please log in.");
      toast("Please log in to upload the image.");
      return null;
    }

    try {
      const response = await fetch(`${baseURL}/file-upload/uploadFile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload image:", response.statusText);
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast(`Error uploading image: ${error.message}`);
      return null;
    }
  };

  const captureBackground = useCallback(() => {
    if (!loadedImage || !stageRef.current || !yellowBoxRect) return null;

    const stage = stageRef.current.getStage();
    const scale = stage.scaleX(); // Assuming uniform scaling
    const stagePosition = stage.position(); // Get the stage's current position (after panning/zooming)

    // Get image absolute position
    const imageNode = stage.findOne("Image"); // Find the image node in Konva
    const imagePosition = imageNode.position(); // Get the image position (x, y)

    // Calculate yellow box position relative to the image, adjusting for stage transformations
    const yellowBoxX = currentImageDimention.relativeX - 20;
    const yellowBoxY = currentImageDimention.relativeY - 20;

    const captureWidth = yellowBoxRect.width / scale;
    const captureHeight = yellowBoxRect.height / scale;

    // Create an off-screen canvas for capturing
    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = captureWidth;
    captureCanvas.height = captureHeight;
    const context = captureCanvas.getContext("2d");

    // Draw the captured area onto the off-screen canvas
    context.drawImage(
      loadedImage,
      yellowBoxX, // Adjusted X position relative to the image
      yellowBoxY, // Adjusted Y position relative to the image
      captureWidth,
      captureHeight,
      0,
      0,
      captureWidth,
      captureHeight
    );

    // Convert the canvas to a base64 image
    return captureCanvas.toDataURL("image/png");
  }, [loadedImage, stageRef, yellowBoxRect]);

  const handleLongPress = (event) => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      toast("Please login to add reactions.");
      return;
    }

    if (!event.currentTarget) {
      console.log(event.currentTarget);
      return;
    }

    // Check if the target is an image node
    if (event.target.className !== "Image" || isDraggingImage) {
      console.log("Long press ignored: Not on an image element.");
      return; // Prevent the popup from showing
    }

    const imageNode = event.target;
    const shape = event.target;
    const node = event.target;

    // Check if the target is a valid Konva node with getStage method
    if (!node || typeof node.getStage !== "function") {
      console.error("Event target is not a valid Konva node.");
      return;
    }
    console.log("node", { node });

    const stage = node.getStage();
    const scale = stage.scaleX(); // Assuming uniform scaling on both X and Y axes

    // Get the pointer position relative to the stage
    const pointerPosition = stage.getPointerPosition();

    // Get image's position on the stage
    const imagePosition = imageNode.getClientRect();

    // Calculate click position relative to the image's top-left corner
    const relativeX = (pointerPosition.x - imagePosition.x) / scale;
    const relativeY = (pointerPosition.y - imagePosition.y) / scale;

    // Fallback if pointerPosition is not available
    if (!pointerPosition) {
      console.error("Pointer position is undefined.");
      return;
    }
    setCurrentImageDimentions({ relativeX, relativeY });

    const rect = shape.getClientRect();
    let x = event.evt.clientX - rect.x;
    let y = event.evt.clientY - rect.y;

    // const rect = event.currentTarget.getBoundingClientRect();
    // let x = event.clientX - rect.left;
    // let y = event.clientY - rect.top;

    // Calculate the new popup position to make the yellow box surround the cursor or touch point
    const yellowBoxOffsetX = 140.14; // Half of the yellow box width
    const yellowBoxOffsetY = 50; // Offset for yellow box height

    // const adjustedX = Math.max(0, x - yellowBoxOffsetX);
    // const adjustedY = Math.max(0, y - yellowBoxOffsetY);
    const adjustedX = pointerPosition.x - 90 / 1; // Offset to center the cursor inside the yellow box
    const adjustedY = pointerPosition.y - 85 / 2; // Offset to center the cursor inside the yellow box

    // Set the position of the popup below the yellow box
    const popupOffsetY = 10;

    setPopupPosition({
      x: adjustedX,
      y: adjustedY + popupOffsetY,
    });

    longPressTimeout.current = setTimeout(() => {
      setIsPopupVisible(true);
    }, 1000);
  };

  const handleAddReaction = async (reactionData) => {
    console.log("started", reactionData);
    if (!capturedImage) return;
    console.log("started", reactionData);

    const imageUrl = await uploadCapturedImage(capturedImage);
    if (!imageUrl) {
      console.error("Failed to get the image URL");
      return;
    }

    // Upload the base64 image or GIF if available
    let contentUrl = null;

    console.log("reactionData.image", reactionData.image);
    if (reactionData.image) {
      console.log("converting contentUrl");

      contentUrl = await uploadCapturedImage(reactionData.image); // Upload the image base64
    }

    // Check if content URL was successfully obtained
    if (reactionData.image) {
      if (!contentUrl) {
        console.error("Failed to get the content URL");
        return;
      }
    }
    // Get absolute position of the yellow box
    // const absolutePosition = {
    //   x: popupPosition.x + reactionData.yellowBoxPosition.x,
    //   y: popupPosition.y + reactionData.yellowBoxPosition.y,
    // };

    setFixedReactions((prevReactions) => [
      ...prevReactions,
      {
        ...reactionData,
        // position: absolutePosition,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    console.log("reactionData", reactionData);

    const centerX = yellowBoxRect.x + yellowBoxRect.width / 2;
    const centerY = yellowBoxRect.y + yellowBoxRect.height / 2;
    console.log("centerX ", centerX);
    console.log("centery ", centerY);

    // Prepare reaction data payload
    const postData = {
      ...reactionData,
      boardImageId: imageId,
      reactionType: reactionData.image
        ? "photo"
        : reactionData.gif
        ? "video"
        : "emoji",
      emoji: reactionData.emoji,
      contentUrl: reactionData.image
        ? await uploadImage(reactionData.image)
        : reactionData.gif,
      contentText: reactionData.text,
      top: currentImageDimention.relativeY.toString(),
      left: currentImageDimention.relativeX.toString(),
      backgroundCapture: imageUrl,
      width: "75",
      heigh: "75",
    };

    console.log("currentImageDimention : ", currentImageDimention);

    try {
      const response = await fetch(`${baseURL}/board/addReaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add reaction: ${response.statusText}`);
      }

      setIsPopupVisible(false);
      fetchAreas(boardId, imageId);
      toast("Reaction added successfully.");
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleDeleteBoard = async () => {
    const token = localStorage.getItem("token");
    const url = `/board/deleteBoard?boardId=${boardId}`;

    const apiUrl = `${baseURL}` + `${url}`;
    console.log("apiUrl", apiUrl);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };
    await fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        closeFullImage();
        window.location.reload();

        console.log(" collection board data Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("board id", boardId);
  };

  return (
    <div
      className="relative h-screen bg-black konva-canvas"
      style={{ width: "100%", position: "absolute", right: 0 }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable={!isPopupVisible}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseUp={handleLongPressEnd}
        onMouseMove={handlePopupDrag}
        onMouseLeave={handleLongPressEnd}
        onMouseDown={(e) => {
          if (!isPopupVisible) {
            handleLongPress(e);
          }
        }}
        onTap={handleLongPress}
      >
        <Layer>
          {status === "loaded" && loadedImage && (
            <KonvaImage
              image={loadedImage}
              id="KonvaImage"
              width={loadedImage.width}
              height={loadedImage.height}
              x={0}
              y={0}
              onMouseUp={handleLongPressEnd}
              onTouchEnd={handleLongPressEnd}
              draggable
              onDragStart={handlePopupDragStart}
              onDragEnd={handlePopupDragEnd}
            />
          )}
          {renderContentImages()}
          {isTapsOn &&
            tappableAreas.map((area) => {
              // Convert `left` and `top` from string to number

              // console.log("Areas for tappabelss", area);

              const leftPosition = parseFloat(area.left);
              const topPosition = parseFloat(area.top);

              if (loadedImage && loadedImage?.width && loadedImage?.height) {
                // Calculate absolute positions based on the current loaded image dimensions

                const absoluteX = leftPosition;
                const absoluteY = topPosition;
                if (area.isTappable) {
                  return (
                    <Circle
                      key={area.tappableId}
                      x={absoluteX}
                      y={absoluteY}
                      radius={10 / scale}
                      fill="#0085FF"
                      onClick={() => handleTappableClick(area.id)}
                      onTap={() => handleTappableClick(area.id)}
                    />
                  );
                }
              }
              return null;
            })}
          {renderReactions()}
        </Layer>
      </Stage>
      {showOverlay && selectedTappableContent && (
        <div className="fixed inset-0 z-50 flex justify-end items-center">
          <div className="lg:w-[70%] w-full h-full flex justify-center items-center">
            <div className="rounded-lg shadow-md">
              <InfoOverlayInHomepg
                tappableContent={selectedTappableContent}
                onClose={() => setShowOverlay(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isPopupVisible && (
        <Draggable
          nodeRef={popupRef} // Ensure to use the ref correctly with Draggable
          handle=".popup-container" // Target specific handle if needed
          cancel=".non-draggable" // If there are elements inside you don't want draggable
          bounds="parent"
        >
          <div
            ref={popupRef}
            className="popup-container"
            style={{
              position: "absolute",
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
              cursor: isDragging ? "grabbing" : "grab",
              transform: isTouchDragging ? "translate(0, 0)" : "", // Disable CSS transform for touch drag
              maxWidth: "296px",
              maxHeight: "302px",
            }}
            onMouseDown={handlePopupDragStart}
            onMouseMove={handlePopupDrag}
            onMouseUp={handlePopupDragEnd}
            onMouseLeave={handlePopupDragEnd}
            //// Touch Events
            onTouchStart={handlePopupDragStart}
            onTouchMove={handlePopupDrag}
            onTouchEnd={handlePopupDragEnd}
          >
            <LongPressPopUp
              onClose={() => setIsPopupVisible(false)}
              reactionData={reactionData}
              popupPosition={popupPosition}
              onEmojiSelect={handleEmojiSelect}
              onCapture={(rect) => {
                setYellowBoxRect(rect);
                setCapturedImage(captureBackground());
              }}
              onTextEnter={handleAddReaction}
            />
          </div>
        </Draggable>
      )}
      {selectedReaction && (
        <div
          className="absolute p-2 rounded-[15px] md:w-[314px] md:h-[178px] w-full flex flex-col"
          style={{
            left: `${reactionPopupPosition.x}px`,
            top: `${reactionPopupPosition.y}px`,
            zIndex: 11,
          }}
        >
          <ViewReaction
            reactionData={reactionData}
            reaction={selectedReaction}
            onClose={() => setSelectedReaction(null)}
            addReactionLike={() =>
              addReactionLike({ singleReactionId: selectedReaction.reactionId })
            }
            deleteReaction={() =>
              deleteReaction({ singleReactionId: selectedReaction.reactionId })
            }
          />
        </div>
      )}

      <div
        className="fixed top-0 right-0 h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`top-0 right-0 h-full transition-transform duration-300 ${
            isHovered ? "transform translate-x-0" : "transform translate-x-full"
          }`}
        >
          <VerticalActionBar
            isTapsOn={isTapsOn}
            toggleTaps={toggleTaps}
            closeFullImage={closeFullImage}
            isDropsOn={isDropsOn}
            toggleDrops={toggleDrops}
          />
        </div>
      </div>
      {/* Close button */}
      {/* Close button */}
      <div className="w-full flex justify-between items-center">
        <button
          className="absolute z-10 top-2 left-0 p-2 w-10 text-white"
          onClick={closeFullImage}
        >
          X
        </button>
        {(userRole === "publicUser" || userRole === "privateUser") && (
          <button
            className="absolute z-10 top-2 right-12 font-bold p-2 w-16 text-red-700"
            onClick={() => handleDeleteBoard()}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
export default FullImageWithTappables;




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
      className="popup-container relative  z-10"
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
        {/* <div
        ref={whiteBoxRef}
        className={`white-box bg-gray-200 rounded-xl flex flex-col items-center z-10 ${
          position === "top" ? "bottom-[calc(100%+10px)]" : "top-[84px]"
        }`}
        style={{
          left: "0",
          width: "80%", // Set percentage width for responsiveness
          maxWidth: "296px", // Maximum width for larger screens
        }}
      > */}
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
            onTouchStartck={() => setShowEmojiPicker(false)}
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
