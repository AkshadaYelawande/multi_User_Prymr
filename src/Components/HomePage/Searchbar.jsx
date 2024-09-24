// Step 1: Create a new file MenuDark.js in your components directory

import React from "react";

const Searchbar = () => {
  return (
    <div className="bg-gray-800 border-white mt-10 text-white p-4 rounded-md w-80">
      <div className="mb-8 ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search "
            className="bg-gray-700 text-white rounded-full w-full py-2 pl-10 pr-4"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 21a9 9 0 100-18 9 9 0 000 18zm0 0l6-6"
            ></path>
          </svg>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <button className="bg-blue-600 text-white rounded-full px-4 py-2">
          Store Feed
        </button>
        <button className="bg-yellow-400 text-black rounded-full px-4 py-2">
          Real Time
        </button>
        <button className="bg-blue-600 text-white rounded-full px-4 py-2">
          All Creators
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/30"
            alt="Profile"
            className="rounded-full"
          />
          <span>@Your Profile</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M9 6h6m-6 6h6m-6 6h6"
            ></path>
          </svg>
          <span>SKY Messenger</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v16c0 1.104.895 2 2 2h12c1.105 0 2-.896 2-2V4c0-1.105-.895-2-2-2H6c-1.105 0-2 .895-2 2zm4 6h8"
            ></path>
          </svg>
          <span>Activity</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 4v16l7-4 7 4V4"
            ></path>
          </svg>
          <span>My Bookmarks</span>
        </div>
      </div>
      <div className="mt-4 space-y-2 border-t border-gray-700 pt-4">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          <span>Profile Settings</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 9l-3 3m0 0l3 3m-3-3h12"
            ></path>
          </svg>
          <span>Help & Support</span>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
