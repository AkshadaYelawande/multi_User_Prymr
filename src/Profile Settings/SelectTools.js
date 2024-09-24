import React from "react";
import cross from "../assets/images/cross.png";
import undo from "../assets/images/undo.svg";
import redo from "../assets/images/redo.svg";
import queue from "../assets/images/queue-list.svg";
import crop from "../assets/images/crop.svg";
import rotate from "../assets/images/arrow-path.png";
import full_screen from "../assets/images/arrows-pointing-out.png";
import selective from "../assets/images/cursor-arrow-rays.svg";
import paint_brush from "../assets/images/paint-brush.svg";
import photo from "../assets/images/photo.svg";
import trending from "../assets/images/arrow-trending-up.svg";
import swatch from "../assets/images/swatch.svg";
import rectangle_group from "../assets/images/rectangle-group.svg";
import puzzle from "../assets/images/puzzle-piece.svg";
import square from "../assets/images/square-3-stack-3d.svg";
import sparkles from "../assets/images/sparkles.svg";
import adjustments from "../assets/images/adjustments-horizontal.svg";
import cloud from "../assets/images/cloud.svg";
import bulb from "../assets/images/light-bulb.svg";
import cube_transparent from "../assets/images/cube-transparent.svg";
import cube from "../assets/images/cube.svg";
import fire from "../assets/images/fire.svg";
import sun from "../assets/images/sun.svg";

const toolList = [
  { name: "Tune Image", img: queue },
  { name: "Details", img: photo },
  { name: "Curves", img: trending },
  { name: "White Balances", img: swatch },
  { name: "Crop", img: crop },
  { name: "Rotate", img: rotate },
  // { name: "Perspective", img: rectangle_group },
  // { name: "Expand", img: full_screen },
  { name: "Selective", img: selective },
  { name: "Brush", img: paint_brush },
  { name: "Healing", img: puzzle },
  { name: "HDR Scape", img: square },
  { name: "Glamour", img: sparkles },
  { name: "Tonal Contrast", img: adjustments },
  { name: "Drama", img: cloud },
  { name: "Vintage", img: bulb },
  { name: "Grainy Film", img: cube_transparent },
  { name: "Retrolux", img: cube },
  { name: "Grunge", img: fire },
  { name: "Black & White", img: sun },
];

const SelectTools = ({
  onClose,
  onUndo,
  onRedo,
  onTuneImage,
  onCrop,
  onRotate,
  onSelective,
  onBrush,
  onDetails,
  onCurves,
  onWhiteBalances,
  onPerspective,
  onFullScreenOpen,
  onHealing,
  onTonalContrast,
  onGlamour,
  onGrainyFilm,
  onRetrolux,
  onDrama,
  onHDRScape,
  onBlackAndWhite,
  onVintage,
  onGrunge,
}) => {
  const handleToolClick = (toolName) => {
    onClose();
    if (toolName === "Tune Image") {
      onTuneImage();
    } else if (toolName === "Crop") {
      onCrop();
    } else if (toolName === "Rotate") {
      onRotate();
    } else if (toolName === "Selective") {
      onSelective();
    } else if (toolName === "Brush") {
      onBrush();
    } else if (toolName === "Details") {
      onDetails();
    } else if (toolName === "Curves") {
      onCurves();
    } else if (toolName === "White Balances") {
      onWhiteBalances();
    } else if (toolName === "Perspective") {
      onPerspective();
    } else if (toolName === "Expand") {
      onFullScreenOpen(true);
    } else if (toolName === "Healing") {
      onHealing(); // Call the onHealing callback when the Healing tool is clicked
    } else if (toolName === "Tonal Contrast") {
      onTonalContrast();
    } else if (toolName === "Glamour") {
      onGlamour();
    } else if (toolName === "Grainy Film") {
      onGrainyFilm();
    } else if (toolName === "Retrolux") {
      onRetrolux();
    } else if (toolName === "Drama") {
      onDrama();
    } else if (toolName === "HDR Scape") {
      onHDRScape();
    } else if (toolName === "Black & White") {
      onBlackAndWhite();
    } else if (toolName === "Vintage") {
      onVintage();
    } else if (toolName === "Grunge") {
      onGrunge();
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-neutral-800 bg-opacity-80 backdrop-blur-sm flex flex-col z-20">
      <div className="w-full h-[67px] p-5 flex items-center">
        <div className="w-6 h-6 relative cursor-pointer" onClick={onClose}>
          <img src={cross} alt="close" />
        </div>
        <div className="text-white text-xl font-bold font-['Nunito']">
          Select Tool
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-wrap justify-between gap-2">
          {toolList.map((tool) => (
            <div
              key={tool.name}
              className="w-1/5 min-w-[60px] flex flex-col items-center"
            >
              <div
                onClick={() => handleToolClick(tool.name)}
                style={{ cursor: "pointer" }}
                className="w-[63px] h-[63px] p-[15px] bg-gradient-to-r from-[#C6C6C666] via-[#404040B1] to-[#000000] rounded-[15px] border backdrop-blur-sm flex justify-center items-center mb-1"
              >
                <img
                  src={tool.img}
                  alt={tool.name}
                  className="w-[33px] h-[33px]"
                />
              </div>
              <div className="text-center text-white text-opacity-80 text-[10px] sm:text-[12px] font-bold font-['Nunito']">
                {tool.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-[40px] bg-black flex justify-center items-center">
        <div
          className="px-2 flex flex-col items-center cursor-pointer"
          onClick={onUndo}
        >
          <img src={undo} alt="undo" className="w-5 h-5" />
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Undo
          </div>
        </div>
        <div
          className="px-2 flex flex-col items-center cursor-pointer"
          onClick={onRedo}
        >
          <img src={redo} alt="redo" className="w-5 h-5" />
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Redo
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTools;
