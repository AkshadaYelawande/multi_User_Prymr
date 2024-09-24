import React, { useState } from "react";
import handleBack from "../../../../assets/handleBack.svg";
import LOGO_white from "../../../../assets/LOGO_white.svg";
import plusGrayCircle from "../../../../assets/plusGrayCircle.svg";
import BoardBuilderText from "../../../../assets/BoardBuilderText.svg";
import savedBoards from "../../../../assets/savedBoards.svg";
import ADS from "../../../../assets/ADS.svg";
import { useNavigate } from "react-router";

const Ads = () => {
  const [buttonIsClicked, setButtonIsClicked] = useState(null);
  const navigate = useNavigate();

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
  return (
    <div className="container">
      <div className="container">
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
        </div>

        <div className=" flex border-white w-auto">
          <button
            className="text-[#757575] flex items-center justify-center font-bold text-xl"
            onClick={handleNewBoardCreator}
          >
            <img
              src={plusGrayCircle}
              className="-m-1 mr-2   sm:w-5 sm:h-5 lg:w-10 lg:h-10"
            />
            <span
              className={`text-base font-extrabold ${
                buttonIsClicked === "NEW" ? "text-yellow-500" : "text-gray-700"
              }`}
            >
              NEW
            </span>
          </button>
          <button
            className="text-[#757575] flex items-center justify-center font-bold text-xl"
            onClick={handleSaved}
          >
            <img
              src={savedBoards}
              className="-m-1 mr-2  sm:w-5 sm:h-5 lg:w-10 lg:h-10"
            />
            <span
              className={`text-base font-extrabold ${
                buttonIsClicked === "SAVED"
                  ? "text-yellow-500"
                  : "text-gray-700"
              }`}
            >
              SAVED
            </span>
          </button>
          <button
            className="text-[#757575] flex items-center justify-center font-bold text-xl"
            onClick={handleADS}
          >
            <img src={ADS} className="-m-1 mr-2  sm:w-5 sm:h-5 lg:w-9 lg:h-9" />
            <span
              className={`text-base font-extrabold ${
                buttonIsClicked === "ADS" ? "text-yellow-500" : "text-gray-700"
              }`}
            >
              ADS
            </span>
          </button>
        </div>
        <div
          className="bg-[#FFF500] m-3 ml-10 mr-10 h-10 flex items-center justify-center text-black w-auto rounded-full font-bold"
          onClick={handleNewBoardCreator}
        >
          BUILD NEW BOARD
        </div>
      </div>
    </div>
  );
};

export default Ads;
