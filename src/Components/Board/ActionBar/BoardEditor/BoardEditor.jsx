import React from "react";

import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons";

const BoardEditor = () => {
  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <RxCross2 className="text-3xl mr-2" />
          <span className="text-xl">Board Editor</span>
        </div>
        <div className="flex items-center">
          <RxCross2 className="text-2xl mx-2" />
          <RxCross2 className="text-2xl mx-2" />
          <RxCross2 className="text-2xl mx-2" />
          <RxCross2 className="text-2xl mx-2" />
          <RxCross2 className="text-2xl mx-2" />
        </div>
        <div className="flex items-center">
          <RxCross2 className="text-2xl mx-2" />
          <span className="mx-1">Undo</span>
          <RxCross2 className="text-2xl mx-2" />
          <span className="mx-1">Redo</span>
        </div>
      </div>
      <div className="text-center">
        <p className="mt-2">Crop</p>
        <p className="mt-2">Rotate</p>
        <p className="mt-2">Tune Image</p>
        <p className="mt-2">Selective</p>
        <p className="mt-2">Brush</p>
      </div>
    </div>
  );
};

export default BoardEditor;
