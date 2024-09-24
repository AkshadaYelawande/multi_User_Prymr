import React, { useState } from "react";
import copy from "../../assets/CopyIcon.svg";
import smallavatar from "../../assets/smallAvatar.svg";
import storyframe from "../../assets/storyFrame.svg";
import { LuShare2 } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import share from "../../assets/Share.svg";
import X from "../../assets/x-mark.svg";
import tumbler from "../../assets/tumbler.svg";
import instagram from "../../assets/instagram.svg";
import handleBackk from "../../assets/handleBack.svg";
import { FaRegCopy } from "react-icons/fa";
import flower from "../../assets/HD-wallpaper-white-flower-daisy-flores-flowers-sunflowers-vintage-thumbnail.jpg";
import Toastify from "toastify-js";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useToastManager } from "../Context/ToastContext";

const Share = () => {
  const toast = useToastManager();
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjusted for better layout
    slidesToScroll: 1,
  };

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(link);
  //   setCopied(true);
  //   Toastify({
  //     text: "Link copied!",
  //     duration: 2000,
  //     close: true,
  //     gravity: "top",
  //     position: "right",
  //     style: {
  //       background: "linear-gradient(to right, #00b09b, #96c93d)",
  //     },
  //   }).showToast();
  // };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast("Link copied!");
        toast("Link copied!");
        console.log("Link copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleShare = () => {
    console.log("Sharing to Instagram...");
    window.open("https://www.instagram.com", "_blank");
    setIsShared(true);
  };
  const handleBack = () => {
    navigate("/prymr");
  };
  return (
    <div>
      <div class="w-[430px] h-[932px] relative bg-[#2a2a2a] backdrop-blur-[30px]">
        <div class="left-[29px] top-[473px] absolute flex-col justify-start items-start gap-[22px] inline-flex max-w-md mx-auto md:max-w-lg lg:max-w-xl">
          <div class="h-[23.50px] relative">
            <div class="left-[37px] flex gap-1 top-0 absolute text-nowrap text-white text-base font-bold font-['Nunito'] tracking-tight">
              <img src={instagram} className="ml-1" />
              <p className="text-md mb-2 mt-2 ml-1" onClick={handleShare}>
                Share via Instagram
              </p>
            </div>
            <div class="w-[23px] h-[23px] left-0 top-[0.50px] absolute"></div>
          </div>
          <div class="w-[198px] h-8 relative">
            <div class="left-[40px] flex gap-1 top-[5px] absolute text-white text-base font-bold font-['Nunito'] tracking-tight">
              <img src={tumbler} className="" />
              <p className="text-md text-nowrap mt-1">Share via Tumbler</p>
            </div>
            <div class="w-8 h-8 left-0 top-0 absolute justify-center items-center inline-flex">
              <div class="w-8 h-8 relative"></div>
            </div>
          </div>

          <div class="text-white flex gap-1 text-base font-bold font-['Nunito'] tracking-tight">
            <img src={share} className="" />
            <p className="text-md mt-2 ">Copy Link</p>
          </div>
          <div class="w-[349px] h-[55.53px] pt-[5px] flex-col justify-start items-start gap-[15px] flex">
            <div class="self-stretch h-[42px] flex-col justify-start items-start gap-[5px] flex">
              <div class="self-stretch h-[42px] flex-col justify-start items-start gap-2 flex">
                <div class="self-stretch grow shrink basis-0 bg-[#313333] rounded shadow justify-start items-center inline-flex">
                  <div class="grow shrink basis-0 h-[50px] justify-start items-center flex">
                    <div class="grow shrink basis-0 h-[50px] px-4 py-3.5 justify-start items-center gap-2.5 flex">
                      <div class="grow shrink basis-0 text-white text-base font-normal font-['Nunito']">
                        <input
                          type="text"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          className="w-[100%]  bg-transparent  py-3.5 rounded-sm placeholder:text-md  text-white text-center"
                          placeholder="https://prymer.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-3.5 bg-[#2d78e6] justify-start items-center gap-2.5 flex">
                    <div class="w-4 h-4 relative">
                      <FaRegCopy className="text-white" />
                    </div>
                    <div class="text-center text-white text-[15px] font-medium font-['Inter'] tracking-tight">
                      <p onClick={handleCopy}>Copy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-[366px] h-[0px] border border-white/10"></div>
          <div className="flex gap-2 mt-2  text-white">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="text-center">
                <img
                  src={smallavatar}
                  alt="smallavatar"
                  className="h-10 w-10 rounded-full mx-auto"
                />
                <p>Lipita</p>
                <small className="text-gray-400 text-xs">@lipita.com</small>
              </div>
            ))}
          </div>
        </div>
        <div class="w-[264px] h-[348px] left-[83px] top-[107px] absolute bg-[#ff0000] rounded-[14px]"></div>
        <div class="w-[430px] h-[31px] left-0 top-[901px] absolute bg-[#2a2a2a]"></div>
        <div class="pl-[15px] pr-px pt-10 pb-[10.43px] left-0 top-0 absolute bg-[#2a2a2a] backdrop-blur-[14px] justify-end items-center inline-flex">
          <div class="self-stretch justify-start items-center gap-[9px] inline-flex">
            {/* <div class="w-[38.57px] h-[38.57px] p-[14.47px] bg-black/0 rounded-[36.16px] border-white justify-center items-center gap-[12.05px] flex"></div> */}
            {/* <div class="h-[27px] justify-start items-center gap-[7px] flex"> */}
            {/* <div class="justify-start items-start gap-[11px] flex"> */}
            <div class="text-white flex gap-1  text-xl font-bold font-['Nunito'] capitalize tracking-tight">
              <img src={handleBackk} className="ml-1" onClick={handleBack} />
              <p className="text-md mt-1 ">Share </p>
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
