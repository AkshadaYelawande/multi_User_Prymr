import React from "react";
import editToolNavbar from "../../assets/settings.png";
import { GrHomeRounded } from "react-icons/gr";
import { LuMessagesSquare } from "react-icons/lu";
import plus from "../../assets/plus.svg";
import smallavatar from "../../assets/smallAvatar.svg";
import cart from "../../assets/ShoppingCartpng.png";
import { useNavigate } from "react-router";
import search from "../../assets/search.svg";
import uparrow from "../../assets/uparrow.png";
import arrowspointingout from "../../assets/arrowspointingout.svg";
import arrowpointingIn from "../../assets/arrowpointingIn.svg";
import zoomOutMinus from "../../assets/zoomOutMinus.svg";
import zoomInPlus from "../../assets/zoomOutPlus.svg";
import poweredByPrymr from "../../assets/poweredByPrymr.svg";

const DesktopNavbar = () => {
  const navigate = useNavigate();
  const handleArrow = () => {
    navigate("/homePage");
  };
  return (
    <div className="fixed bottom-0  w-[68%] text-[#6B6B6B] flex h-18 items-center justify-between ">
      <div className="flex gap-3">
        <div className="flex ml-2 bg-[#262626] pr-2 rounded-full items-center relative">
          <img
            className="rounded-full w-8 h-8"
            src={smallavatar}
            alt="Profile"
          />{" "}
          <img src={uparrow} onClick={handleArrow} />
        </div>
        <div className="">
          <img
            src={plus}
            className="  border rounded-full border-blue-600 w-8 h-8"
          />
        </div>
        <div className="">
          <img src={editToolNavbar} className=" w-8 h-8" />
        </div>
        <div className="">
          <img src={cart} className=" w-8 h-8" />
        </div>
      </div>

      <div
        className="flex"
        style={{
          left: "20%",
          transform: `translateX(-20%)`,
        }}
      >
        <img src={arrowpointingIn} className=" w-10 h-10" />
        <img src={zoomOutMinus} className="p-2 w-10 h-10" />
        <h1 className="text-white mt-2">100%</h1>
        <img src={zoomInPlus} className="p-2 w-10 h-10" />
        <img src={arrowspointingout} className="p-2 w-10 h-10" />
      </div>

      <div>
        <img src={poweredByPrymr} className="" />
      </div>
    </div>
  );
};

export default DesktopNavbar;