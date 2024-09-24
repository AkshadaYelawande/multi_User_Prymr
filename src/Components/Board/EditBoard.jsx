import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { Stage, Layer, Image, Rect, Group, Circle, Text } from "react-konva";
import useImage from "use-image";
import CheckSquare from "../../assets/CheckSquare.svg";
import Subtract from "../../assets/Subtract.svg";
import tappable_plus from "../../assets/tappable_plus.svg";
import ArrowCircleDownRight from "../../assets/ArrowCircleDownRight.svg";
import ActionBar from "./ActionBar/ActionBar";
import LayersPanel from "./ActionBar/Layers/Layers";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageContext } from "./ImageContext/ImageContext";
import DeletePopup from "./ActionBar/NewTappeable/DeletePopup";
import { baseURL } from "../../Constants/urls";
import { PropagateLoader } from "react-spinners";
import NewTappable from "./ActionBar/NewTappeable/Newtapable";

const EditBoard = () => {
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);
  const navigate = useNavigate();
  const [checkSquareIcon] = useImage(CheckSquare, "anonymous");
  const [subtractIcon] = useImage(Subtract, "anonymous");
  const [plusIcon] = useImage(tappable_plus, "anonymous");
  const [arrowDownCircleIcon] = useImage(ArrowCircleDownRight, "anonymous");
  const [points, setPoints] = useState([]);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stateDrag, setStateDrag] = useState({
    isDragging: false,
    x: 0,
    y: 0,
  });
  const [resizing, setResizing] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [image, setImageUrl] = useState(null);
  const { layerImageUrl } = useContext(ImageContext);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [layers, setLayers] = useState(
    JSON.parse(localStorage.getItem("layers")) || []
  );
  const [tappableAreas, setTappableAreas] = useState(
    JSON.parse(localStorage.getItem("tappableAreas")) || []
  );
  const [activeTappable, setActiveTappable] = useState(null);
  const [jsonContent, setJsonContent] = useState("");
  const layersPanelRef = useRef(null);
  const location = useLocation();
  const { createBlankCanvas, editedImage, changedBG } = location.state || {};
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageUrl, imageStatus] = useImage(currentImageUrl, "anonymous");
  const [imageBounds, setImageBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const [showTappableArea, setShowTappableArea] = useState(false);
  const [showNewTappable, setShowNewTappable] = useState(false);
  const [lastAddedTappableContent, setLastAddedTappableContent] =
    useState(null);
  const [activeTappableId, setActiveTappableId] = useState(
    localStorage.getItem("activeTappableId") || null
  );
  const boardId = sessionStorage.getItem("boardId");
  const boardImageId = sessionStorage.getItem("boardImageId");
  const [isLayersPanelVisible, setIsLayersPanelVisible] = useState(false);
  const [tappableContent, setTappableContent] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [layerToDelete, setLayerToDelete] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [tappableType, setTappableType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tappablePosition, setTappablePosition] = useState({ x: 0, y: 0 });
  const [newTappableType, setNewTappableType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectionBoxStroke, setSelectionBoxStroke] = useState("dashed");
  const [selectedTappableArea, setSelectedTappableArea] = useState(null);
  const [isNewTappableClicked, setNewTappableClicked] = useState(false);
  const [selectedImageAspectRatio, setSelectedImageAspectRatio] = useState(1);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const ACTION_BAR_HEIGHT = 80;
  const DOT_SIZE = 20;
  const ICON_SIZE = 24;
  const TAPPABLE_BOX_SIZE = 100;

  const captureStage = () => {
    const stage = stageRef.current.getStage();
    const dataURL = stage.toDataURL();
    return dataURL;
  };

  useEffect(() => {
    setLoading(true);
    const fetchLatestImage = () => {
      const latestImage =
        changedBG ||
        editedImage ||
        JSON.parse(sessionStorage.getItem("state"))?.imageUrl;

      setCurrentImageUrl(latestImage);

      const currentState = JSON.parse(sessionStorage.getItem("state")) || {};
      sessionStorage.setItem(
        "state",
        JSON.stringify({ ...currentState, imageUrl: latestImage })
      );
      // setLoading(false);
    };

    fetchLatestImage();
  }, [changedBG, editedImage]);

  useEffect(() => {
    // Load tappable areas and layers from local storage
    const savedTappableAreas =
      JSON.parse(localStorage.getItem("tappableAreas")) || [];
    const savedLayers = JSON.parse(localStorage.getItem("layers")) || [];

    setTappableAreas(savedTappableAreas);
    setLayers(savedLayers);

    // Recreate points from tappable areas
    const savedPoints = savedTappableAreas.map((area) => ({
      x: area.position.x + area.size.width / 2,
      y: area.position.y + area.size.height / 2,
    }));
    setPoints(savedPoints);
  }, []);

  useEffect(() => {
    // Save tappable areas and layers to local storage whenever they change
    localStorage.setItem("tappableAreas", JSON.stringify(tappableAreas));
    localStorage.setItem("layers", JSON.stringify(layers));
  }, [tappableAreas, layers]);

  useEffect(() => {
    if (imageStatus === "loaded") {
      setLoading(false); // Hide loader when the image is loaded
    }
  }, [imageStatus]);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight - ACTION_BAR_HEIGHT,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    // Load data from localStorage
    const savedData = localStorage.getItem("editBoardData");
    if (savedData) {
      const {
        image: savedImageUrl,
        points: savedPoints,
        scale: savedScale,
        position: savedPosition,
        layers: layers,
      } = JSON.parse(savedData);
      setImageUrl(savedImageUrl);
      setPoints(savedPoints);
      setScale(savedScale);
      setPosition(savedPosition);
      setLayers(layers);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (imageUrl && stageSize.width && stageSize.height) {
      const imageAspectRatio = imageUrl.width / imageUrl.height;
      const stageAspectRatio = stageSize.width / stageSize.height;

      let newWidth, newHeight, newX, newY;

      if (imageAspectRatio > stageAspectRatio) {
        newWidth = stageSize.width;
        newHeight = stageSize.width / imageAspectRatio;
      } else {
        newHeight = stageSize.height;
        newWidth = stageSize.height * imageAspectRatio;
      }

      newX = (stageSize.width - newWidth) / 2;
      newY = (stageSize.height - newHeight) / 2;

      setScale(newWidth / imageUrl.width);
      setPosition({ x: newX, y: newY });
    }
  }, [imageUrl, stageSize]);

  useEffect(() => {
    if (imageUrl) {
      // Save data to localStorage
      const dataToSave = {
        imageUrl: imageUrl?.currentSrc,
        points,
        scale,
        position,
        layers,
      };
      localStorage.setItem("editBoardData", JSON.stringify(dataToSave));
      // console.log("currentSrc");
      // console.log(imageUrl.currentSrc);
    }
  }, [imageUrl, points, scale, position, layers]);

  const handleTappableClick = () => {
    setNewTappableClicked(!isNewTappableClicked);
    setIsLayersPanelVisible(false);
  };

  const handleTappableClose = () => {
    setNewTappableClicked(false);
    // setBoardVisible(true);
  };

  const calculateCenteredPosition = (
    imageWidth,
    imageHeight,
    stageWidth,
    stageHeight
  ) => {
    return {
      x: (stageWidth - imageWidth * scale) / 2,
      y: (stageHeight - imageHeight * scale) / 2,
    };
  };

  const createTappable = (e) => {
    const stage = e.target.getStage();
    const stagePosition = stage.position();
    const stageScale = stage.scaleX();

    const pointerPosition = stage.getPointerPosition();

    const adjustedX = (pointerPosition.x - stagePosition.x) / stageScale;
    const adjustedY = (pointerPosition.y - stagePosition.y) / stageScale;

    const clickX = (adjustedX - position.x) / scale;
    const clickY = (adjustedY - position.y) / scale;

    if (
      clickX < 0 ||
      clickY < 0 ||
      clickX > imageUrl.width ||
      clickY > imageUrl.height
    ) {
      return; // Click is outside the image bounds
    }

    const boxSize = 100 / scale;
    setSelectionBox({
      x: clickX - boxSize / 2,
      y: clickY - boxSize / 2,
      width: boxSize,
      height: boxSize,
    });

    setSelectionBoxStroke("dashed");
    setActiveTappableId(null);
  };

  const handleTouchStart = (e) => {
    if (!imageUrl || selectionBox) return;
    const timer = setTimeout(() => createTappable(e), 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleStageClick = (e) => {
    if (!imageUrl || selectionBox) return;
    if ("ontouchstart" in window) return;
    const stage = e.target.getStage();
    // console.log("stage",stage);
    const stagePosition = stage.position();
    const stageScale = stage.scaleX();

    const pointerPosition = stage.getPointerPosition();

    const adjustedX = (pointerPosition.x - stagePosition.x) / stageScale;
    const adjustedY = (pointerPosition.y - stagePosition.y) / stageScale;

    const clickX = (adjustedX - position.x) / scale;
    const clickY = (adjustedY - position.y) / scale;

    if (
      clickX < 0 ||
      clickY < 0 ||
      clickX > imageUrl.width ||
      clickY > imageUrl.height
    ) {
      return; // Click is outside the image bounds
    }

    const clickedArea = tappableAreas.find((area) => {
      const { x, y, width, height } = area.position;
      // Calculate the exact position and size of the tappable area on the canvas
      const tappableX = area.position.x * imageUrl.width;
      const tappableY = area.position.y * imageUrl.height;
      const tappableWidth = area.size.width * imageUrl.width;
      const tappableHeight = area.size.height * imageUrl.height;

      return (
        clickX >= tappableX &&
        clickX <= tappableX + tappableWidth &&
        clickY >= tappableY &&
        clickY <= tappableY + tappableHeight
      );
    });

    if (clickedArea) {
      setSelectionBox({
        x: clickedArea.position.x * imageUrl.width,
        y: clickedArea.position.y * imageUrl.height,
        width: clickedArea.size.width * imageUrl.width,
        height: clickedArea.size.height * imageUrl.height,
      });
      setActiveTappableId(clickedArea.id);
      setSelectedLayerId(clickedArea.id);
      setIsLayersPanelVisible(true);
      setSelectionBoxStroke("solid");
    } else {
      const boxSize = 100 / scale;
      setSelectionBox({
        x: clickX - boxSize / 2,
        y: clickY - boxSize / 2,
        width: boxSize,
        height: boxSize,
      });

      setSelectionBoxStroke("dashed");
      setActiveTappableId(null);
    }

    const dataToSave = { image, points, scale, position, layers };
    localStorage.setItem("editBoardData", JSON.stringify(dataToSave));
    const newTappableArea = {
      id: `${getRandomNumber(100000, 999999999)}`,
    };

    const newLayer = {
      id: newTappableArea.id,
      name: `Layer ${layers.length + 1}`,
      tappableContent: null,
      selectedImage: null,
    };
  };

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const saveToUndoStack = useCallback((newState) => {
    setUndoStack((prevStack) => [...prevStack, newState]);
    setRedoStack([]); // Clear redo stack when a new action is performed
  }, []);

  const updateStateAndSave = useCallback(
    (updateFunction) => {
      const currentState = {
        tappableAreas,
        layers,
        points,
        selectionBox,
        activeTappableId,
      };

      updateFunction();

      saveToUndoStack(currentState);
    },
    [
      tappableAreas,
      layers,
      points,
      selectionBox,
      activeTappableId,
      saveToUndoStack,
    ]
  );

  const uploadTappableContent = async (content) => {
    const storedToken = localStorage.getItem("token");
    const formData = new FormData();

    let blob;
    if (content.startsWith("data:")) {
      // It's a base64 string
      const byteCharacters = atob(content.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: "image/jpeg" });
    } else if (content.startsWith("http")) {
      // It's already a URL, no need to upload again
      return content;
    } else {
      // It's probably raw image data, convert to blob
      blob = await fetch(content).then((r) => r.blob());
    }

    formData.append("file", blob, "tappable_content.jpg");

    try {
      const response = await fetch(`${baseURL}/file-upload/uploadFile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data && result.data.url) {
          return result.data.url;
        } else {
          console.error("Unexpected response structure:", result);
          return null;
        }
      } else {
        console.error(
          "Failed to upload tappable content",
          response.status,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error uploading tappable content:", error);
      return null;
    }
  };

  const handleCheckClick = async () => {
    if (selectionBox && imageUrl) {
      let newContent;

      if (newTappableType === "image" && selectedImage) {
        newContent = await uploadTappableContent(selectedImage.src);
      } else if (newTappableType === "emoji" && selectedEmoji) {
        // newContent = selectedEmoji;
        const emojiCanvas = document.createElement("canvas");
        emojiCanvas.width = selectionBox.width * scale * 2; // Use higher resolution for sharpness
        emojiCanvas.height = selectionBox.height * scale * 2;
        const emojiContext = emojiCanvas.getContext("2d");

        // Apply high-quality rendering settings
        emojiContext.imageSmoothingEnabled = true;
        emojiContext.imageSmoothingQuality = "high";

        // Calculate emoji size based on the selection box's width and height
        const fontSize = Math.min(emojiCanvas.width, emojiCanvas.height) * 0.8;
        emojiContext.font = `${fontSize}px Arial`; // Set font size based on the smaller dimension
        emojiContext.textAlign = "center";
        emojiContext.textBaseline = "middle";

        // Draw emoji at the center of the canvas
        emojiContext.fillText(
          selectedEmoji,
          emojiCanvas.width / 2,
          emojiCanvas.height / 2
        );

        newContent = await uploadTappableContent(
          emojiCanvas.toDataURL("image/png")
        );
      } else {
        // Capture background image content for blank tappables
        const captureCanvas = document.createElement("canvas");
        captureCanvas.width = selectionBox.width * scale;
        captureCanvas.height = selectionBox.height * scale;
        const captureContext = captureCanvas.getContext("2d");

        captureContext.drawImage(
          imageUrl,
          selectionBox.x,
          selectionBox.y,
          selectionBox.width,
          selectionBox.height,
          0,
          0,
          captureCanvas.width,
          captureCanvas.height
        );

        newContent = await uploadTappableContent(
          captureCanvas.toDataURL("image/png")
        );
      }

      const updatedTappableArea = {
        id: activeTappableId || `${getRandomNumber(100000, 999999999)}`,
        content: newContent,
        position: {
          x: selectionBox.x / imageUrl.width,
          y: selectionBox.y / imageUrl.height,
        },
        size: {
          width: selectionBox.width / imageUrl.width,
          height: selectionBox.height / imageUrl.height,
        },
      };

      console.log("updatedTappableArea:,", updatedTappableArea);

      updateStateAndSave(() => {
        if (activeTappableId) {
          // Update existing tappable
          setTappableAreas((prev) =>
            prev.map((area) =>
              area.id === activeTappableId ? updatedTappableArea : area
            )
          );
          setLayers((prev) =>
            prev.map((layer) =>
              layer.id === activeTappableId
                ? { ...layer, tappableContent: newContent }
                : layer
            )
          );
        } else {
          // Create new tappable
          setTappableAreas((prev) => [...prev, updatedTappableArea]);
          setLayers((prev) => [
            ...prev,
            {
              id: updatedTappableArea.id,
              name: `Layer ${prev.length + 1}`,
              tappableContent: newContent,
              selectedImage: newTappableType === "image" ? newContent : null,
            },
          ]);
        }

        // Update points
        const centerX = selectionBox.x + selectionBox.width / 2;
        const centerY = selectionBox.y + selectionBox.height / 2;
        const newPoint = {
          x: centerX / imageUrl.width,
          y: centerY / imageUrl.height,
        };

        if (activeTappableId) {
          setPoints((prev) =>
            prev.map((point, index) =>
              tappableAreas[index]?.id === activeTappableId ? newPoint : point
            )
          );
        } else {
          setPoints((prev) => [...prev, newPoint]);
        }

        setSelectionBox(null);
        setNewTappableType(null);
        setSelectedImage(null);
        setSelectedEmoji(null);
        setActiveTappableId(null);

        // Save data to localStorage
        const dataToSave = {
          tappableAreas: tappableAreas,
          points: points,
          imageUrl: imageUrl?.currentSrc,
          layers: layers,
        };
        localStorage.setItem("editBoardData", JSON.stringify(dataToSave));

        // Save tappable data to sessionStorage
        const existingTappables =
          JSON.parse(sessionStorage.getItem("tappableData")) || [];
        const newTappable = {
          tappableId: updatedTappableArea.id,
          left: newPoint.x * imageUrl.width,
          top: newPoint.y * imageUrl.height,
          imageId: boardImageId,
          points: points,
          width: selectionBox.width,
          height: selectionBox.height,
        };

        existingTappables.push(newTappable);
        sessionStorage.setItem(
          "tappableData",
          JSON.stringify(existingTappables)
        );
        console.log("existingTappables", existingTappables);
      });

      // // First API call to create or update tappable
      // try {
      //   const storedToken = localStorage.getItem("token");
      //   const payload = {
      //     addContentImagesLinks: [],
      //     imageId: boardImageId,
      //     top: updatedTappableArea.position.y.toString(),
      //     left: updatedTappableArea.position.x.toString(),
      //   };

      //   console.log("payload:", payload);

      //   const endpoint = activeTappableId
      //     ? `${baseURL}/board/updateTappable/${activeTappableId}`
      //     : `${baseURL}/board/createTappable`;

      //   const method = activeTappableId ? "PUT" : "POST";

      //   const response = await fetch(endpoint, {
      //     method: method,
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${storedToken}`,
      //     },
      //     body: JSON.stringify(payload),
      //   });

      //   if (response.ok) {
      //     const result = await response.json();
      //     console.log(
      //       `Tappable ${
      //         activeTappableId ? "updated" : "created"
      //       } successfully:`,
      //       result
      //     );
      //   } else {
      //     console.error(
      //       `Failed to ${activeTappableId ? "update" : "create"} tappable:`,
      //       response.status,
      //       response.statusText
      //     );
      //   }
      // } catch (error) {
      //   console.error(
      //     `Error ${activeTappableId ? "updating" : "creating"} tappable:`,
      //     error
      //   );
      // }

      // Second API call to upload the image using exact positions from sessionStorage
      try {
        // Retrieve the last added tappable to ensure correct position
        const storedTappables =
          JSON.parse(sessionStorage.getItem("tappableData")) || [];
        const lastTappable = storedTappables[storedTappables.length - 1];

        const payload1 = {
          boardImageId: lastTappable.imageId,
          top: lastTappable.top.toString(),
          left: lastTappable.left.toString(),
          layerName: "layer1",
          image: newContent,
          width: selectionBox.width.toString(),
          height: selectionBox.height.toString(),
        };

        console.log("payload1:", payload1);

        const response = await fetch(`${baseURL}/board/uploadOnBoardImage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload1),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Image uploaded successfully:", result);

          // Update the tappableId in sessionStorage
          const existingTappables =
            JSON.parse(sessionStorage.getItem("tappableData")) || [];
          const updatedTappables = existingTappables.map((tappable) =>
            tappable.tappableId === updatedTappableArea.id
              ? { ...tappable, tappableId: result.data.tappableId }
              : tappable
          );
          sessionStorage.setItem(
            "tappableData",
            JSON.stringify(updatedTappables)
          );

          // Update the id in localStorage layers
          const localStorageLayers =
            JSON.parse(localStorage.getItem("layers")) || [];
          const updatedLocalStorageLayers = localStorageLayers.map((layer) =>
            layer.id === updatedTappableArea.id
              ? { ...layer, id: result.data.tappableId }
              : layer
          );
          localStorage.setItem(
            "layers",
            JSON.stringify(updatedLocalStorageLayers)
          );

          // Update the id in the component state
          setTappableAreas((prev) =>
            prev.map((area) =>
              area.id === updatedTappableArea.id
                ? { ...area, id: result.data.tappableId }
                : area
            )
          );
          setLayers((prev) =>
            prev.map((layer) =>
              layer.id === updatedTappableArea.id
                ? { ...layer, id: result.data.tappableId }
                : layer
            )
          );

          // Update activeTappableId if it matches the updated area
          if (activeTappableId === updatedTappableArea.id) {
            setActiveTappableId(result.data.tappableId);
          }
        } else {
          console.error(
            "Failed to upload image:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleDeleteClick = () => {
    if (activeTappableId) {
      setLayerToDelete(activeTappableId);
      setShowDeletePopup(true);
    }
    setSelectionBox(null);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.01;
    const stage = e.target.getStage();
    const oldScale = scale;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - position.x / oldScale,
      y: stage.getPointerPosition().y / oldScale - position.y / oldScale,
    };

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  const handleBack = () => {
    navigate("/prymr");
  };

  const handleTappableBoxDragMove = (e) => {
    if (!imageUrl) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const clickX = (pointerPosition?.x - position?.x) / scale;
    const clickY = (pointerPosition?.y - position?.y) / scale;

    if (
      clickX >= 0 &&
      clickX <= imageUrl?.width &&
      clickY >= 0 &&
      clickY <= imageUrl?.height
    ) {
      const newX = Math.max(
        0,
        Math.min(e.target.x(), imageUrl?.width - selectionBox?.width)
      );
      const newY = Math.max(
        0,
        Math.min(e.target.y(), imageUrl?.height - selectionBox?.height)
      );
      updateStateAndSave(() => {
        setSelectionBox({
          ...selectionBox,
          x: newX,
          y: newY,
        });
        if (activeTappableId) {
          setTappableAreas((prev) =>
            prev.map((area) =>
              area.id === activeTappableId
                ? {
                    ...area,
                    position: {
                      x: newX / imageUrl.width,
                      y: newY / imageUrl.height,
                    },
                  }
                : area
            )
          );
        }
      });
    }
  };

  const handleSelectTappableArea = () => {
    setShowTappableArea(true);
    setSelectionBoxStroke("dashed");
    setShowNewTappable(false);
    addTappableArea();
  };

  const handleRemoveTappableArea = (id) => {
    // Save current state to undo stack
    setUndoStack((prev) => [...prev, { tappableAreas, layers }]);
    // setRedoStack([]); // Clear the redo stack when a new action is performed

    setTappableAreas((prev) => prev.filter((area) => area.id !== id));
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    setShowTappableArea(false);
    setTappableContent(null);
    setActiveTappable(null);
    setActiveTappableId(null); // Reset active tappable ID
    setTappableAreas((prev) =>
      prev.map((area) => ({ ...area, isVisible: true }))
    ); // Activate all tappable areas
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const prevState = undoStack[undoStack.length - 1];
    const currentState = {
      tappableAreas,
      layers,
      points,
      selectionBox,
      activeTappableId,
    };

    setRedoStack((prevStack) => [...prevStack, currentState]);
    setUndoStack((prevStack) => prevStack.slice(0, -1));

    setTappableAreas(prevState.tappableAreas);
    setLayers(prevState.layers);
    setPoints(prevState.points);
    setSelectionBox(prevState.selectionBox);
    setActiveTappableId(prevState.activeTappableId);
  }, [
    undoStack,
    tappableAreas,
    layers,
    points,
    selectionBox,
    activeTappableId,
  ]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    const currentState = {
      tappableAreas,
      layers,
      points,
      selectionBox,
      activeTappableId,
    };

    setUndoStack((prevStack) => [...prevStack, currentState]);
    setRedoStack((prevStack) => prevStack.slice(0, -1));

    setTappableAreas(nextState.tappableAreas);
    setLayers(nextState.layers);
    setPoints(nextState.points);
    setSelectionBox(nextState.selectionBox);
    setActiveTappableId(nextState.activeTappableId);
  }, [
    redoStack,
    tappableAreas,
    layers,
    points,
    selectionBox,
    activeTappableId,
  ]);
  const handleLayerDelete = (layerId) => {
    setLayerToDelete(layerId);
    setShowDeletePopup(true);
    setSelectionBox(null);
  };
  const confirmLayerDelete = async () => {
    if (layerToDelete) {
      try {
        // API call to delete the tappable or layer
        const response = await fetch(
          `${baseURL}/board/deleteUploadedOnBoardImage`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              boardImageId: boardImageId, // ensure this ID is correctly set
              layerImagedId: layerToDelete, // layerToDelete is the tappableId here
            }),
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to delete tappable or layer:",
            response.statusText
          );
          return;
        }

        const result = await response.json();
        console.log("Successfully deleted:", result);

        // Update state and remove the tappable/layer from storage
        updateStateAndSave(() => {
          setLayers((prev) =>
            prev.filter((layer) => layer.id !== layerToDelete)
          );
          setTappableAreas((prev) =>
            prev.filter((area) => area.id !== layerToDelete)
          );
          // Remove the corresponding point
          setPoints((prev) =>
            prev.filter(
              (_, index) => tappableAreas[index]?.id !== layerToDelete
            )
          );

          // Remove the corresponding tappable from sessionStorage
          const updatedTappables =
            JSON.parse(sessionStorage.getItem("tappableData")) || [];
          const newTappables = updatedTappables.filter(
            (tappable) => tappable.tappableId !== layerToDelete
          );
          sessionStorage.setItem("tappableData", JSON.stringify(newTappables));

          // Update localStorage layers
          const updatedLayers =
            JSON.parse(localStorage.getItem("layers")) || [];
          const newLayers = updatedLayers.filter(
            (layer) => layer.id !== layerToDelete
          );
          localStorage.setItem("layers", JSON.stringify(newLayers));

          setActiveTappable(null);
          setShowDeletePopup(false);
          setLayerToDelete(null);
          setActiveTappableId(null);
          setTappableAreas((prev) =>
            prev.map((area) => ({ ...area, isVisible: true }))
          );
        });
      } catch (error) {
        console.error("Error deleting layer:", error);
      }
    }
  };

  const cancelLayerDelete = () => {
    setShowDeletePopup(false);
    setLayerToDelete(null);
  };

  const handleFixTappableContent = (id, content, position, size) => {
    setTappableAreas((prev) =>
      prev.map((area) =>
        area.id === id ? { ...area, isFixed: true, position, size } : area
      )
    );
    setActiveTappableId(null);
  };

  const toggleTappableVisibility = (id) => {
    setTappableAreas((prev) =>
      prev.map((area) =>
        area.id === id ? { ...area, isVisible: !area.isVisible } : area
      )
    );
  };

  const handleNewTappableSelect = (type) => {
    setNewTappableType(type);

    const boxSize = 100 / scale;

    const centerX = imageUrl.width / 2 - boxSize / 2;
    const centerY = imageUrl.height / 2 - boxSize / 2;
    setSelectionBox({
      x: centerX,
      y: centerY,
      width: boxSize,
      height: boxSize,
    });
  };

  const handleImageSelect = async (imageDataUrl) => {
    const imageUrl = await uploadTappableContent(imageDataUrl);
    const img = new window.Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setSelectedImage(img);
      const aspectRatio = img.width / img.height;
      setSelectedImageAspectRatio(aspectRatio);

      // Set initial selection box size
      const initialSize = 100 / scale;
      setSelectionBox((prevBox) => ({
        ...prevBox,
        width: initialSize,
        height: initialSize / aspectRatio,
      }));
    };
    img.onerror = () => {
      console.error("Failed to load image");
    };
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleNewTappableClose = () => {
    setShowNewTappable(false);
  };

  const handleCircleClick = (index) => {
    updateStateAndSave(() => {
      const tappableArea = tappableAreas[index];

      if (tappableArea) {
        setSelectedLayerId(tappableArea.id);
        setIsLayersPanelVisible(true);
        setSelectionBoxStroke("solid");

        // Set the clicked tappable as the active selection
        setSelectionBox({
          x: tappableArea.position.x * imageUrl.width,
          y: tappableArea.position.y * imageUrl.height,
          width: tappableArea.size.width * imageUrl.width,
          height: tappableArea.size.height * imageUrl.height,
        });

        setActiveTappableId(tappableArea.id);
        setSelectedTappableArea(tappableArea);
        setPoints((prev) =>
          prev.map((point, i) =>
            i === index
              ? { ...point, isHidden: true }
              : { ...point, isHidden: false }
          )
        );
      } else {
        console.error(`No tappable area found for index ${index}`);
      }
    });
  };

  const handleTappableAreaClick = (area) => {
    setSelectedLayerId(area.id);
    setIsLayersPanelVisible(true);
    setSelectionBoxStroke("solid");

    setSelectionBox({
      x: area.position.x * imageUrl.width,
      y: area.position.y * imageUrl.height,
      width: area.size.width * imageUrl.width,
      height: area.size.height * imageUrl.height,
    });

    setActiveTappableId(area.id);
    setSelectedTappableArea(area);
    setPoints((prev) =>
      prev.map((point, index) =>
        tappableAreas[index]?.id === area.id
          ? { ...point, isHidden: true }
          : { ...point, isHidden: false }
      )
    );
  };

  const handleLayerTappableClick = (layerId) => {
    setActiveTappableId(layerId); // Set the active tappable area
    setTappableAreas((prev) =>
      prev.map((area) => ({
        ...area,
        isVisible: area.id === layerId, // Ensure only one tappable area is visible
      }))
    );
  };

  const handleLayerClick = (id) => {
    setActiveLayerId(id);
    sessionStorage.setItem("activeLayerId", id);
    console.log("Saved activeLayerId:", id);

    // Find the corresponding tappable area
    const tappableArea = tappableAreas.find((area) => area.id === id);

    if (tappableArea) {
      // Set the selection box to the tappable area's position and size
      setSelectionBox({
        x: tappableArea.position.x * imageUrl.width,
        y: tappableArea.position.y * imageUrl.height,
        width: tappableArea.size.width * imageUrl.width,
        height: tappableArea.size.height * imageUrl.height,
      });

      setSelectionBoxStroke("solid");
      setActiveTappableId(id);

      // Hide all points except the one corresponding to this tappable
      setPoints((prev) =>
        prev.map((point, index) => ({
          ...point,
          isHidden: tappableAreas[index]?.id == id,
        }))
      );
    }

    setTappableAreas((prev) =>
      prev.map((area) =>
        area.id === id
          ? { ...area, isVisible: true }
          : { ...area, isVisible: false }
      )
    );

    setSelectedLayerId(id);
  };

  const handleResizeStart = (e) => {
    e.cancelBubble = true;
    setResizing(true);
  };

  const handleResizeEnd = () => {
    setResizing(false);
  };

  const handleResize = (e) => {
    if (!resizing) return;

    const stage = stageRef.current.getStage();
    const pointerPosition = stage.getPointerPosition();

    // Calculate the new width based on the cursor position
    const newWidth = Math.max(
      50,
      (pointerPosition?.x - (position?.x + selectionBox?.x * scale)) / scale
    );

    // Adjust the height based on the aspect ratio
    let newHeight;
    if (newTappableType === "image" && selectedImageAspectRatio) {
      newHeight = newWidth / selectedImageAspectRatio;
    } else if (newTappableType === "emoji") {
      newHeight = newWidth; // Keep emojis square
    } else {
      newHeight = Math.max(
        50,
        (pointerPosition?.y - (position?.y + selectionBox?.y * scale)) / scale
      );
    }

    // Update the selection box size
    setSelectionBox((prev) => ({
      ...prev,
      width: newWidth,
      height: newHeight,
    }));
  };

  const handleMouseEnter = () => {
    setCursorStyle("se-resize");
  };

  const handleMouseLeave = () => {
    setCursorStyle("default");
  };

  useEffect(() => {
    const storedTappableData = sessionStorage.getItem("tappableData");
    if (storedTappableData) {
      const tappableArray = JSON.parse(storedTappableData);

      // Ensure the active tappable matches the currently clicked layer
      const activeTappable = tappableArray.find(
        (tappable) => tappable.tappableId === activeLayerId
      );

      if (activeTappable) {
        console.log("Retrieved tappable data:", activeTappable);
        console.log("Tappable ID:", activeTappable.tappableId);
        console.log("Left position:", activeTappable.left);
        console.log("Top position:", activeTappable.top);
        console.log("Image ID:", activeTappable.imageId);
        console.log("Points:", activeTappable.points);
      } else {
        console.log("No active tappable found for the selected layer.");
      }
    }
  }, [activeLayerId]); // Ensure this effect runs whenever the active layer ID changes

  const updateImageUrl = (newUrl) => {
    setImageUrl(newUrl);
  };

  const handleLayerActivate = (layerId) => {
    setSelectedLayerId(layerId);
    setIsLayersPanelVisible(true);
    handleLayerTappableClick(layerId);
  };

  if (loading || imageStatus !== "loaded") {
    return (
      <div className="flex items-center justify-center h-screen">
        <PropagateLoader color="#0085FF" />
      </div>
    );
  }

  const renderTappableArea = (area) => {
    if (!imageUrl || !imageUrl.width || !imageUrl.height) return null;

    const isBlank = !area.content;
    return (
      <Group
        key={area.id}
        x={area.position.x * imageUrl.width}
        y={area.position.y * imageUrl.height}
        onClick={() => handleTappableAreaClick(area)}
      >
        {!isBlank &&
          (area.content.startsWith("http") ? (
            <Image
              image={new window.Image()}
              width={area.size.width * imageUrl.width}
              height={area.size.height * imageUrl.height}
              ref={(node) => {
                if (node) {
                  const img = new window.Image();
                  img.src = area.content;
                  img.crossOrigin = "anonymous";
                  img.onload = () => node.image(img);
                }
              }}
            />
          ) : (
            <Text
              text={area.content}
              fontSize={(area.size.width * imageUrl.width) / 2}
              width={area.size.width * imageUrl.width}
              height={area.size.height * imageUrl.height}
              align="center"
              verticalAlign="middle"
            />
          ))}
      </Group>
    );
  };

  const renderDot = (point, index) => {
    if (point.isHidden) return null;
    return (
      <Circle
        key={index}
        x={point.x * imageUrl.width}
        y={point.y * imageUrl.height}
        radius={DOT_SIZE / 2 / scale}
        fill="#0085FF"
        onClick={() => handleCircleClick(index)}
        onTap={() => handleCircleClick(index)}
      />
    );
  };

  const renderImageWithTappables = () => {
    return new Promise((resolve) => {
      const stage = new Konva.Stage({
        container: "hidden-stage",
        width: imageUrl.width,
        height: imageUrl.height,
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      // Add background image
      const backgroundImage = new Konva.Image({
        image: imageUrl,
        width: imageUrl.width,
        height: imageUrl.height,
      });
      layer.add(backgroundImage);

      if (tappableAreas.length === 0) {
        // If no tappable areas, resolve with just the background image
        layer.draw();
        resolve(stage.toDataURL());
        return;
      }

      let loadedImages = 0;
      const totalTappables = tappableAreas.length;

      // Function to check if all images are loaded
      const checkAllImagesLoaded = () => {
        loadedImages++;
        if (loadedImages === totalTappables) {
          layer.draw();
          resolve(stage.toDataURL());
        }
      };

      // Add tappable areas
      tappableAreas.forEach((area) => {
        if (area.content) {
          if (area.content.startsWith("http")) {
            // Image tappable
            const img = new window.Image();
            img.crossOrigin = "Anonymous";
            img.src = area.content;
            img.onload = () => {
              const tappableImage = new Konva.Image({
                x: area.position.x * imageUrl.width,
                y: area.position.y * imageUrl.height,
                image: img,
                width: area.size.width * imageUrl.width,
                height: area.size.height * imageUrl.height,
              });
              layer.add(tappableImage);
              checkAllImagesLoaded();
            };
            img.onerror = () => {
              console.error("Failed to load image:", area.content);
              checkAllImagesLoaded();
            };
          } else {
            // Emoji tappable
            const tappableText = new Konva.Text({
              x: area.position.x * imageUrl.width,
              y: area.position.y * imageUrl.height,
              text: area.content,
              fontSize: (area.size.width * imageUrl.width) / 2,
              width: area.size.width * imageUrl.width,
              height: area.size.height * imageUrl.height,
              align: "center",
              verticalAlign: "middle",
            });
            layer.add(tappableText);
            checkAllImagesLoaded();
          }
        } else {
          checkAllImagesLoaded();
        }
      });
    });
  };

  const handleSave = async () => {
    const updatedImageUrl = await renderImageWithTappables();
    navigate("/create-new-board-edit-board-info", {
      state: {
        imageUrl: updatedImageUrl,
        boardId,
        boardImageId,
      },
    });
  };

  const handlePublish = async () => {
    const updatedImageUrl = await renderImageWithTappables();
    console.log("updatedImageUrl: ", updatedImageUrl);
    navigate("/publish", {
      state: {
        imageUrl: updatedImageUrl,
        boardId,
        boardImageId,
      },
    });
  };

  return (
    <div className="relative h-screen">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
      />

      <div>
        <button
          onClick={handleBack}
          className="absolute w-auto top-2 left-2 z-10 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>

        {/* <button
        onClick={handleSave}
        className="absolute w-auto top-12 left-2 z-10 bg-blue-500 text-white px-4 py-2 rounded"
      >
        viewBoard
      </button> */}
      </div>

      <Stage
        ref={stageRef}
        width={stageSize?.width}
        height={stageSize?.height}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTouchStart={handleTouchStart}
        onMouseMove={handleResize}
        onTouchMove={handleResize}
        onMouseUp={handleResizeEnd}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: cursorStyle }}
        x={stateDrag.x}
        y={stateDrag.y}
        draggable
        onDragStart={() => {
          if (!selectionBox) {
            setStateDrag({ isDragging: true });
          }
        }}
        onDragEnd={(e) => {
          if (!selectionBox) {
            setStateDrag({
              isDragging: false,
              x: e.target.x(),
              y: e.target.y(),
            });
          }
        }}
      >
        <Layer>
          <Group x={position?.x} y={position?.y} scaleX={scale} scaleY={scale}>
            {imageUrl && (
              <Image
                image={imageUrl}
                width={imageUrl?.width}
                height={imageUrl?.height}
              />
            )}

            {/* Render Tappable Areas */}
            {tappableAreas.map(renderTappableArea)}

            {selectionBox && (
              <Group
                x={selectionBox?.x}
                y={selectionBox?.y}
                draggable
                onDragMove={handleTappableBoxDragMove}
              >
                <Group>
                  <Rect
                    width={selectionBox?.width}
                    height={selectionBox?.height}
                    stroke="#0085FF"
                    strokeWidth={4 / scale}
                    cornerRadius={10 / scale}
                    dash={selectionBoxStroke === "dashed" ? [15, 8] : []}
                  />
                  {newTappableType === "image" && selectedImage && (
                    <Image
                      image={selectedImage}
                      width={selectionBox?.width}
                      height={selectionBox?.height}
                    />
                  )}
                  {newTappableType === "emoji" && selectedEmoji && (
                    <Text
                      text={selectedEmoji}
                      fontSize={selectionBox?.width / 1.4}
                      width={selectionBox?.width}
                      height={selectionBox?.height}
                      align="center"
                      verticalAlign="middle"
                    />
                  )}
                  <Image
                    image={arrowDownCircleIcon}
                    x={selectionBox?.width - 20 / scale}
                    y={selectionBox?.height - 20 / scale}
                    width={20 / scale}
                    height={20 / scale}
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                </Group>

                <Group
                  y={selectionBox?.height + 4 / scale}
                  x={selectionBox?.width / 2 - TAPPABLE_BOX_SIZE / 2 / scale}
                >
                  <Rect
                    width={TAPPABLE_BOX_SIZE / scale}
                    height={40 / scale}
                    fill="#0085FF"
                    cornerRadius={10 / scale}
                  />
                  <Image
                    image={checkSquareIcon}
                    x={5 / scale}
                    y={10 / scale}
                    width={ICON_SIZE / scale}
                    height={ICON_SIZE / scale}
                    onClick={handleCheckClick}
                    onTouchStart={handleCheckClick}
                  />
                  <Image
                    image={plusIcon}
                    x={35 / scale}
                    y={10 / scale}
                    width={ICON_SIZE / scale}
                    height={ICON_SIZE / scale}
                    onClick={handleTappableClick}
                    onTouchStart={handleTappableClick}
                  />
                  <Image
                    image={subtractIcon}
                    x={68 / scale}
                    y={10 / scale}
                    width={ICON_SIZE / scale}
                    height={ICON_SIZE / scale}
                    onClick={handleDeleteClick}
                    onTap={handleDeleteClick}
                  />
                </Group>
              </Group>
            )}
            {points.map(renderDot)}
          </Group>
        </Layer>
      </Stage>

      <div className="absolute bottom-0 left-0 right-0">
        {/* {console.log("imageUrl",imageUrl?.currentSrc)} */}
        <ActionBar
          boardId={boardId}
          boardImageId={boardImageId}
          imageUrl={imageUrl?.currentSrc}
          onSelectTappableArea={() => handleNewTappableSelect("area")}
          onImageSelect={(image) => {
            handleNewTappableSelect("image");
            handleImageSelect(image);
          }}
          onEmojiSelect={(emoji) => {
            handleNewTappableSelect("emoji");
            handleEmojiSelect(emoji);
          }}
          onLayersToggle={(isVisible) => setIsLayersPanelVisible(isVisible)}
          layers={layers}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleSave={handleSave}
          handlePublish={handlePublish}
        />
      </div>
      <LayersPanel
        ref={layersPanelRef}
        isVisible={isLayersPanelVisible}
        tappableContent={tappableContent}
        lastAddedTappableContent={lastAddedTappableContent}
        layers={layers}
        setLayers={setLayers}
        handleFixTappableContent={handleFixTappableContent}
        selectedLayerId={selectedLayerId}
        activeLayerId={activeLayerId}
        onLayerClick={handleLayerClick}
        onLayerDelete={handleLayerDelete}
        onLayerTappableClick={handleLayerTappableClick}
        setActiveTappableId={setActiveTappableId}
        onClose={() => setIsLayersPanelVisible(false)}
        imageUrl={imageUrl?.currentSrc}
        style={{ bottom: "0" }}
      />
      {showDeletePopup && (
        <DeletePopup
          onConfirm={confirmLayerDelete}
          onCancel={cancelLayerDelete}
        />
      )}
      {isNewTappableClicked && (
        <div className="absolute bottom-0 w-full z-50 pb-3 bg-black">
          <NewTappable
            onClose={handleTappableClose}
            onImageSelect={(image) => {
              handleNewTappableSelect("image");
              handleImageSelect(image);
            }}
            onSelectTappableArea={() => handleNewTappableSelect("area")}
            onImageSelect={(image) => {
              handleNewTappableSelect("image");
              handleImageSelect(image);
            }}
            onEmojiSelect={(emoji) => {
              handleNewTappableSelect("emoji");
              handleEmojiSelect(emoji);
            }}
            onLayersToggle={(isVisible) => setIsLayersPanelVisible(isVisible)}
          />
        </div>
      )}

      <div id="hidden-stage" style={{ display: "none" }}></div>
    </div>
  );
};

export default EditBoard;

// COMMENTED CODES WHICH MIGHT NEED LATER

// const handleCheckClick = async () => {
//   if (selectionBox && imageUrl) {
//     let newContent;

//     if (newTappableType === "image" && selectedImage) {
//       newContent = await uploadTappableContent(selectedImage.src);
//     } else if (newTappableType === "emoji" && selectedEmoji) {
//       newContent = selectedEmoji;
//     } else {
//       // Capture background image content for blank tappables
//       const captureCanvas = document.createElement("canvas");
//       captureCanvas.width = selectionBox.width * scale;
//       captureCanvas.height = selectionBox.height * scale;
//       const captureContext = captureCanvas.getContext("2d");

//       captureContext.drawImage(
//         imageUrl,
//         selectionBox.x,
//         selectionBox.y,
//         selectionBox.width,
//         selectionBox.height,
//         0,
//         0,
//         captureCanvas.width,
//         captureCanvas.height
//       );

//       newContent = await uploadTappableContent(
//         captureCanvas.toDataURL("image/png")
//       );
//     }

//     const updatedTappableArea = {
//       id: activeTappableId || `${getRandomNumber(100000, 999999999)}`,
//       content: newContent,
//       position: {
//         x: selectionBox.x / imageUrl.width,
//         y: selectionBox.y / imageUrl.height,
//       },
//       size: {
//         width: selectionBox.width / imageUrl.width,
//         height: selectionBox.height / imageUrl.height,
//       },
//     };

//     updateStateAndSave(() => {
//       if (activeTappableId) {
//         // Update existing tappable
//         setTappableAreas((prev) =>
//           prev.map((area) =>
//             area.id === activeTappableId ? updatedTappableArea : area
//           )
//         );
//         setLayers((prev) =>
//           prev.map((layer) =>
//             layer.id === activeTappableId
//               ? { ...layer, tappableContent: newContent }
//               : layer
//           )
//         );
//       } else {
//         // Create new tappable
//         setTappableAreas((prev) => [...prev, updatedTappableArea]);
//         setLayers((prev) => [
//           ...prev,
//           {
//             id: updatedTappableArea.id,
//             name: `Layer ${prev.length + 1}`,
//             tappableContent: newContent,
//             selectedImage: newTappableType === "image" ? newContent : null,
//           },
//         ]);
//       }

//       // Update points
//       const centerX = selectionBox.x + selectionBox.width / 2;
//       const centerY = selectionBox.y + selectionBox.height / 2;
//       const newPoint = {
//         x: centerX / imageUrl.width,
//         y: centerY / imageUrl.height,
//       };

//       if (activeTappableId) {
//         setPoints((prev) =>
//           prev.map((point, index) =>
//             tappableAreas[index]?.id === activeTappableId ? newPoint : point
//           )
//         );
//       } else {
//         setPoints((prev) => [...prev, newPoint]);
//       }

//       setSelectionBox(null);
//       setNewTappableType(null);
//       setSelectedImage(null);
//       setSelectedEmoji(null);
//       setActiveTappableId(null);

//       // Save data to localStorage
//       const dataToSave = {
//         tappableAreas: tappableAreas,
//         points: points,
//         imageUrl: imageUrl?.currentSrc,
//         layers: layers,
//       };
//       localStorage.setItem("editBoardData", JSON.stringify(dataToSave));

//       // Save tappable data to sessionStorage
//       const existingTappables =
//         JSON.parse(sessionStorage.getItem("tappableData")) || [];
//       existingTappables.push({
//         tappableId: updatedTappableArea.id,
//         left: newPoint.x * imageUrl.width,
//         top: newPoint.y * imageUrl.height,
//         imageId: boardImageId,
//         points: points,
//       });
//       console.log("existingTappables", existingTappables);

//       sessionStorage.setItem("tappableData", JSON.stringify(existingTappables));
//       // const capturedImage = captureStage();
// //  const test = sessionStorage.setItem('capturedBoardImage', capturedImage);
//     });

//     // API call to create or update tappable (implement update logic as needed)
//     try {
//       const storedToken = localStorage.getItem("token");
//       const payload = {
//         addContentImagesLinks: [],
//         imageId: boardImageId,
//         top: updatedTappableArea.position.y.toString(),
//         left: updatedTappableArea.position.x.toString(),
//       };

//       console.log("payload:", payload);

//       const endpoint = activeTappableId
//         ? `${baseURL}/board/updateTappable/${activeTappableId}`
//         : `${baseURL}/board/createTappable`;

//       const method = activeTappableId ? "PUT" : "POST";

//       const response = await fetch(endpoint, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${storedToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log(
//           `Tappable ${activeTappableId ? "updated" : "created"} successfully:`,
//           result
//         );
//       } else {
//         console.error(
//           `Failed to ${activeTappableId ? "update" : "create"} tappable:`,
//           response.status,
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error(
//         `Error ${activeTappableId ? "updating" : "creating"} tappable:`,
//         error
//       );
//     }

//     try {
//       const payload1 = {
//         boardImageId: boardImageId,
//         top: updatedTappableArea.position.y.toString(),
//         left: updatedTappableArea.position.x.toString(),
//         layerName: "layer1",
//         image: newContent,
//       };
//       console.log("payload1:",payload1);

//       const response = await fetch(`${baseURL}/board/uploadOnBoardImage`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload1),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Image uploaded successfully:", result);
//       } else {
//         console.error(
//           "Failed to upload image:",
//           response.status,
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   }
// };

// const handleCheckClick = async () => {
//   if (selectionBox && imageUrl) {
//     let newContent;

//     if (newTappableType === "image" && selectedImage) {
//       newContent = await uploadTappableContent(selectedImage.src);
//     } else if (newTappableType === "emoji" && selectedEmoji) {
//       // newContent = selectedEmoji;
//       const emojiCanvas = document.createElement("canvas");
//       emojiCanvas.width = selectionBox.width * scale * 2; // Use higher resolution for sharpness
//       emojiCanvas.height = selectionBox.height * scale * 2;
//       const emojiContext = emojiCanvas.getContext("2d");

//       // Apply high-quality rendering settings
//       emojiContext.imageSmoothingEnabled = true;
//       emojiContext.imageSmoothingQuality = "high";

//       // Calculate emoji size based on the selection box's width and height
//       const fontSize = Math.min(emojiCanvas.width, emojiCanvas.height) * 0.8;
//       emojiContext.font = `${fontSize}px Arial`; // Set font size based on the smaller dimension
//       emojiContext.textAlign = "center";
//       emojiContext.textBaseline = "middle";

//       // Draw emoji at the center of the canvas
//       emojiContext.fillText(
//         selectedEmoji,
//         emojiCanvas.width / 2,
//         emojiCanvas.height / 2
//       );

//       newContent = await uploadTappableContent(
//         emojiCanvas.toDataURL("image/png")
//       );
//     } else {
//       // Capture background image content for blank tappables
//       const captureCanvas = document.createElement("canvas");
//       captureCanvas.width = selectionBox.width * scale;
//       captureCanvas.height = selectionBox.height * scale;
//       const captureContext = captureCanvas.getContext("2d");

//       captureContext.drawImage(
//         imageUrl,
//         selectionBox.x,
//         selectionBox.y,
//         selectionBox.width,
//         selectionBox.height,
//         0,
//         0,
//         captureCanvas.width,
//         captureCanvas.height
//       );

//       newContent = await uploadTappableContent(
//         captureCanvas.toDataURL("image/png")
//       );
//     }

//     const updatedTappableArea = {
//       id: activeTappableId || `${getRandomNumber(100000, 999999999)}`,
//       content: newContent,
//       position: {
//         x: selectionBox.x / imageUrl.width,
//         y: selectionBox.y / imageUrl.height,
//       },
//       size: {
//         width: selectionBox.width / imageUrl.width,
//         height: selectionBox.height / imageUrl.height,
//       },
//     };

//     console.log("updatedTappableArea:,", updatedTappableArea);

//     updateStateAndSave(() => {
//       if (activeTappableId) {
//         // Update existing tappable
//         setTappableAreas((prev) =>
//           prev.map((area) =>
//             area.id === activeTappableId ? updatedTappableArea : area
//           )
//         );
//         setLayers((prev) =>
//           prev.map((layer) =>
//             layer.id === activeTappableId
//               ? { ...layer, tappableContent: newContent }
//               : layer
//           )
//         );
//       } else {
//         // Create new tappable
//         setTappableAreas((prev) => [...prev, updatedTappableArea]);
//         setLayers((prev) => [
//           ...prev,
//           {
//             id: updatedTappableArea.id,
//             name: `Layer ${prev.length + 1}`,
//             tappableContent: newContent,
//             selectedImage: newTappableType === "image" ? newContent : null,
//           },
//         ]);
//       }

//       // Update points
//       const centerX = selectionBox.x + selectionBox.width / 2;
//       const centerY = selectionBox.y + selectionBox.height / 2;
//       const newPoint = {
//         x: centerX / imageUrl.width,
//         y: centerY / imageUrl.height,
//       };

//       if (activeTappableId) {
//         setPoints((prev) =>
//           prev.map((point, index) =>
//             tappableAreas[index]?.id === activeTappableId ? newPoint : point
//           )
//         );
//       } else {
//         setPoints((prev) => [...prev, newPoint]);
//       }

//       setSelectionBox(null);
//       setNewTappableType(null);
//       setSelectedImage(null);
//       setSelectedEmoji(null);
//       setActiveTappableId(null);

//       // Save data to localStorage
//       const dataToSave = {
//         tappableAreas: tappableAreas,
//         points: points,
//         imageUrl: imageUrl?.currentSrc,
//         layers: layers,
//       };
//       localStorage.setItem("editBoardData", JSON.stringify(dataToSave));

//       // Save tappable data to sessionStorage
//       const existingTappables =
//         JSON.parse(sessionStorage.getItem("tappableData")) || [];
//       const newTappable = {
//         tappableId: updatedTappableArea.id,
//         left: newPoint.x * imageUrl.width,
//         top: newPoint.y * imageUrl.height,
//         imageId: boardImageId,
//         points: points,
//         width: selectionBox.width,
//         height: selectionBox.height,
//       };

//       existingTappables.push(newTappable);
//       sessionStorage.setItem("tappableData", JSON.stringify(existingTappables));
//       console.log("existingTappables", existingTappables);
//     });

//     // First API call to create or update tappable
//     try {
//       const storedToken = localStorage.getItem("token");
//       const payload = {
//         addContentImagesLinks: [],
//         imageId: boardImageId,
//         top: updatedTappableArea.position.y.toString(),
//         left: updatedTappableArea.position.x.toString(),
//       };

//       console.log("payload:", payload);

//       const endpoint = activeTappableId
//         ? `${baseURL}/board/updateTappable/${activeTappableId}`
//         : `${baseURL}/board/createTappable`;

//       const method = activeTappableId ? "PUT" : "POST";

//       const response = await fetch(endpoint, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${storedToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log(
//           `Tappable ${activeTappableId ? "updated" : "created"} successfully:`,
//           result
//         );
//       } else {
//         console.error(
//           `Failed to ${activeTappableId ? "update" : "create"} tappable:`,
//           response.status,
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error(
//         `Error ${activeTappableId ? "updating" : "creating"} tappable:`,
//         error
//       );
//     }

//     // Second API call to upload the image using exact positions from sessionStorage
//     try {
//       // Retrieve the last added tappable to ensure correct position
//       const storedTappables = JSON.parse(sessionStorage.getItem("tappableData")) || [];
//       const lastTappable = storedTappables[storedTappables.length - 1];

//       const payload1 = {
//         boardImageId: lastTappable.imageId,
//         top: lastTappable.top.toString(),
//         left: lastTappable.left.toString(),
//         layerName: "layer1",
//         image: newContent,
//         width: selectionBox.width.toString(),
//         height: selectionBox.height.toString(),
//       };

//       console.log("payload1:", payload1);

//       const response = await fetch(`${baseURL}/board/uploadOnBoardImage`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload1),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Image uploaded successfully:", result);
//       } else {
//         console.error(
//           "Failed to upload image:",
//           response.status,
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   }
// };

// const confirmLayerDelete = () => {
//   if (layerToDelete) {
//     // Remove the layer
//     updateStateAndSave(() => {
//       setLayers((prev) => prev.filter((layer) => layer.id !== layerToDelete));

//       // Remove the corresponding tappable area
//       setTappableAreas((prev) =>
//         prev.filter((area) => area.id !== layerToDelete)
//       );

//       // Remove the corresponding point
//       setPoints((prev) =>
//         prev.filter((_, index) => tappableAreas[index]?.id !== layerToDelete)
//       );

//       setActiveTappable(null);
//       setShowDeletePopup(false);
//       setLayerToDelete(null);
//       setActiveTappableId(null);
//       setTappableAreas((prev) =>
//         prev.map((area) => ({ ...area, isVisible: true }))
//       );
//     });
//   }
// };

// console.log("url",imageUrl?.currentSrc);
// const renderImageWithTappables = () => {
//   const stage = new Konva.Stage({
//     container: 'hidden-stage',
//     width: imageUrl.width,
//     height: imageUrl.height,
//   });

//   const layer = new Konva.Layer();
//   stage.add(layer);

//   // Add background image
//   const backgroundImage = new Konva.Image({
//     image: imageUrl,
//     width: imageUrl.width,
//     height: imageUrl.height,
//   });
//   layer.add(backgroundImage);

//   // Add tappable areas
//   tappableAreas.forEach(area => {
//     if (area.content) {
//       if (area.content.startsWith('http')) {
//         // Image tappable
//         const img = new window.Image();
//         img.src = area.content;
//         img.onload = () => {
//           const tappableImage = new Konva.Image({
//             x: area.position.x * imageUrl.width,
//             y: area.position.y * imageUrl.height,
//             image: img,
//             width: area.size.width * imageUrl.width,
//             height: area.size.height * imageUrl.height,
//           });
//           layer.add(tappableImage);
//           layer.draw();
//         };
//       } else {
//         // Emoji tappable
//         const tappableText = new Konva.Text({
//           x: area.position.x * imageUrl.width,
//           y: area.position.y * imageUrl.height,
//           text: area.content,
//           fontSize: (area.size.width * imageUrl.width) / 2,
//           width: area.size.width * imageUrl.width,
//           height: area.size.height * imageUrl.height,
//           align: 'center',
//           verticalAlign: 'middle',
//         });
//         layer.add(tappableText);
//       }
//     }
//   });

//   layer.draw();

//   return stage.toDataURL();
// };
