import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Group,
  Text,
  Line,
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
import { baseURL, privateUser, publicUser, user } from "../../Constants/urls";
import TappableArea from "../../Profile Settings/TappableArea";
import InfoOverlayInHomepg from "./InfoOverlayInHomepg";
import Draggable from "react-draggable";
import DeletePopup from "../Board/ActionBar/NewTappeable/DeletePopup";
import "./home.css";

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
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
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
    setContentImages([]);
    setLoadedContentImages([]);
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
    } else {
      // Remove event listener when the popup is not visible
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the listener when component unmounts or when the visibility changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

      newX = (stageSize.width - newWidth) / 40;
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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragStart);
      window.addEventListener("mouseup", handleLongPressEnd);
      window.addEventListener("touchmove", handleDragStart);
      window.addEventListener("touchend", handleLongPressEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDragStart);
      window.removeEventListener("mouseup", handleLongPressEnd);
      window.removeEventListener("touchmove", handleDragStart);
      window.removeEventListener("touchend", handleLongPressEnd);
    };
  }, [isDragging]);

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
        <Circle
          radius={imageSize / 2}
          fill="white"
          fill=""
          strokeWidth={2 / scale}
        />

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
          <Group x={imageSize - emojiSize} y={imageSize - emojiSize}>
            <Text
              text={reaction.emoji}
              fontSize={emojiSize * 1.5}
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
        width: window.innerWidth,
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

  // const handleWheel = (e) => {
  //   // Prevent default behavior
  //   e.evt.preventDefault();

  //   const scaleBy = 1.006;
  //   const stage = stageRef.current.getStage();
  //   const oldScale = stage.scaleX();

  //   const mousePointTo = {
  //     x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
  //     y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
  //   };

  //   let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  //   // Restrict the scale between 0 and 1
  //   if (newScale > 1) newScale = 1;
  //   if (newScale < 0) newScale = 0;

  //   setScale(newScale);

  //   setPosition({
  //     x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
  //     y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
  //   });
  // };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current.getStage();
    const oldScale = stage.scaleX();

    // Determine scale factor
    const scaleBy = 1.02;
    const pointer = stage.getPointerPosition();

    // Calculate new scale
    let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Update scale without limiting
    setScale(newScale);

    // Calculate new position to keep the zoom centered
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setPosition(newPos);
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

  const handleLongPressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handlePopupDragStart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    setIsDraggingImage(true);
    // const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - popupPosition.x,
      y: event.clientY - popupPosition.y,
    });
  };

  // Handle dragging
  const handlePopupDrag = (e) => {
    if (!isDragging) return;

    // Determine whether the event is a mouse or touch event
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    // Fallback if coordinates are still undefined
    if (clientX === undefined || clientY === undefined) {
      console.error("Failed to read coordinates from event:", e);
      return;
    }

    // Calculate new popup position
    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;

    setDragPosition({ x: newX, y: newY });
  };

  const handlePopupDragEnd = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    setIsDragging(false); // Stop dragging
    setIsDraggingImage(false);
  };

  // Function to handle click outside the popup
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      // Click was outside the popup, hide it
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the popup
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedReaction(null); // Close the popup
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

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
    if (userRole === publicUser) {
      url = `${baseURL}/board/fetchPublicUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else if (userRole === privateUser) {
      url = `${baseURL}/board/fetchPrivateUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else if (userRole === user) {
      url = `${baseURL}/board/fetchPublicUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else {
      console.error("Invalid user role");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token && userRole === privateUser) {
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

  // const captureBackground = useCallback(() => {
  //   if (!loadedImage || !stageRef.current || !yellowBoxRect) return null;

  //   const stage = stageRef.current.getStage();
  //   const scale = stage.scaleX(); // Assuming uniform scaling
  //   const stagePosition = stage.position(); // Get the stage's current position (after panning/zooming)

  //   // Get image absolute position
  //   const imageNode = stage.findOne("Image"); // Find the image node in Konva
  //   const imagePosition = imageNode.position(); // Get the image position (x, y)

  //   // Calculate yellow box position relative to the image, adjusting for stage transformations
  //   const yellowBoxX = currentImageDimention.relativeX - 20;
  //   const yellowBoxY = currentImageDimention.relativeY - 20;

  //   const captureWidth = yellowBoxRect.width / scale;
  //   const captureHeight = yellowBoxRect.height / scale;

  //   // Create an off-screen canvas for capturing
  //   const captureCanvas = document.createElement("canvas");
  //   captureCanvas.width = captureWidth;
  //   captureCanvas.height = captureHeight;
  //   const context = captureCanvas.getContext("2d");

  //   // Draw the captured area onto the off-screen canvas
  //   context.drawImage(
  //     loadedImage,
  //     yellowBoxX, // Adjusted X position relative to the image
  //     yellowBoxY, // Adjusted Y position relative to the image
  //     captureWidth,
  //     captureHeight,
  //     0,
  //     0,
  //     captureWidth,
  //     captureHeight
  //   );

  //   // Convert the canvas to a base64 image
  //   return captureCanvas.toDataURL("image/png");
  // }, [loadedImage, stageRef, yellowBoxRect]);

  // const captureBackground = useCallback(() => {
  //   if (!stageRef.current || !yellowBoxRect) return null;

  //   const stage = stageRef.current.getStage();
  //   const scale = stage.scaleX(); // Assuming uniform scaling

  //   // Get the absolute position of the yellow box relative to the stage
  //   const yellowBoxX = currentImageDimention.relativeX - 50;
  //   const yellowBoxY = currentImageDimention.relativeY + 30;

  //   const captureWidth = yellowBoxRect.width / scale;
  //   const captureHeight = yellowBoxRect.height / scale;

  //   // Create an off-screen canvas for capturing the defined area
  //   const captureCanvas = document.createElement("canvas");
  //   captureCanvas.width = captureWidth;
  //   captureCanvas.height = captureHeight;
  //   const context = captureCanvas.getContext("2d");

  //   // Render the stage content onto the off-screen canvas
  //   context.drawImage(
  //     stage.toCanvas(), // Convert the entire stage to an image
  //     yellowBoxX * scale, // Scale and adjust the X position
  //     yellowBoxY * scale, // Scale and adjust the Y position
  //     captureWidth * scale, // Scale the width
  //     captureHeight * scale, // Scale the height
  //     0,
  //     0,
  //     captureWidth,
  //     captureHeight
  //   );

  //   // Convert the canvas content to a base64 image
  //   return captureCanvas.toDataURL("image/png");
  // }, [stageRef, yellowBoxRect, currentImageDimention]);

  const captureBackground = useCallback(() => {
    if (!stageRef.current || !yellowBoxRect) return null;

    const stage = stageRef.current.getStage();
    const scale = stage.scaleX(); // Assuming uniform scaling
    const stagePosition = stage.position(); // Get the stage's current position after panning/zooming

    // Calculate the yellow box's absolute position on the stage
    const yellowBoxX =
      currentImageDimention.relativeX * scale + stagePosition.x - 10;
    const yellowBoxY =
      currentImageDimention.relativeY * scale + stagePosition.y - 20;

    const captureWidth = yellowBoxRect.width;
    const captureHeight = yellowBoxRect.height;

    // Create an off-screen canvas for capturing the defined area
    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = captureWidth;
    captureCanvas.height = captureHeight;
    const context = captureCanvas.getContext("2d");

    // Render the stage content onto the off-screen canvas considering scale and stage position
    context.drawImage(
      stage.toCanvas(), // Convert the entire stage to an image
      yellowBoxX, // Adjust the X position
      yellowBoxY, // Adjust the Y position
      captureWidth * scale, // Scale the width
      captureHeight * scale, // Scale the height
      0,
      0,
      captureWidth,
      captureHeight
    );

    // Convert the canvas content to a base64 image
    return captureCanvas.toDataURL("image/png");
  }, [stageRef, yellowBoxRect, currentImageDimention]);

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

    if (isDraggingImage) {
      return;
    }

    const shape = event.target;
    const node = event.target;
    const stage = node.getStage();
    const scale = stage.scaleX();

    // const imageNode = event.target;
    const imageNode = stage.findOne("Image");

    // Check if the target is a valid Konva node with getStage method
    if (!node || typeof node.getStage !== "function") {
      console.error("Event target is not a valid Konva node.");
      return;
    }

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

    const adjustedX = pointerPosition.x - 135 / 1; // Offset to center the cursor inside the yellow box
    const adjustedY = pointerPosition.y - 85 / 2; // Offset to center the cursor inside the yellow box

    // Set the position of the popup below the yellow box
    const popupOffsetY = 10;

    setPopupPosition({
      x: adjustedX,
      y: adjustedY + popupOffsetY,
    });

    // Clear existing timeout if any
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }

    longPressTimeout.current = setTimeout(() => {
      setIsPopupVisible(true);
    }, 1000);
  };

  // Function to handle closing the long press popup
  const handleLongPressPopUpClose = () => {
    setIsLongPressed(false);
    setIsPopupVisible(false);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current); // Clear timeout when popup is closed
    }
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
    const apiUrl = `${baseURL}${url}`;
    console.log("apiUrl", apiUrl);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      closeFullImage();
      window.location.reload();
      console.log("collection board data Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteBoard();
    setShowDeletePopup(false);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
  };

  const handleDragStart = (e) => {
    // if (selectedReaction) {
    //   setSelectedReaction(null); // Close the reaction popup if the image is being dragged
    // }

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    dragStartPos.current = {
      x: clientX - dragPosition.x,
      y: clientY - dragPosition.y,
    };
    setIsDragging(true);
  };

  const handleTouchStart = (event) => {
    handleLongPress(event);
  };

  const handleTouchEnd = (event) => {
    handleLongPressEnd();
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
        onMouseMove={(e) => handlePopupDrag(e)}
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
              onMouseDown={(e) => {
                if (!isPopupVisible) {
                  handleLongPress(e);
                }
              }}
              onMouseUp={handleLongPressEnd}
              onTouchStart={(e) => {
                if (!isPopupVisible) {
                  handleLongPress(e);
                }
              }}
              onTouchEnd={handleLongPressEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
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
          onStart={() => setIsDragging(true)}
          onStop={() => setIsDragging(false)}
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
              // onClose={handleLongPressPopUpClose}
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
          ref={popupRef}
          className="absolute p-2 rounded-[15px] md:w-[314px] md:h-[178px] w-full flex flex-col"
          style={{
            left: `${reactionPopupPosition.x}px`,
            top: `${reactionPopupPosition.y}px`,
            zIndex: 11,
          }}
        >
          <ViewReaction
            selectedEmoji={selectedReaction.emoji}
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
          onTouchStart={closeFullImage}
        >
          X
        </button>
        {(userRole === "publicUser" || userRole === "privateUser") && (
          <button
            className="absolute z-10 top-2 right-12 font-bold p-2 w-16 text-red-700"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}
        {showDeletePopup && (
          <DeletePopup
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
};
export default FullImageWithTappables;
