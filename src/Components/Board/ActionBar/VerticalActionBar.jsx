import React, { useState } from "react";

import info from "../../../assets/info.svg";
import share from "../../../assets/Share.svg";
import comment from "../../../assets/comment.svg";
import gift from "../../../assets/gift.svg";
import drops from "../../../assets/drops.svg";
import OnDrops from "../../../assets/ONdrops.svg";
import { useNavigate } from "react-router";

const VerticalActionBar = ({
  isTapsOn,
  toggleTaps,
  isDropsOn,
  toggleDrops,
}) => {
  // const [isHoveringActionBar, setIsHoveringActionBar] = useState(false);

  const navigate = useNavigate();
  const handleShare = () => {
    navigate("/share");
  };

  // const handleMouseEnterActionBar = () => {
  //   setIsHoveringActionBar(true);
  //   setIsActionBarVisible(true); // Ensure it stays visible when hovered
  // };

  // const handleMouseLeaveActionBar = () => {
  //   setIsHoveringActionBar(false);
  //   // Optionally set it to auto-hide again after some delay
  //   setTimeout(() => {
  //     if (!isHoveringActionBar) {
  //       setIsActionBarVisible(false);
  //     }
  //   }, 500);
  // };

  const handleGifts = () => {};
  return (
    <div className="w-[70.14px] right-0 bg-black h-full top-5 opacity-70 flex-col justify-center items-start gap-[8vh] inline-flex">
      <div className="self-stretch px-[7.67px] flex-col justify-start items-start gap-[20.11px] flex">
        <div className="self-stretch justify-start items-center inline-flex">
          <div className="text-white text-xl font-bold font-['Nunito'] flex ">
            <img src={info} alt="Preview" className="pl-2 py-2 w-11 h-11" />
          </div>
        </div>
        <div className="justify-start items-center inline-flex">
          <div className="text-white text-xl font-bold font-['Nunito'] flex gap-1">
            <img
              src={share}
              alt="Share"
              className="pl-2"
              onClick={handleShare}
            />
          </div>
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-[12vh] flex">
          <div className="self-stretch justify-start items-center inline-flex">
            <div className="text-white text-xl font-bold font-['Nunito'] flex gap-2 ">
              <img src={comment} alt="Comment" className="pl-2" />
            </div>
          </div>
          <div
            className="text-white text-xl font-bold font-['Nunito'] flex gap-1"
            onClick={handleGifts}
          >
            <img src={gift} alt="Gift" />
          </div>
        </div>
      </div>
      <div className="flex-col justify-start items-start gap-[1.53px] flex">
        <div className="w-[123.84px] justify-start items-center gap-[14.25px] inline-flex">
          <div className="text-white text-xl font-bold font-['Nunito'] flex-col flex gap-2">
            <img
              src={drops}
              alt="Drops"
              onClick={toggleDrops}
              className={`cursor-pointer pl-3 ${
                isDropsOn ? "filter-sky-blue" : ""
              }`}
            />
            <span className="text-xs flex pl-3">
              {isDropsOn ? "On" : "Off"}
            </span>
            <span className="text-sm pl-3">Drops</span>
          </div>
        </div>
        <div className="w-[123.84px] justify-start items-center gap-[15.34px] pt-5 inline-flex">
          <div className="text-white text-xl font-bold font-['Nunito'] flex flex-col gap-2">
            <img
              src={drops}
              alt="Taps"
              onClick={toggleTaps}
              className={`cursor-pointer pl-3 ${
                isTapsOn ? "filter-sky-blue" : ""
              }`}
            />
            <span className="text-xs flex pl-3">{isTapsOn ? "On" : "Off"}</span>
            <span className="text-sm pl-3">Taps</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalActionBar;
