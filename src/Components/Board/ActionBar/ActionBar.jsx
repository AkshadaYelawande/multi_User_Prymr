import React, { useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";
import AddContent from "../../../assets/AddContent.svg";
import search from "../../../assets/search.svg";
import { IoLayersOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaRedo, FaUndo } from "react-icons/fa";
import LayersPanel from "./Layers/Layers";
import NewTappable from "./NewTappeable/Newtapable";
import Play from "../../../assets/Play.svg";
import { useSelector } from "react-redux";
import undo from "../../../assets/images/undo.svg";
import redo from "../../../assets/images/redo.svg";
import info from "../../../assets/info.svg";
import line from "../../../assets/Line68.png";

const ActionBar = ({
  imageUrl,
  onSelectTappableArea,
  onImageSelect,
  onEmojiSelect,
  onLayersToggle,
  layers,
  handleUndo,
  handleRedo,
  handleSave,
  handlePublish,
}) => {
  const navigate = useNavigate();
  const [layerIsClicked, setLayerIsClicked] = useState(false);
  const [isBoardVisible, setBoardVisible] = useState(true);
  const [isNewTappableClicked, setNewTappableClicked] = useState(false);
  const [isBoardEditorVisible, setBoardEditorVisible] = useState(false);
  const { count } = useSelector((state) => state.layerId);
  const [showLayerCount, setShowLayerCount] = useState(null);
  const boardId = sessionStorage.getItem("boardId");
  const boardImageId = sessionStorage.getItem("boardImageId");
  useEffect(() => {
    // Update layer count whenever layers change
    setShowLayerCount(layers?.length);
  }, [layers]);

  const handleBoardInfo = () => {
    const userConfirmed = toast("Navigating to board info");
    if (userConfirmed) {
      console.log("check 3 from action bar");
      console.log("Navigating to BoardINFO with imageUrl:", imageUrl);
      console.log("Navigating boardId : ", boardId);
      console.log("Navigating boardImageId : ", boardImageId);
      if (!imageUrl) {
        console.error("imageUrl is undefined or invalid");
        toast.error("Image URL is missing!");
        return;
      }

      if (!boardId || !boardImageId) {
        console.error("boardId or boardImageId is undefined");
        toast.error("Board ID or Board Image ID is missing!");
        return;
      }
      handleSave()
      // navigate("/create-new-board-edit-board-info", {
      //   state: {
      //     imageUrl: imageUrl,
      //     boardId: boardId,
      //     boardImageId: boardImageId,
      //   },
      // });
      toast.success("Navigating to Add / Save Process");
    } else {
      toast.info("Navigation cancelled.");
    }
  };

  const handleImageEditor = () => {
    toast.success("Navigating you to edit board ");
    console.log("check handleImageEditor from action bar");
    console.log("Navigating to BoardEDITEDITEDITEDIT with imageUrl:", imageUrl);
    navigate("/board-builder-actionbar-image-edit", { state: imageUrl });
  };

  const handleLayerClick = () => {
    setLayerIsClicked(!layerIsClicked);
    setNewTappableClicked(false);
    onLayersToggle(!layerIsClicked);
    setBoardVisible(layerIsClicked);
  };

  const handleTappableClick = () => {
    setNewTappableClicked(!isNewTappableClicked);
    setLayerIsClicked(false);
    onLayersToggle(false);
    setBoardVisible(isNewTappableClicked);
  };

  const handleTappableClose = () => {
    setNewTappableClicked(false);
    setBoardVisible(true);
  };

  const handleBoardEditorClick = () => {
    navigate("/board-builder-actionbar-image-edit");
    setBoardEditorVisible(!isBoardEditorVisible);
  };

  const handleSelectTappableArea = () => {
    onSelectTappableArea();
    setNewTappableClicked(false);
    setBoardVisible(true);
  };

  const navigatetoahome = () => {
    // navigate("/publish", {
    //   state: {
    //     boardId: boardId,
    //     boardImageId: boardImageId,
    //   },
    // });
    handlePublish()
  };

  return (
    <>
      <div className="fixed no-select bottom-0 left-0 w-full z-40">
        {isBoardVisible && (
          <div className="bg-gray-600 flex justify-center w-full p-1 items-center space-y-2 shrink">
            <div className="flex space-x-2 sm:space-x-4 md:space-x-4 py-1">
              <button
                onClick={handleBoardInfo}
                className="py-1 px-2 sm:px-3 md:px-6 rounded-[25px] border border-white flex items-center justify-center space-x-1 md:space-x-2"
              >
                <span className="flex-shrink-0 text-xs sm:text-sm md:text-base">
                  Board Info
                </span>
                <span className="flex-shrink-0">
                  <BsInfoCircle className="text-sm md:text-base" />
                </span>
              </button>
              <button className="py-1 px-2 sm:px-3 md:px-6 bg-sky-500 rounded-[55px] flex items-center justify-center space-x-1 md:space-x-2">
                <span
                  className="flex-shrink-0 text-xs sm:text-sm md:text-base"
                  onClick={navigatetoahome}
                >
                  Publish
                </span>
                <span className="flex-shrink-0">
                  <img src={Play} alt="" className="w-3 h-3 md:w-4 md:h-4" />
                </span>
              </button>
              <button
                className="py-1 px-2 sm:px-3 md:px-6 rounded-[25px] border border-white flex items-center justify-center space-x-1 md:space-x-2"
                onClick={handleBoardEditorClick}
              >
                <span
                  className="flex-shrink-0 text-xs sm:text-sm md:text-base"
                  onClick={handleImageEditor}
                >
                  Image Editors
                </span>
                <span className="flex-shrink-0">
                  <HiOutlineBookOpen className="text-sm md:text-base" />
                </span>
              </button>
            </div>
          </div>
        )}

        {layerIsClicked && <LayersPanel />}
        {isNewTappableClicked && (
          <NewTappable
            onClose={handleTappableClose}
            onSelectTappableArea={handleSelectTappableArea}
            onImageSelect={onImageSelect}
            onEmojiSelect={onEmojiSelect}
          />
        )}
        <div className="bg-gray-900 flex justify-center w-full p-1 items-center">
          <div className="flex space-x-2 sm:space-x-3 md:space-x-5 py-1">
            <div className="flex flex-col items-center">
              <button
                className={`py-1 px-2 sm:px-3 md:px-8 rounded-full flex flex-col items-center ${
                  isNewTappableClicked
                    ? "bg-[#0085ff]"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={handleTappableClick}
              >
                <img
                  src={info}
                  className="w-4 h-4 md:w-6 md:h-6"
                  alt="New tappable"
                />
              </button>
              <span className="text-[#d1cdcdc8] text-xs md:text-sm mt-1">
                New tappable
              </span>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="hover:bg-gray-600 py-1 px-2 sm:px-3 md:px-4 rounded-full flex flex-col items-center"
                onClick={handleUndo}
              >
                <FaUndo className="w-4 h-4 md:w-5 md:h-5 mb-1" />
              </button>
              <span className="text-[#d1cdcdc8] text-xs md:text-sm">Undo</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                className="hover:bg-gray-600 py-1 px-2 sm:px-3 md:px-4 rounded-full flex flex-col items-center"
                onClick={handleRedo}
              >
                <FaRedo className="w-4 h-4 md:w-5 md:h-5 mb-1" />
              </button>
              <span className="text-[#d1cdcdc8] text-xs md:text-sm">Redo</span>
            </div>
            <div className="flex flex-col items-center">
              <button
                className={`py-1 px-2 sm:px-3 md:px-8 rounded-full flex flex-col items-center ${
                  layerIsClicked
                    ? "bg-yellow-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={handleLayerClick}
              >
                <span className="flex gap-1 md:gap-2 items-center">
                  <span className="text-xs md:text-sm">{showLayerCount}</span>
                  <IoLayersOutline className="text-base md:text-xl" />
                </span>
              </button>
              <span className="text-[#d1cdcdc8] text-xs md:text-sm mt-1">
                Layers
              </span>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ActionBar;

// import React, { useState, useEffect } from "react";
// import { BsInfoCircle } from "react-icons/bs";
// import { LuPencilLine } from "react-icons/lu";
// import { HiOutlineBookOpen } from "react-icons/hi2";
// import { GoPlus } from "react-icons/go";
// import AddContent from "../../../assets/AddContent.svg";
// import search from "../../../assets/search.svg";
// import { IoLayersOutline } from "react-icons/io5";
// import { useNavigate } from "react-router";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaPlus, FaRedo, FaUndo } from "react-icons/fa";
// import LayersPanel from "./Layers/Layers";
// import NewTappable from "./NewTappeable/Newtapable";
// import Play from "../../../assets/Play.svg";
// import { useSelector } from "react-redux";
// import undo from "../../../assets/images/undo.svg";
// import redo from "../../../assets/images/redo.svg";
// import info from "../../../assets/info.svg";
// import line from "../../../assets/Line68.png";

// const ActionBar = ({
//   imageUrl,
//   onSelectTappableArea,
//   onImageSelect,
//   onEmojiSelect,
//   onLayersToggle,
//   layers = [], // Default to an empty array
//   handleUndo,
//   handleRedo,
//   boardId,
//   boardImageId,
// }) => {
//   const navigate = useNavigate();
//   const [layerIsClicked, setLayerIsClicked] = useState(false);
//   const [isBoardVisible, setBoardVisible] = useState(true);
//   const [isNewTappableClicked, setNewTappableClicked] = useState(false);
//   const [isBoardEditorVisible, setBoardEditorVisible] = useState(false);
//   const { count } = useSelector((state) => state.layerId);
//   const [showLayerCount, setShowLayerCount] = useState(null);

//   useEffect(() => {
//     // Update layer count whenever layers change
//     setShowLayerCount(layers.length);
//   }, [layers]);

//   const handleBoardInfo = () => {
//     const userConfirmed = confirm("Navigating to board info");
//     if (userConfirmed) {
//       console.log("check 3 from action bar");
//       console.log(
//         "Navigating to BoardINFO with imageUrl:",
//         // boardId,
//         // boardImageId,
//         imageUrl
//       );
//       navigate("/create-new-board-edit-board-info", {
//         state: { imageUrl, boardId, boardImageId },
//       });
//       toast.success("Navigating to Add / Save Process");
//     } else {
//       toast.info("Navigation cancelled.");
//     }
//   };

//   const handleImageEditor = () => {
//     toast.success("Navigating you to edit board ");
//     console.log("check handleImageEditor from action bar");
//     console.log("Navigating to BoardEDITEDITEDITEDIT with imageUrl:", imageUrl);
//     navigate("/board-builder-actionbar-image-edit", { state: imageUrl });
//   };

//   const handleLayerClick = () => {
//     setLayerIsClicked(!layerIsClicked);
//     setNewTappableClicked(false);
//     onLayersToggle(!layerIsClicked);
//     setBoardVisible(layerIsClicked);
//   };

//   const handleTappableClick = () => {
//     setNewTappableClicked(!isNewTappableClicked);
//     setLayerIsClicked(false);
//     onLayersToggle(false);
//     setBoardVisible(isNewTappableClicked);
//   };

//   const handleTappableClose = () => {
//     setNewTappableClicked(false);
//     setBoardVisible(true);
//   };

//   const handleBoardEditorClick = () => {
//     navigate("/board-builder-actionbar-image-edit");
//     setBoardEditorVisible(!isBoardEditorVisible);
//   };

//   const handleSelectTappableArea = () => {
//     onSelectTappableArea();
//     setNewTappableClicked(false);
//     setBoardVisible(true);
//   };

//   const navigatetoahome = () => {
//     navigate("/home");
//   };

//   return (
//     <>
//       <div className="fixed bottom-0 left-0 w-full z-40">
//         {isBoardVisible && (
//           <div className="bg-gray-600 flex justify-center w-full p-1 items-center space-y-2 shrink">
//             <div className="flex space-x-2 sm:space-x-4 md:space-x-4 py-1">
//               <button
//                 onClick={handleBoardInfo}
//                 className="py-1 px-2 sm:px-3 md:px-6 rounded-[25px] border border-white flex items-center justify-center space-x-1 md:space-x-2"
//               >
//                 <span className="flex-shrink-0 text-xs sm:text-sm md:text-base">
//                   Board Info
//                 </span>
//                 <span className="flex-shrink-0">
//                   <BsInfoCircle className="text-sm md:text-base" />
//                 </span>
//               </button>
//               <button className="py-1 px-2 sm:px-3 md:px-6 bg-sky-500 rounded-[55px] flex items-center justify-center space-x-1 md:space-x-2">
//                 <span
//                   className="flex-shrink-0 text-xs sm:text-sm md:text-base"
//                   onClick={navigatetoahome}
//                 >
//                   Publish
//                 </span>
//                 <span className="flex-shrink-0">
//                   <img src={Play} alt="" className="w-3 h-3 md:w-4 md:h-4" />
//                 </span>
//               </button>
//               <button
//                 className="py-1 px-2 sm:px-3 md:px-6 rounded-[25px] border border-white flex items-center justify-center space-x-1 md:space-x-2"
//                 onClick={handleBoardEditorClick}
//               >
//                 <span
//                   className="flex-shrink-0 text-xs sm:text-sm md:text-base"
//                   onClick={handleImageEditor}
//                 >
//                   Image Editors
//                 </span>
//                 <span className="flex-shrink-0">
//                   <HiOutlineBookOpen className="text-sm md:text-base" />
//                 </span>
//               </button>
//             </div>
//           </div>
//         )}

//         {isNewTappableClicked && (
//           <NewTappable
//             onClose={handleTappableClose}
//             onSelectTappableArea={handleSelectTappableArea}
//             onImageSelect={onImageSelect}
//             onEmojiSelect={onEmojiSelect}
//           />
//         )}
//         {layerIsClicked && <LayersPanel />}
//         <div className="bg-gray-900 flex justify-center w-full p-1 items-center">
//           <div className="flex space-x-2 sm:space-x-3 md:space-x-5 py-1">
//             <div className="flex flex-col items-center">
//               <button
//                 className={`py-1 px-2 sm:px-3 md:px-8 rounded-full flex flex-col items-center ${
//                   isNewTappableClicked
//                     ? "bg-[#0085ff]"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={handleTappableClick}
//               >
//                 <img
//                   src={info}
//                   className="w-4 h-4 md:w-6 md:h-6"
//                   alt="New tappable"
//                 />
//               </button>
//               <span className="text-[#d1cdcdc8] text-xs md:text-sm mt-1">
//                 New tappable
//               </span>
//             </div>
//             <div className="flex flex-col items-center">
//               <button
//                 className="hover:bg-gray-600 py-1 px-2 sm:px-3 md:px-4 rounded-full flex flex-col items-center"
//                 onClick={handleUndo}
//               >
//                 <FaUndo className="w-4 h-4 md:w-5 md:h-5 mb-1" />
//               </button>
//               <span className="text-[#d1cdcdc8] text-xs md:text-sm">Undo</span>
//             </div>
//             <div className="flex flex-col items-center">
//               <button
//                 className="hover:bg-gray-600 py-1 px-2 sm:px-3 md:px-4 rounded-full flex flex-col items-center"
//                 onClick={handleRedo}
//               >
//                 <FaRedo className="w-4 h-4 md:w-5 md:h-5 mb-1" />
//               </button>
//               <span className="text-[#d1cdcdc8] text-xs md:text-sm">Redo</span>
//             </div>
//             <div className="flex flex-col items-center">
//               <button
//                 className={`py-1 px-2 sm:px-3 md:px-8 rounded-full flex flex-col items-center ${
//                   layerIsClicked
//                     ? "bg-yellow-500"
//                     : "bg-gray-700 hover:bg-gray-600"
//                 }`}
//                 onClick={handleLayerClick}
//               >
//                 <span className="flex gap-1 md:gap-2 items-center">
//                   <span className="text-xs md:text-sm">{showLayerCount}</span>
//                   <IoLayersOutline className="text-base md:text-xl" />
//                 </span>
//               </button>
//               <span className="text-[#d1cdcdc8] text-xs md:text-sm mt-1">
//                 Layers
//               </span>
//             </div>
//           </div>
//         </div>
//         <ToastContainer />
//       </div>
//     </>
//   );
// };

// export default ActionBar;
