import React from "react";
import xmark from "../../../../assets/x-mark.svg";

const DeletePopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-[321px] h-[198px] bg-[#222222] rounded-3xl relative p-6">
        <div className="text-white text-sm font-medium text-center mt-6">
          Delete Tappable and Layer?
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#0084ff] text-white font-bold py-2 px-4 rounded-full mr-3"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-black text-white font-medium py-2 px-4 rounded-full"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
