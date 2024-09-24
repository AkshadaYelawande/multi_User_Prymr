import React from "react";
import Navbar from "../Components/common/Navbar";
import Header from "../Components/common/Header";

function CreatorPermissionsForm() {
  return (
    <>
      <div className="bg-black text-white w-full min-h-screen lg:w-[30%] flex flex-col items-center justify-center">
        <div className="text-8xl  ">+</div>
        <div
          className="bg-black p-8 rounded-md w-full"
          style={{
            minHeight: "calc(100vh - 30vh)",
          }}
        >
          <h2 className="text-xl text-center font-bold mb-4">
            Creator Permissions form
          </h2>
          {/* <p className="mb-8">Body text about being a Prymr creator</p> */}
          <div className="flex  flex-col h-[60vh]  relative border-red-100 border">
            <textarea
              cols={50}
              rows={10}
              className="bg-black text-white px-4 focus:outline-none resize-none  pt-4"
              placeholder="Body text about being a Prymr creator"
            />
            <div className="flex justify-center w-full bottom-6 absolute">
              <button className=" w-2/3 rounded-3xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12  focus:outline-none focus:shadow-outline">
                REQUEST
              </button>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
}

export default CreatorPermissionsForm;
