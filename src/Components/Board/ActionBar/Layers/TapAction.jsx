import React from "react";
// import Xmark from "../../../../assets/x-mark.svg";
import infoOverlay from "../../../../assets/infoOverlay.svg";
import switchh from "../../../../assets/switch.svg";
import linkToBoad from "../../../../assets/linkToBoad.svg";
import questionmarkcircle from "../../../../assets/questionmarkcircle.svg";
import downArrow from "../../../../assets/downArrow.svg";
import eye from "../../../../assets/Eye.svg";
import deletee from "../../../../assets/delete.svg";
import hamburger from "../../../../assets/hamburger.svg";
const TapAction = () => {
  console.log("Tap action");
  return (
    <>
      <div className="bg-[#6C6C6C] w-auto h-auto text-white">
        <div className="flex items-center h-9 justify-between p-2 bg-gray-700 rounded">
          <h3 className="text-sm">Layer 01</h3>
          <div className="flex h-8 bg-[#6C6C6C]">
            <button onClick={() => setLayerIsClicked(!layerIsClicked)}>
              <img src={eye} className="items-center -mt-1 h-6 w-6" />
            </button>
            {/* onClick={handleLayerAddClick} */}
            <button>
              <img src={deletee} className="items-center -mt-1 h-6 w-6" />
            </button>
            <button>
              <img src={hamburger} className="items-center -mt-1 h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex">
          <img src={downArrow} className=" px-3 py-2" />
          <h1> Close </h1>
        </div>
      </div>
      <div
        className="px-1 -py-5 text-white bg-gray-800 bg-opacity-75
      justify-center"
      >
        <div className="flex scroll-pt-20">
          <h1 className="m-2"> SELECT BUTTON ACTION</h1>
        </div>
        <div className="flex px-8  m-4  gap-1  items-center py-2 rounded-[20px] border-[1px] p-[10px_15px_10px_15px]">
          <img src={infoOverlay} alt="" className="mr-2 " />
          <div className="flex flex-col justify-center  ">
            <h3>Info Overlay</h3>
          </div>
          <img src={questionmarkcircle} alt="" className="ml-auto" />
        </div>

        {/* <div className="flex px-8  m-4  gap-1  items-center py-2 rounded-[20px] border-[1px] p-[0px_5px_5px_1px]">
          <img src={switchh} className="mr-2" />
          <div className="flex text-wrap flex-col justify-center">
            <h3> Switch </h3>
          </div>
          <img src={questionmarkcircle} alt="" className="ml-auto" />
        </div>

        <div className="flex px-8  m-4  gap-1  items-center py-2 rounded-[20px] border-[1px] p-[10px_15px_10px_15px]">
          <img src={linkToBoad} className="mr-2" />
          <div className="flex  flex-col justify-center">
            <h3>Link To A Board </h3>
          </div>

          <img src={questionmarkcircle} alt="" className="ml-auto" />
        </div> */}
      </div>{" "}
    </>
  );
};

export default TapAction;
