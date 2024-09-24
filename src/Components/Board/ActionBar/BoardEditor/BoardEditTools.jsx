import React from "react";
import cross from "../../../../assets/images/cross.png";
import undo from "../../../../assets/images/undo.svg";
import redo from "../../../../assets/images/redo.svg";
import queue from "../../../../assets/images/queue-list.svg";
import crop from "../../../../assets/images/crop.svg";
import rotate from "../../../../assets/images/arrow-path.png";
import full_screen from "../../../../assets/images/arrows-pointing-out.png";
import selective from "../../../../assets/images/cursor-arrow-rays.svg";
import paint_brush from "../../../../assets/images/paint-brush.svg";
import photo from "../../../../assets/images/photo.svg";
import trending from "../../../../assets/images/arrow-trending-up.svg";
import swatch from "../../../../assets/images/swatch.svg";
import rectangle_group from "../../../../assets/images/rectangle-group.svg";
import puzzle from "../../../../assets/images/puzzle-piece.svg";
import square from "../../../../assets/images/square-3-stack-3d.svg";
import sparkles from "../../../../assets/images/sparkles.svg";
import adjustments from "../../../../assets/images/adjustments-horizontal.svg";
import cloud from "../../../../assets/images/cloud.svg";
import bulb from "../../../../assets/images/light-bulb.svg";
import cube_transparent from "../../../../assets/images/cube-transparent.svg";
import cube from "../../../../assets/images/cube.svg";
import fire from "../../../../assets/images/fire.svg";
import sun from "../../../../assets/images/sun.svg";

const toolList = [
  { name: "Tune Image", img: queue },
  { name: "Details", img: photo },
  { name: "Curves", img: trending },
  { name: "White Balances", img: swatch },
  { name: "Crop", img: crop },
  { name: "Rotate", img: rotate },
  { name: "Perspective", img: rectangle_group },
  { name: "Expand", img: full_screen },
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

const BoardEditTools = () => {
  return (
    <div className="w-full h-[732px] bg-neutral-800 bg-opacity-80 rounded-tl-[30px] rounded-tr-[30px] backdrop-blur-sm">
      <div className="w-full h-[67px] p-5 justify-between inline-flex">
        <div className="w-6 h-6 relative">
          <img src={cross} alt="cross" />
        </div>
        <div className="grow shrink basis-0 text-white text-xl font-bold font-['Nunito'] text-left">
          Select Tool
        </div>
      </div>

      <div className="flex flex-wrap w-full justify-between gap-[10px] p-4">
        {toolList.map((tool) => (
          <div
            key={tool.alt}
            className=""
            style={{ width: "calc((100% - 20px) / 5)" }}
          >
            <div
              className="w-[63px] h-[63px] p-[15px] bg-gradient-to-r from-[#C6C6C666] from-40% via-[#404040B1] via-69.47% to-[#000000] to-100% rounded-[15px] border backdrop-blur-sm justify-center items-center gap-2 inline-flex"
              style={{
                width: "calc(63px * 100%)",
                height: "calc(63px * 100%)",
              }}
            >
              <div
                className="relative"
                style={{
                  width: "calc(33px * 100%)",
                  height: "calc(33px * 100%)",
                }}
              >
                <img src={tool.img} alt={tool.alt} />
              </div>
            </div>
            <div className="text-center text-white text-[12px] sm:text-sm font-bold font-['Nunito']">
              {tool.name}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-[40px] fixed bottom-0 left-0 right-0 z-10 justify-center items-end inline-flex bg-black">
        <div className="w-10 px-2 rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
          <div className="w-5 h-5 justify-center items-center inline-flex">
            <div className="w-5 h-5 relative">
              <img src={undo} alt="undo" />
            </div>
          </div>
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Undo
          </div>
        </div>
        <div className="w-10 px-2 rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
          <div className="w-5 h-5 justify-center items-center inline-flex">
            <div className="w-5 h-5 relative">
              <img src={redo} alt="redo" />
            </div>
          </div>
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Redo
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardEditTools;
