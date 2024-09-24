import React from "react";
import smallAvtar from "../../assets/smallAvatar.svg";

const Sidebar = () => {
  return (
    <div className="container bg-[#4C4B4B] w-285 h-926 top--4675 left-33612 py-32 gap-20">
      <div className="w-fill h-hug p-0 md:p-20 gap-12 ">
        <img src={smallAvtar} />
        <div className="w-285 h-679.51 gap-10"></div>
      </div>
    </div>
  );
};

export default Sidebar;
