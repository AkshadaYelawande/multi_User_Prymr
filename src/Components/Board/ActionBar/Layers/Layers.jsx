import React, { useState, useEffect, useRef, forwardRef } from "react";
import { FaPlus } from "react-icons/fa";
import hamburger from "../../../../assets/hamburger.svg";
import eye from "../../../../assets/Eye.svg";
import pin from "../../../../assets/pin.png";
import colorcircle from "../../../../assets/colorcircle.png";
import deletee from "../../../../assets/delete.svg";
import search from "../../../../assets/search.svg";
import arrowspointingout from "../../../../assets/arrowspointingout.svg";
import xmark from "../../../../assets/x-mark.svg";
import LayerTappable from "../../../../assets/tappable.svg";
import AddAction from "../../../../assets/AddActions.svg";
import AddContent from "../../../../assets/AddContent.svg";
import * as fabric from "fabric";
import ColorPanel from "./ColorPannel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import { useDispatch } from "react-redux";
import { setCount } from "../../../../redux/LayerCountSlice";
import "swiper/css";
import "swiper/css/scrollbar";
import "./layers.css";
import { useNavigate } from "react-router";
import { baseURL } from "../../../../Constants/urls";

const LayersPanel = forwardRef(
  (
    {
      isVisible,
      tappableContent,
      lastAddedTappableContent,
      layers = [],
      setLayers,
      handleFixTappableContent,
      selectedLayerId,
      onLayerClick,
      onLayerDelete,
      onClose,
      onLayerTappableClick,
      imageUrl,
      onChangeBackground,
    },
    ref
  ) => {
    const [addcontentImage, setImageAddContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [layerIsClicked, setLayerIsClicked] = useState(false);
    const [isTapActionOpen, setTapActionOpen] = useState(false);
    const [isAddContentOpen, setAddContentOpen] = useState(false);
    const [colorPanelVisible, setColorPanelVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#4B4B4B");
    const [isSwiperView, setIsSwiperView] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const [currentLayerId, setCurrentLayerId] = useState(null);
    const swiperInstanceRef = useRef(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [allBoardLayersImages, setAllBoardLayersImages] = useState([]);
    const [layerImages, setLayerImages] = useState([]);
    const [debugInfo, setDebugInfo] = useState("");

    useEffect(() => {
      if (isVisible && selectedLayerId && swiperInstanceRef.current) {
        const index = layers.findIndex((layer) => layer.id === selectedLayerId);
        if (index !== -1) {
          swiperInstanceRef.current.slideTo(index);
        }
      }
    }, [isVisible, selectedLayerId, layers]);

    useEffect(() => {
      if (isVisible) {
        fetchAllBoardLayersImages();
      }
    }, [isVisible]);

    useEffect(() => {
      console.log("Current layers:", layers);
      console.log("Current layerImages:", layerImages);
    }, [layers, layerImages]);

    const fetchAllBoardLayersImages = async () => {
      const storedToken = localStorage.getItem("token");
      const boardId = sessionStorage.getItem("boardId");
      const boardImageId = sessionStorage.getItem("boardImageId");

      try {
        const response = await fetch(
          `${baseURL}/board/fetchAllBoardLayersImages?boardId=${boardId}&boardImageId=${boardImageId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
          setDebugInfo("Error: data.data is not an array");
          return;
        }

        const updatedLayerImages = data.data.reduce((acc, item) => {
          if (item && item.tappableId && item.contentImage) {
            acc[item.tappableId] = item.contentImage;
          } else {
            console.log("Invalid item:", item);
          }
          return acc;
        }, {});

        setLayerImages(updatedLayerImages);
        console.info(updatedLayerImages);
        // setDebugInfo(`Loaded ${Object.keys(updatedLayerImages).length} images`);
      } catch (error) {
        console.error("Error fetching board layers images:", error);
        setDebugInfo(`Error: ${error.message}`);
      }
    };

    const renderTappableContent = (content, layerId) => {
      let contentImage1 = "";
      const isActive = layerId === selectedLayerId;
      const contentClass = isActive ? "border-2 border-blue-500" : "";

      // Use the fetched image if available, otherwise use a default or placeholder
      const imageToShow = layerImages[layerId] || content;
      const origanlTappableId = sessionStorage.getItem(layerId);

      if (origanlTappableId) {
        console.info(origanlTappableId);

        // Since layerImages is an object, you don't need to filter or find
        contentImage1 = layerImages[origanlTappableId];
        console.info(contentImage1);
      } else {
        console.info("No tappableId found");
      }

      if (imageToShow) {
        // Check if the content is an emoji (a single character that's not a letter or number)
        const isEmoji =
          /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])$/.test(
            imageToShow
          );

        if (isEmoji) {
          return (
            <div
              className={`cursor-pointer w-[129px] h-[130px] flex items-center justify-center text-6xl ${contentClass}`}
              onClick={() => handleTappableClick(imageToShow, contentImage1)}
            >
              {imageToShow}
            </div>
          );
        } else {
          return (
            <img
              src={imageToShow || AddContent}
              alt="Tappable Content"
              className={`cursor-pointer max-w-[129px] max-h-[130px] object-contain ${contentClass}`}
              onClick={() => handleTappableClick(imageToShow, contentImage1)}
            />
          );
        }
      } else {
        // If no image or emoji is available, show a placeholder or default content
        return (
          <div
            className={`cursor-pointer max-w-[129px] max-h-[130px] flex items-center justify-center bg-gray-200 ${contentClass}`}
            onClick={() => handleTappableClick(layerId, contentImage1)}
          >
            <img src={LayerTappable} alt="Add Action" />
          </div>
        );
      }
    };

    const renderTappableContentRightSide = (content, layerId) => {
      let contentImage1 = "";
      const isActive = layerId === selectedLayerId;
      const contentClass = isActive ? "border-2 border-blue-500" : "";

      // Use the fetched image if available, otherwise use a default or placeholder
      const imageToShow = layerImages[layerId] || content;
      const origanlTappableId = sessionStorage.getItem(layerId);

      if (origanlTappableId) {
        console.info(origanlTappableId);

        // Since layerImages is an object, you don't need to filter or find
        contentImage1 = layerImages[origanlTappableId];
        console.info(contentImage1);
      } else {
        console.info("No tappableId found");
      }

      if (imageToShow) {
        // console.info(contentImage1);
        return (
          <img
            src={contentImage1 || AddContent}
            alt="Tappable Content"
            className={`cursor-pointer max-w-[129px] max-h-[130px] object-contain ${contentClass}`}
            onClick={() => handleTappableClick(contentImage1, contentImage1)}
          />
        );
      } else {
        // If no image is available, show a placeholder or default content
        return (
          <div
            className={`cursor-pointer max-w-[129px] max-h-[130px] flex items-center justify-center bg-gray-200 ${contentClass}`}
            onClick={() => handleTappableClick(layerId, contentImage1)}
          >
            <img src={AddContent} />
          </div>
        );
      }
    };

    const handleLayerAddClick = () => {
      if (selectedImage) {
        onAddSticker(selectedImage);
      }
    };

    const handleTapActionClick = (layer) => {
      navigate("/infoOverlay1", {
        state: {
          layerId: layer.id,
          layerName: layer.name,
          tappableContent: layer.tappableContent,
          selectedColor: layer.selectedColor,
        },
      });
    };

    const handleAddContent = () => {
      setAddContentOpen(!isAddContentOpen);
      setLayerIsClicked(false);
    };

    const handleColorCircleClick = (id) => {
      setCurrentLayerId(id);
      setColorPanelVisible(true);
    };

    const handleColorSelect = (color) => {
      setLayers(
        layers.map((layer) =>
          layer.id === currentLayerId
            ? { ...layer, selectedColor: color }
            : layer
        )
      );
      setColorPanelVisible(false);
    };

    const handleLayerDeleteClick = (layerId) => {
      onLayerDelete(layerId);
      dispatch(setCount(layers.length - 1));

      // sessionStorage.removeItem(tappableId);
    };

    const handleNewLayerAddClick = () => {
      const newLayerId = layers.length + 1;

      setLayers([
        ...layers,
        {
          id: newLayerId,
          name: `Layer ${newLayerId}`,
          selectedColor: "#4B4B4B",
          tappableContent: null,
          selectedImage: null,
        },
      ]);
      dispatch(setCount(layers.length + 1));
    };

    const toggleView = () => {
      setIsSwiperView(!isSwiperView);
    };

    const handleClose = () => {
      onClose();
    };

    const handleLayerNameChange = (layerId, newName) => {
      setLayers(
        layers.map((layer) =>
          layer.id === layerId ? { ...layer, name: newName } : layer
        )
      );
    };

    const handleTappableClick = (layerId, contentImage1) => {
      onLayerClick(layerId);
      onLayerTappableClick(layerId);
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const filteredLayers = layers.filter((layer) =>
      layer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBackgroundClick = () => {
      navigate("/full-image-view", { state: { imageUrl } });
    };

    const handleAddBackgroundImageClick = () => {
      fileInputRef.current.click();
    };

    const handleBackgroundImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onChangeBackground(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const fetchTappableInfo = async (tappableId) => {
      const storedToken = localStorage.getItem("token");
      // const test = sessionStorage.getItem(tappableId); ///uudi

      // console.log("tappableIdtappableIdtappableId : 941 ", test);

      try {
        const response = await fetch(
          `${baseURL}/board/fetchEditTappableInfo?tappableId=${tappableId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.info("log 959");
          if (Array.isArray(data?.data?.data?.contentImagesLinks)) {
            const contentImagesLinks = data.data.data.contentImagesLinks;

            if (contentImagesLinks.length > 0) {
              if (contentImagesLinks.length >= 2) {
                setImageAddContent(contentImagesLinks[1]); // Set second image if array has 2 or more items
              } else {
                setImageAddContent(contentImagesLinks[0]); // Set first image if array has exactly 1 item
              }
            }
          }

          console.info(addcontentImage);

          // console.info(data.data.data.arr);
          // setImageAddContent(data);
          return data;
        } else {
          console.error("Failed to fetch tappable info");
          return null;
        }
      } catch (error) {
        console.error("Error fetching tappable info:", error);
        return null;
      }
    };

    const NavigateToAddContent = async (layer, layerId) => {
      onLayerClick(layerId);
      console.info(layerId);
      let tappableId = null;
      const getTappableId = sessionStorage.getItem(layerId);
      console.info("log 974");
      console.info(getTappableId);
      // let tappableId = null;
      ///front end side generate
      if (!getTappableId) {
        navigate("/add-content", {
          state: {
            layer,
            layerId,
          },
        });
      } else {
        const data = await fetchTappableInfo(getTappableId);
        console.info(990);
        console.info(layer);
        if (Array.isArray(layer)) {
          console.info("layers kd 991");
          layer.push(data);
          console.info(layer);
        }
        var layer = { ...layer, data };
        navigate("/add-content", {
          state: {
            layer,
          },
        });
      }
    };

    return (
      isVisible && (
        <div ref={ref} className="fixed bottom-[4.3rem] w-full left-0 z-50">
          {isTapActionOpen && <TapAction imageUrl={selectedImage} />}
          {isAddContentOpen && <AddContentPage />}
          <header className="flex justify-between bg-[#00000047] items-center">
            {/* Left-aligned section */}
            <div className="flex items-center text-lg text-white px-2">
              <span>Layers</span>
              <button
                className="text-white w-auto ml-2"
                onClick={handleNewLayerAddClick}
              >
                <FaPlus />
              </button>
            </div>

            {/* Right-aligned section */}
            <div className="flex items-center">
              <div className="relative mr-2 mt-2">
                <input
                  type="text"
                  placeholder="Search layers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="text-black px-2 py-1 pl-8"
                />
                <img
                  src={search}
                  alt="Search"
                  className="w-5 h-5 absolute mb-1 top-3.5 transform -translate-y-1/2 left-2"
                />
              </div>
              <img
                src={arrowspointingout}
                alt="Toggle View"
                className="w-5 h-5 mr-2 cursor-pointer"
                onClick={toggleView}
              />
              <img
                src={xmark}
                alt="Close"
                className="w-6 h-6 mr-3 cursor-pointer"
                onClick={handleClose}
              />
            </div>
          </header>

          <div className="bg-gray-800 text-white opacity-500 p-2">
            {isTapActionOpen ? (
              <TapAction
                imageUrl={selectedImage}
                onClose={() => setIsTapActionOpen(false)}
              />
            ) : (
              <>
                {isSwiperView ? (
                  <Swiper
                    onSwiper={(swiper) => {
                      swiperInstanceRef.current = swiper;
                    }}
                    slidesPerView={1}
                    spaceBetween={10}
                    scrollbar={{ hide: false, draggable: true }}
                    modules={[Scrollbar]}
                    loop={false}
                    className="layer-swiper"
                    navigation
                  >
                    {filteredLayers.map((layer) => (
                      <SwiperSlide key={layer.id}>
                        <div
                          className={`relative flex flex-col space-y-1 ${
                            layer.id === selectedLayerId ? "bg-highlight" : ""
                          }`}
                        >
                          <div
                            className="flex items-center h-9 justify-between p-2 bg-[#4B4B4B] relative"
                            style={{
                              backgroundColor: layer.selectedColor,
                              borderRadius: "0.25rem",
                            }}
                          >
                            <input
                              type="text"
                              value={layer.name}
                              onChange={(e) =>
                                handleLayerNameChange(layer.id, e.target.value)
                              }
                              className="text-sm bg-transparent border-none outline-none text-white"
                            />

                            <div
                              className={`flex items-center h-8 transition-transform duration-300 ease-in-out bg-[#4B4B4B] absolute ${
                                colorPanelVisible && currentLayerId === layer.id
                                  ? "transform translate-x-0 right-0"
                                  : "transform translate-x-full right-[11rem]"
                              }`}
                              style={{
                                width: colorPanelVisible ? "auto" : "auto",
                              }}
                            >
                              {!colorPanelVisible && (
                                <>
                                  <button
                                    onClick={() =>
                                      setLayerIsClicked(!layerIsClicked)
                                    }
                                    className="p-2"
                                  >
                                    <img
                                      src={eye}
                                      className="h-[10px] w-[10px]"
                                      alt="Eye Icon"
                                    />
                                  </button>
                                  <button
                                    onClick={handleNewLayerAddClick}
                                    className="p-0 ml-2"
                                  >
                                    <img
                                      src={pin}
                                      className="h-8 w-8"
                                      alt="Pin Icon"
                                    />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLayerDeleteClick(layer.id);
                                    }}
                                    className="p-1 ml-2"
                                  >
                                    <img
                                      src={deletee}
                                      className="w-[29px]"
                                      alt="Delete Icon"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleColorCircleClick(layer.id)
                                    }
                                    className="p-1 ml-2 left-20"
                                  >
                                    <img
                                      src={colorcircle}
                                      className="w-[25px]"
                                      alt="Color Circle Icon"
                                    />
                                  </button>
                                </>
                              )}

                              {colorPanelVisible &&
                                currentLayerId === layer.id && (
                                  <div className="absolute right-0 top-0">
                                    <div className="overflow-y-auto">
                                      <ColorPanel
                                        onSelectColor={handleColorSelect}
                                        onClose={() =>
                                          setColorPanelVisible(false)
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1">
                            <button
                              className={`flex flex-col items-center justify-center  bg-[#4B4B4B] ${
                                layer.id === selectedLayerId
                                  ? "border-2 border-blue-500"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: layer.selectedColor,
                                borderRadius: "0.25rem",
                              }}
                              onClick={() => handleTappableClick(layer.id)}
                            >
                              <label htmlFor={`fileInput${layer.id}`}>
                                {renderTappableContent(
                                  layer.tappableContent,
                                  layer.id
                                )}
                              </label>
                            </button>
                            <button
                              className="flex flex-col items-center justify-center  bg-[#4B4B4B]"
                              style={{
                                backgroundColor: layer.selectedColor,
                                borderRadius: "0.25rem",
                              }}
                              onClick={() => handleTapActionClick(layer)}
                            >
                              <img src={AddAction} alt="Add Action" />
                            </button>
                            {/* 
                                here want to display the image
                                 */}
                            <button
                              className="flex flex-col items-center justify-center bg-[#4B4B4B]"
                              style={{
                                backgroundColor: layer.selectedColor,
                                borderRadius: "0.25rem",
                              }}
                              onClick={() =>
                                NavigateToAddContent(layer, layer.id)
                              }
                            >
                              {renderTappableContentRightSide(
                                layer.tappableContent,
                                layer.id
                              )}

                              {/* <img
                                className="w-[8vw] h-[17vh]"
                                // src={AddContent}
                                // src={AddContent}
                                alt="Add Content"
                              /> */}
                            </button>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                    <SwiperSlide key="background-layer">
                      <div
                        className="relative flex flex-col space-y-1"
                        style={{
                          backgroundColor: "#4B4B4B",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <div
                          className="flex items-center h-9 justify-between p-2"
                          style={{
                            backgroundColor: "#4B4B4B",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <span className="text-sm bg-transparent border-none text-nowrap outline-none text-white">
                            Background Image
                          </span>
                          <button
                            className="p-2"
                            onClick={handleAddBackgroundImageClick}
                          ></button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleBackgroundImageChange}
                          />
                        </div>
                        <div className="flex justify-center item-center pb-4">
                          <img
                            src={imageUrl}
                            alt="Background"
                            className="cursor-pointer max-w-[300px] max-h-[130px] object-contain"
                            onClick={handleBackgroundClick}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                ) : (
                  <div className="flex flex-col space-y-1 m-3 max-h-[70vh] overflow-y-auto">
                    {filteredLayers.map((layer) => (
                      <div
                        className={`relative flex flex-col space-y-1 ${
                          layer.id === selectedLayerId ? "bg-highlight" : ""
                        }`}
                      >
                        <div
                          className="flex items-center h-9 justify-between p-2 bg-[#4B4B4B] relative"
                          style={{
                            backgroundColor: layer.selectedColor,
                            borderRadius: "0.25rem",
                          }}
                        >
                          <input
                            type="text"
                            value={layer.name}
                            onChange={(e) =>
                              handleLayerNameChange(layer.id, e.target.value)
                            }
                            className="text-sm bg-transparent border-none outline-none text-white"
                          />

                          <div
                            className={`flex items-center h-8 transition-transform duration-300 ease-in-out bg-[#4B4B4B] absolute ${
                              colorPanelVisible && currentLayerId === layer.id
                                ? "transform translate-x-0 right-1"
                                : "transform translate-x-full right-[11rem]"
                            }`}
                            style={{
                              width: colorPanelVisible ? "auto" : "auto",
                            }}
                          >
                            {!colorPanelVisible && (
                              <>
                                <button
                                  onClick={() =>
                                    setLayerIsClicked(!layerIsClicked)
                                  }
                                  className="p-2"
                                >
                                  <img
                                    src={eye}
                                    // className="h-[10px] w-[10px]"
                                    alt="Eye Icon"
                                  />
                                </button>
                                <button
                                  onClick={handleNewLayerAddClick}
                                  className="p-0 ml-2"
                                >
                                  <img
                                    src={pin}
                                    className="h-8 w-8"
                                    alt="Pin Icon"
                                  />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLayerDeleteClick(layer.id);
                                  }}
                                  className="p-1 ml-2"
                                >
                                  <img
                                    src={deletee}
                                    className="w-[29px]"
                                    alt="Delete Icon"
                                  />
                                </button>
                                <button
                                  onClick={() =>
                                    handleColorCircleClick(layer.id)
                                  }
                                  className="p-1 ml-2 left-20"
                                >
                                  <img
                                    src={colorcircle}
                                    className="w-[25px]"
                                    alt="Color Circle Icon"
                                  />
                                </button>
                              </>
                            )}

                            {colorPanelVisible &&
                              currentLayerId === layer.id && (
                                <div className="absolute right-0 top-0">
                                  <div className="overflow-y-auto">
                                    <ColorPanel
                                      onSelectColor={handleColorSelect}
                                      onClose={() =>
                                        setColorPanelVisible(false)
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            className={`flex flex-col items-center justify-center  bg-[#4B4B4B] ${
                              layer.id === selectedLayerId
                                ? "border-2 border-blue-500"
                                : ""
                            }`}
                            style={{
                              backgroundColor: layer.selectedColor,
                              borderRadius: "0.25rem",
                            }}
                            onClick={() => handleTappableClick(layer.id)}
                          >
                            <label htmlFor={`fileInput${layer.id}`}>
                              {renderTappableContent(
                                layer.tappableContent,
                                layer.id
                              )}
                            </label>
                          </button>
                          <button
                            className="flex flex-col items-center justify-center  bg-[#4B4B4B]"
                            style={{
                              backgroundColor: layer.selectedColor,
                              borderRadius: "0.25rem",
                            }}
                            onClick={() => handleTapActionClick(layer)}
                          >
                            <img src={AddAction} alt="Add Action" />
                          </button>
                          <button
                            className="flex flex-col items-center justify-center  bg-[#4B4B4B]"
                            style={{
                              backgroundColor: layer.selectedColor,
                              borderRadius: "0.25rem",
                            }}
                            onClick={() =>
                              NavigateToAddContent(layer, layer.id)
                            }
                          >
                            {renderTappableContentRightSide(
                              layer.tappableContent,
                              layer.id
                            )}
                            {/* <img src={AddContent} alt="Add Content" /> */}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div
                      className="relative flex flex-col space-y-1"
                      style={{
                        backgroundColor: "#4B4B4B",
                        borderRadius: "0.25rem",
                        padding: "10px",
                      }}
                    >
                      <div
                        className="flex items-center h-9 justify-between p-2"
                        style={{
                          backgroundColor: "#4B4B4B",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <span className="text-sm bg-transparent text-nowrap border-none outline-none text-white">
                          Background Image
                        </span>
                        <button
                          className="p-2"
                          onClick={handleAddBackgroundImageClick}
                        ></button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleBackgroundImageChange}
                        />
                      </div>
                      <div className="flex justify-center item-center">
                        <img
                          src={imageUrl}
                          alt="Background"
                          className="cursor-pointer max-w-[300px] max-h-[130px] object-contain"
                          onClick={handleBackgroundClick}
                        />
                      </div>
                    </div>
                    {filteredLayers.length === 0 && (
                      <div className="text-center text-white">
                        No layers found.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )
    );
  }
);

export default LayersPanel;
