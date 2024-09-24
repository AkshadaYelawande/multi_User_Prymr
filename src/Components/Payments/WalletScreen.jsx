import React, { useState } from "react";
import { PiWallet } from "react-icons/pi";
import { GrStorage } from "react-icons/gr";
import { BsCreditCard } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import CloseImage from "../../assets/cross.png";
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router";
import DollarImage from "../../assets/dollar.png";
import SearchImage from "../../assets/search.png";

function MYEarnings() {
  const navigate = useNavigate();
  const [totalEarnings, setTotalEarnings] = useState(12400);
  const [earningsShow, setEarningsShow] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Earnings");

  const handleClose = () => {
    // Handle closing the modal or component
    console.log("Close button clicked");
  };

  const [selectedTab, setSelectedTab] = useState("history");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleChange = (selected) => {
    setSelectedMonth(selected);
  };
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const items = [
    {
      name: "Artwork Name",
      status: "Unlocked",
      date: "26-02-2022",
      time: "6:60am",
      price: "+ $10.00",
    },
    {
      name: "Artwork Name",
      status: "Unlocked",
      date: "26-02-2022",
      time: "6:60am",
      price: "+ $10.00",
    },
    {
      name: "Artist Name",
      status: "Tip",
      date: "26-02-2022",
      time: "6:60am",
      price: "- $10.00",
    },
    {
      name: "Artwork Name",
      status: "Unlocked",
      date: "26-02-2022",
      time: "6:60am",
      price: "+ $10.00",
    },
    {
      name: "Artwork Name",
      status: "Unlocked",
      date: "26-02-2022",
      time: "6:60am",
      price: "- $10.00",
    },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case "history":
        return (
          <div className="p-2 mt-2">
            <div className="flex justify-between w-full items-center mb-2">
              <div className="flex gap-1 ">
                {/* <FaBookBookmark size={24} color="white" /> */}
                <h2 className="text-xl font-bold mb-4 text-white">
                  Earning History
                </h2>
              </div>
              <div>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleChange(e.target.value)}
                  className="flex w-full bg-[#000000] text-white border border-gray-300 rounded-md shadow-sm px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                >
                  <option value="" disabled>
                    Select a month
                  </option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className=" rounded shadow-md overflow-y-scroll  h-[60vh] w-full">
              {items?.map((item) => (
                <div className="flex items-center justify-between py-3 px-1 ">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center text-white font-bold mr-3">
                      <img src={DollarImage} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-white">
                        {item.name}
                      </h3>
                      <p className="text-[#ffffff] text-xs">
                        {item.status} | {item.date} | {item.time}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      item.price.includes("+") ? `text-white` : `text-[#DEC3C3]`
                    }`}
                  >
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "gifts":
        return <div className="p-4">{/* Gift content here */}</div>;
      case "transactions":
        return <div className="p-4">{/* Transactions content here */}</div>;
      default:
        return null;
    }
  };

  const menuItems = [
    { name: "Earnings", icons: <PiWallet size={22} color="white" /> },
    { name: "Payments", icons: <GrStorage size={22} color="white" /> },
    { name: "Accounts", icons: <BsCreditCard size={22} color="white" /> },
    { name: "Settings", icons: <IoSettingsOutline size={22} color="white" /> },
  ];

  const handleBalanceShow = () => {
    setEarningsShow(!earningsShow);
  };

  return (
    <>
      <div className="bg-[#000000] h-screen lg:w-[30%] p-4">
        <div className=" mx-auto ">
          <div className="flex justify-between items-center ">
            <div className="flex gap-2 items-center">
              <img src={CloseImage} onClick={() => navigate("/user-profile")} />
              <h1 className="text-white text-xl font-bold">My Earnings</h1>
            </div>
            <div className="flex gap-2 items-center">
              <img
                className="w-5 h-5"
                src={SearchImage}
                onClick={() => navigate("/user-profile")}
              />
            </div>
            {/* <button
            onClick={handleClose}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Close
          </button> */}
            {/* <div className="flex gap-4">
            {menuItems?.map((item) => (
              <div
                className={`flex justify-center flex-col items-center mb-4 cursor-pointer ${
                  activeMenu === item.name ? `border-b-2` : ``
                }`}
                onClick={() => setActiveMenu(item.name)}
              >
                {item?.icons}
                <span className="text-white font-extrabold">{item?.name}</span>
              </div>
            ))}
          </div> */}
          </div>
          <div className="bg-[#000000] p-4 rounded-lg shadow-md">
            <div className="flex justify-center items-center mb-4">
              <h2 className="text-sm font-bold ml-2 text-white">
                Total Received
              </h2>
              {earningsShow ? (
                <FaRegEye
                  size={16}
                  className="text-white ml-5"
                  onClick={() => handleBalanceShow()}
                />
              ) : (
                <FaEyeSlash
                  size={16}
                  className="text-white ml-5"
                  onClick={() => handleBalanceShow()}
                />
              )}
            </div>
            <div
              className={`text-4xl font-bold text-center text-white ${
                !earningsShow && `blur-md`
              }`}
            >
              $ {totalEarnings.toFixed(2)}
            </div>
          </div>
          {/* <div className="flex justify-around mt-4 gap-5">
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300
           
          <button
            className={`bg-white
                  font-medium rounded-lg text-lg px-4 py-2 text-blue-500 ${
                    selectedTab === "history" ? "bg-blue-700 text-white" : ""
                  }`}
            onClick={() => handleTabChange("history")}
          >
            History
          </button>
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300
          
          <button
            className={`bg-white
                 font-medium rounded-lg text-lg px-4 py-2 text-blue-500 ${
                   selectedTab === "gifts" ? "bg-blue-700 text-white" : ""
                 }`}
            onClick={() => handleTabChange("gifts")}
          >
            Gifts
          </button>
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300
           
          <button
            className={`bg-white
                  font-medium rounded-lg text-lg  px-4 py-2 text-blue-500 ${
                    selectedTab === "transactions"
                      ? "bg-blue-700 text-white"
                      : ""
                  }`}
            onClick={() => handleTabChange("transactions")}
          >
            Transactions
          </button>
        </div> */}
          {renderTabContent()}
        </div>
      </div>
      <Navbar />
    </>
  );
}

export default MYEarnings;
