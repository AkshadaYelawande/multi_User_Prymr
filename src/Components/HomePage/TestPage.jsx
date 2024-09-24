import React from "react";
import flagicon from "../../assets/flag.svg";
import blockicon from "../../assets/block.svg";
import attachmenticon from "../../assets/attachment.svg";
import plus from "../../assets/plusCircle.svg";
import line from "../../assets/Line23.svg";

const TestPage = () => {
  return (
    <div className="bg-[#393939]  w-[50vw] rounded-[20px] m-auto">
      <span className="flex py-3  p-1 px-4 text-white gap-3">
        <img src={plus} />
        Follow Creative
      </span>
      <span className="flex p-1 px-4 text-white gap-3">
        <img src={attachmenticon} />
        Follow Board
      </span>
      <img src={line} className="px-6 p-2" />
      <span className=" flex px-4 p-2 gap-3 text-red-600">
        <img src={blockicon} alt="Block" />
        Block
      </span>
      <span className="text-red-600  px-2 flex gap-3 ">
        <img src={flagicon} alt="Report" />
        Report Post
      </span>
    </div>
  );
};

export default TestPage;
