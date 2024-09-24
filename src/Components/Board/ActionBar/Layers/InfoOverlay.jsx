import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "./layers.css";
import ColorPanel from "./ColorPannel";
import { baseURL } from "../../../../Constants/urls";
import Content from "../../../../assets/Content.png";
import Content_vanish from "../../../../assets/Content_vanish.png";
import { useToastManager } from "../../../Context/ToastContext";
import {
  FaEye,
  FaWrench,
  FaTrash,
  FaTimes,
  FaLockOpen,
  FaLock,
  FaDollarSign,
  FaUserPlus,
} from "react-icons/fa";

const InfoOverlay = () => {
  const toast = useToastManager();
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { layer, data, layerId, layerName, tappableContent, selectedColor } =
    location.state || {};
  const fileInputRef = useRef(null);
  const [replacementImage, setReplacementImage] = useState(null);
  const [currentLayerId, setCurrentLayerId] = useState(null);
  const boardImageId = sessionStorage.getItem("boardImageId");
  const [tappableData, setTappableData] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [switchAction, setSwitchAction] = useState("vanish");
  const [lockTappable, setLockTappable] = useState(false);
  const [selectedOption, setSelectedOption] = useState("payment");
  const [layers, setLayers] = useState([
    {
      id: 1,
      name: layer?.name,
      selectedColor: "#4B4B4B",
      tappableContent: null,
      selectedImage: null,
    },
  ]);

  // const [layerName, setLayerName] = useState("");
  const [imageId, setImageId] = useState("");
  const [activeTappable, setActiveTappable] = useState(null);

  useEffect(() => {
    // Retrieve activeLayerId from sessionStorage
    const storedLayerId = sessionStorage.getItem("activeLayerId");
    if (storedLayerId) {
      setCurrentLayerId(storedLayerId); // Update state with the retrieved layer ID
      console.log("Retrieved activeLayerId:", storedLayerId);
      // Log the active layer ID
    } else {
      console.log("No activeLayerId found in session storage.");
    }
  }, []);

  useEffect(() => {
    const storedTappableData = sessionStorage.getItem("tappableData");

    console.log(
      "activeTappableactiveTappableactiveTappable",
      storedTappableData
    );
    if (storedTappableData) {
      const parsedData = JSON.parse(storedTappableData);
      setTappableData(parsedData);
      const activeTappable = parsedData.find(
        (tappable) => tappable.tappableId === currentLayerId // Use currentLayerId instead of activeLayerId
      );

      if (activeTappable) {
        setActiveTappable(activeTappable);
        console.log("Retrieved tappable data:", activeTappable);
        console.log("Tappable ID:", activeTappable.tappableId);
        console.log("Left position:", activeTappable.left);
        console.log("Tappable ID:", activeTappable.tappableId);
        console.log("width position:", activeTappable.width);
        console.log("Height position:", activeTappable.height);
        console.log("Top position:", activeTappable.top);
        console.log("Image ID:", activeTappable.imageId);
        console.log("Points:", activeTappable.points);
      } else {
        console.log("No active tappable found for the selected layer.");
      }
    }
  }, [currentLayerId]);

  const handleBack = () => {
    navigate("/board-builder-edit-board");
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleSwitchActionChange = (action) => {
    setSwitchAction(action);
  };

  const handleLockTappableToggle = () => {
    setLockTappable(!lockTappable);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReplacementImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplacementImageClick = () => {
    if (switchAction === "replace") {
      fileInputRef.current.click();
    }
  };

  const handleApply = () => {
    // Apply the selected actions and settings
    console.log("Applying settings:", {
      selectedAction,
      switchAction,
      lockTappable,
    });
    // Here you would typically update your state or make an API call
  };

  return (
    <>
      <div className="w-[430px] h-screen pb-2 bg-black flex flex-col items-center gap-2">
        {layers?.map((layer) => (
          <div
            key={layer.id}
            className="w-full h-[99px] bg-[#6b6b6b] rounded-[5px] border-2 border-[#393939] flex flex-col"
          >
            <div className="h-12 pl-4 flex items-center gap-1">
              <div
                className="w-[17px] h-[17px] relative cursor-pointer"
                onClick={() => handleBack(layer.id)}
              >
                <div className="absolute text-white"> &lt;</div>
              </div>
              <div className="grow text-[#c8c8c8] text-xs font-bold tracking-tight">
                {layerName || "Layer 01"}
              </div>
              <div className="flex gap-4 px-4 bg-[#4b4b4b] rounded-tr rounded-bl border-2 border-[#393939]">
                <FaEye className="w-5 h-5 text-white" />
                <FaWrench className="w-5 h-5 text-white" />
                <FaTrash className="w-5 h-5 text-white" />
                <FaTimes className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="w-full h-[3px] flex">
              <div className="grow bg-[#fff400]"></div>
              <div className="grow bg-transparent"></div>
              <div className="grow bg-transparent"></div>
            </div>
            <div className="h-12 px-4 flex items-center justify-between gap-1">
              <div className="w-[133px] h-9 bg-[#6c6c6c] flex items-center justify-center">
                <img
                  className="w-[25px] h-[25px] rounded"
                  src={tappableContent || "https://via.placeholder.com/25x25"}
                />
              </div>

              {selectedAction && (
                <div className="w-[132px] h-9 bg-[#6c6c6c] text-white flex items-center justify-center">
                  Switch
                </div>
              )}

              <div className="w-[137px] h-9 bg-[#6c6c6c] flex items-center justify-center">
                <img
                  className="w-[25px] h-[25px] rounded"
                  src={
                    selectedAction && switchAction === "vanish"
                      ? Content_vanish
                      : replacementImage || "https://via.placeholder.com/25x25"
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <div className="w-[381.77px] text-white flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4">
            <div className="text-white text-70 text-base font-medium uppercase">
              Add Tap Action
            </div>
            {selectedAction === "switch" ? (
              <div className="bg-[#1E1E1E] p-4 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                  SELECT SWITCH ACTION
                </h3>
                <div className="flex justify-between">
                  <div className="flex items-center w-[118px] h-[115px] justify-between bg-[#2C2C2C] p-3 rounded-lg mb-4">
                    <img
                      src={
                        tappableContent || "https://via.placeholder.com/25x25"
                      }
                      alt="Current"
                      className="w-22 h-22 rounded"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      className={`px-4 py-2 rounded ${
                        switchAction === "vanish"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-600 text-white"
                      }`}
                      onClick={() => handleSwitchActionChange("vanish")}
                    >
                      Vanish
                    </button>
                    <span className="text-gray-400 mt-1">OR</span>
                    <button
                      className={`px-4 py-2 rounded mt-1 ${
                        switchAction === "replace"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-600 text-white"
                      }`}
                      onClick={() => handleSwitchActionChange("replace")}
                    >
                      Replace
                    </button>
                  </div>
                  <div className="flex relative w-[118px] h-[115px] items-center">
                    <img
                      src={
                        switchAction === "vanish"
                          ? Content_vanish
                          : replacementImage || Content
                      }
                      alt="Replacement"
                      className="rounded cursor-pointer"
                      onClick={handleReplacementImageClick}
                      style={{ objectFit: "cover" }}
                    />
                    {switchAction === "replace" && (
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    )}
                  </div>
                  {/* <img src={switchAction === 'vanish'? Content_vanish : Content } alt="Replacement" className="w-22 h-22 rounded" /> */}
                </div>
                {/* <div className="flex items-center justify-between bg-[#2C2C2C] p-3 rounded-lg mb-4">
                <span className="text-white">Lock Tappable</span>
                <div
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer ${lockTappable ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={handleLockTappableToggle}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${lockTappable ? 'translate-x-6' : ''}`} />
                </div>
              </div> */}

                <div className=" bg-[#2C2C2C] p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {lockTappable ? (
                        <FaLockOpen className="mr-2" />
                      ) : (
                        <FaLock className="mr-2" />
                      )}

                      <span>Lock Tappable</span>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                        lockTappable ? "bg-green-500" : "bg-gray-600"
                      }`}
                      onClick={handleLockTappableToggle}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          lockTappable ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {lockTappable && (
                    <>
                      <div className="flex mb-4">
                        <button
                          className={`flex-1 py-2 rounded-l-lg ${
                            selectedOption === "payment"
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-600 text-white"
                          }`}
                          onClick={() => handleOptionSelect("payment")}
                        >
                          <FaDollarSign className="inline mr-2" />
                          Payment
                        </button>
                        <button
                          className={`flex-1 py-2 rounded-r-lg ${
                            selectedOption === "follow"
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-600 text-white"
                          }`}
                          onClick={() => handleOptionSelect("follow")}
                        >
                          <FaUserPlus className="inline mr-2" />
                          Follow
                        </button>
                      </div>

                      {selectedOption === "payment" && (
                        <div className="mb-4">
                          <input
                            type="text"
                            placeholder="Enter Price"
                            className="w-full p-2 mb-2 bg-gray-700 rounded"
                          />
                          <textarea
                            placeholder="Enter Description"
                            className="w-full p-2 bg-gray-700 rounded"
                            rows="3"
                          />
                        </div>
                      )}

                      {selectedOption === "follow" && (
                        <div className="mb-4">
                          <textarea
                            placeholder="Enter Description"
                            className="w-full p-2 bg-gray-700 rounded"
                            rows="3"
                          />
                        </div>
                      )}

                      <p className="text-sm text-gray-400">
                        {selectedOption === "payment"
                          ? "By adding a payment request, your viewers will pay the stipulated fee to apply the selected switch action this tappable"
                          : "By adding a follow request, your viewers must be following you on prymr to apply the selected switch action this tappable"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`h-[50px] w-full px-[15px] py-2.5 rounded-2xl border ${
                    selectedAction === "info"
                      ? "border-white"
                      : "border-white/30"
                  } flex items-center cursor-pointer`}
                  onClick={() => handleActionSelect("info")}
                >
                  <div className="grow flex items-center gap-[15px]">
                    <div className="w-[30px] h-[30px]">S</div>
                    <div className="text-white text-base font-medium">
                      Info Overlay
                    </div>
                  </div>
                  <div className="w-[30px] h-[30px]">D</div>
                </div>
                <div
                  className={`h-[50px] w-full px-[15px] py-2.5 rounded-2xl border ${
                    selectedAction === "switch"
                      ? "border-white"
                      : "border-white/30"
                  } flex items-center cursor-pointer`}
                  onClick={() => handleActionSelect("switch")}
                >
                  <div className="grow flex items-center gap-[15px]">
                    <div className="w-[30px] h-[30px]" />
                    <div className="text-white text-base font-medium">
                      Switch
                    </div>
                  </div>
                  <div className="w-[30px] h-[30px]">D</div>
                </div>
                <div
                  className={`h-[50px] w-full px-[15px] py-2.5 rounded-2xl border ${
                    selectedAction === "link"
                      ? "border-white"
                      : "border-white/30"
                  } flex items-center cursor-pointer`}
                  onClick={() => handleActionSelect("link")}
                >
                  <div className="grow flex items-center gap-[15px]">
                    <div className="w-[30px] h-[30px]">S</div>
                    <div className="text-white text-base font-medium">
                      Link to A Board
                    </div>
                  </div>
                  <div className="w-[30px] h-[30px]">D</div>
                </div>
              </>
            )}
          </div>
          <button
            className={`w-full h-[37px] px-3 py-2.5 rounded-[36px] flex justify-center items-center ${
              selectedAction
                ? "bg-blue-500 text-white"
                : "bg-[#4d4d4d] text-white/50"
            }`}
            onClick={handleApply}
            disabled={!selectedAction}
          >
            <div className="text-[12.82px] font-bold capitalize">
              {selectedAction ? "Apply" : "Add Tap Action"}
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default InfoOverlay;
