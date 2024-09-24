import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import "./board.css";
import { useNavigate } from "react-router";
import SaveBoard from "./SaveBoard";
import NewBoard from "./CreateNewBoard/NewBoard";
import BoardScreen from "./EditBoard";

import deleteShirt from "../../assets/deleteShirt.svg";
import arrowspointingout from "../../assets/arrowspointingout.svg";
import LOGO_white from "../../assets/LOGO_white.svg";
import BoardBuilderText from "../../assets/BoardBuilderText.svg";
import handleBack from "../../assets/handleBack.svg";
import plusGrayCircle from "../../assets/plusGrayCircle.svg";
import savedBoards from "../../assets/savedBoards.svg";
import ADS from "../../assets/ADS.svg";
import deleteBai from "../../assets/deleteBai.svg";
import deleteFoodFrame from "../../assets/deleteFoodFrame.svg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
// import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import Home from "../HomePage/Home";

// ------------------------------REWORK------------------------------------------

const BoardBuilder = () => {
  const navigate = useNavigate();
  const [buttonIsClicked, setButtonIsClicked] = useState(null);

  const handleBackFunction = () => {
    navigate("/prymr");
  };
  const handleNewBoardCreator = () => {
    navigate("/create-new-board");
    setButtonIsClicked("NEW");
  };

  const handleSaved = () => {
    setButtonIsClicked("SAVED");
    navigate("/create-new-board-saved");
  };

  const handleADS = () => {
    setButtonIsClicked("ADS");
    navigate("/create-new-board-ADS");
  };
  const imagesforsmallpost = [
    { src: deleteBai, alt: "Avatar 1" },
    { src: deleteBai, alt: "Avatar 2" },
    { src: deleteBai, alt: "Avatar 3" },
  ];
  return (
    <>
      {/* <div className=" lg:w-[30%] lg:hidden ">
        <div className="flex items-center">
          <button className="w-auto h-auto" onClick={handleBackFunction}>
            <img src={handleBack} className="text-3xl border-white" />
          </button>
          <div className="flex items-center justify-between flex-grow">
            <img src={LOGO_white} className="ml-1" />
            <img
              src={BoardBuilderText}
              className=" m-4 p-3 h-auto -pt-2 text-sm w-auto ml-auto"
            />
          </div>
        </div> */}

      {/* <div className=" flex items-center justify-center  border-white w-auto">
          <div
            className="text-[#757575] px-12 flex items-center justify-center font-bold text-xl"
            onClick={handleNewBoardCreator}
          >
            <img src={plusGrayCircle} className="-m-1 mr-2  sm:w-5 sm:h-5 lg:w-10 lg:h-10" />
            <span className={`text-base font-extrabold ${
                  buttonIsClicked
                   === 'NEW' ? 'text-yellow-500' : 'text-gray-700'
                }`}> NEW</span>
          </div>
          <button className="text-[#757575] flex items-center justify-center font-bold text-xl"onClick={handleSaved}>
            <img src={savedBoards} className="-m-1 mr-2 sm:w-5 sm:h-5 lg:w-10 lg:h-10" />
            <span  className={`text-base font-extrabold ${
                  buttonIsClicked
                    === 'SAVED' ? 'text-yellow-500' : 'text-gray-700'
                }`} >SAVED</span>
          </button>

          <button className="text-[#757575] flex items-center justify-center font-bold text-xl" onClick={handleADS}>
            <img src={ADS} className="-m-1 mr-2  sm:w-5 sm:h-5 lg:w-9 lg:h-9" />
            <span className={`text-base font-extrabold ${
                  buttonIsClicked
                  === 'ADS' ? 'text-yellow-500' : 'text-gray-700'
                }`}>ADS</span>
          </button>
        </div> */}

      {/*         
      <div className=" flex border-white w-auto">
        <button
          className="text-[#757575] flex items-center justify-center font-bold text-xl"
          onClick={handleNewBoardCreator}
        >
          <img
            src={plusGrayCircle}
            className="-m-1 mr-2   sm:w-5 sm:h-5 lg:w-10 lg:h-10"
          />
        <span  className={`text-base font-extrabold ${
                  buttonIsClicked
                    === 'NEW' ? 'text-yellow-500' : 'text-gray-700'
                }`} >NEW</span>
        </button>
        <button className="text-[#757575] flex items-center justify-center font-bold text-xl" onClick={handleSaved}>
          <img
            src={savedBoards}
            className="-m-1 mr-2  sm:w-5 sm:h-5 lg:w-10 lg:h-10"
          />
         <span  className={`text-base font-extrabold ${
                  buttonIsClicked
                    === 'SAVED' ? 'text-yellow-500' : 'text-gray-700'
                }`} >SAVED</span>
        </button>
        <button className="text-[#757575] flex items-center justify-center font-bold text-xl" onClick={handleADS}>
          <img src={ADS} className="-m-1 mr-2  sm:w-5 sm:h-5 lg:w-9 lg:h-9" />
          <span className={`text-base font-extrabold ${
                  buttonIsClicked
                  === 'ADS' ? 'text-yellow-500' : 'text-gray-700'
                }`}>ADS</span>
        </button>
      </div> */}
      {/*  <div
          className="bg-[#FFF500] m-3 ml-10 mr-10 h-10 flex items-center justify-center text-black w-auto rounded-full font-bold"
          onClick={handleNewBoardCreator}
        >
          BUILD NEW BOARD
        </div>

        <h2 className="text-white px-4">SAVED BOARDS</h2>
        <div className="grid grid-cols-2 gap-4 p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-[#262626] p-4 rounded-lg">
              <div className="relative">
                <img src={deleteFoodFrame} className="rounded-md" alt="Food" />
                 <div className="absolute bottom-2 left-2 flex space-x-1">
                  <img
                    src={deleteBai}
                    className="h-6 w-6 rounded-full"
                    alt="Avatar"
                  />
                  <img
                    src={deleteBai}
                    className="h-6 w-6 rounded-full"
                    alt="Avatar"
                  />
                  <img
                    src={deleteBai}
                    className="h-6 w-6 rounded-full"
                    alt="Avatar"
                  />
                  <img
                    src={deleteBai}
                    className="h-6 w-6 rounded-full"
                    alt="Avatar"
                  />
                </div>
              <div className=" left-2 flex m-2 h-20 space-x-2">
                      <Swiper
                        spaceBetween={10}
                        slidesPerView="auto"
                        centeredSlides={true}
                      >
                        {imagesforsmallpost.map((image, index) => (
                          <SwiperSlide key={index}>
                            <img className="ml-1" key={index} src={image.src} />
                            <img src={deleteBai} className="ml-1 w-2 w-h" />
                            <img src={deleteBai} className="ml-1" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div> 
              </div>
              <div className="mt-2">
                <p className="bg-[#949494] rounded-lg px-2 py-1 text-sm text-black w-20 text-center">
                  Draft
                </p>
                <h3 className="text-md text-slate-200 mt-1">Title of Board</h3>
                <span className="text-slate-400 text-sm">
                  Last Edited: 12/10/2023
                </span>
              </div>
            </div>
          ))}
        </div>

         <Swiper
          slidesPerView={4}
          spaceBetween={20}
          freeMode={false}
          pagination={false} // Ensure pagination is explicitly set to false
          modules={[FreeMode, Pagination]}
          pagination={{
            clickable: false,
          }}

          // className="mySwiper"
        >
          {Array.from({ length: 7 }).map((_, index) => (
            <SwiperSlide>
              <div className="bg-[#262626] inline-block ">
                <div className="mt-2  h-auto p-2 rounded-md">
                  <img src={deleteFoodFrame} />
                  <div className="flex w-[40px]  mt-2 mb-2 ">
                    <img src={deleteBai} className=" ml-1" />
                    <img src={deleteBai} className="ml-1" />
                    <img src={deleteBai} className="ml-1" />
                    <img src={deleteBai} className="ml-1" />
                  </div>
                  <div>
                    <div className="text-slate-200">
                      <p className="bg-[#949494] sm:title-xs  mt-1 rounded-lg px-1 py-[2px] text-sm text-black w-10 text-center">
                        Draft
                      </p>
                      <div className=" text-md mt-1 float-left overflow-hidden whitespace-nowrap overflow-ellipsis sm:text-xs">
                        Title of Board
                      </div>
                      <br />
                      <div className="text-slate-400 mb-3 float-left text-sm overflow-hidden whitespace-nowrap overflow-ellipsis ">
                        Last Edited: 20/03/2002
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </SwiperSlide>
          ))}
          {/* {Array.from({ length: 4 }).map((_, index) => (
            <SwiperSlide key={index}>
              <div className="flex mt-2 bg-slate-800 p-2 rounded-md">
                <img src={deleteFoodFrame} />
                <img src={deleteBai} />
                <img src={deleteBai} />
                <img src={deleteBai} />
                <img src={deleteBai} />
              </div>
              <div className="flex justify-between">
                <div className="text-slate-200">
                  <p className="bg-[#949494] mt-1 rounded-lg px-1 py-[2px] text-sm text-black w-20 text-center">
                    Draft
                  </p>
                  <h3 className="text-xl font-semibold">
                    Another Swiper Array
                  </h3>
                  <span className="text-slate-400 text-sm">
                    Last updated: 21/03/2002
                  </span>
                </div>
                <BsThreeDotsVertical className="text-slate-200" />
              </div>
            </SwiperSlide>
          ))}  </Swiper>  

      <div className="flex m-4 ">
          <h1 className="text-white flex-grow-0">AD BUILDER</h1>
          <img src={arrowspointingout} className="ml-auto" />
        </div> 
      
        <div className="bg-[#262626] text-white">
          <div className="flex">
            <h1 className="text-[#13A63B] bg-[#233A29] rounded-full m-5 p-2 text-xs">
              PUBLISHED
            </h1>
            <h1 className="ml-auto m-5">Last Edited: 20/03/2002</h1>
          </div>
          <div className="ml-4 flex px-2">
            <img src={deleteShirt} alt="Delete Shirt" />
            <div className="px-6">
              <h1 className="text-2xl font-bold">Fake Froot T-Shirt</h1>
              <div>
                Screen Printed color Limited edition of 300 shipped within the
                next 2 weeks ... <p className="text-[#0085FF]">read more</p>
              </div>
              <div>
                <h1 className="flex mt-3 gap-2 mb-3 ">
                  $35.99
                  <span className="text-gray-500 line-through">$35.99</span>
                </h1>
              </div>
            </div>
          </div>
        </div> 
      </div>*/}

      {/* <div className=" lg:block lg:w-[70%] fixed right-0 top-0"> */}
      <NewBoard />
      {/* </div> */}
    </>
  );
};

export default BoardBuilder;
