import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { privateUser, publicUser, user } from "../../Constants/urls";

const Header = () => {
  const userRole = localStorage.getItem("userRole");

  const profileImage = localStorage.getItem("profileImage");
  const initialIconUrl = localStorage.getItem("initialProfileIcon");

  return (
    <div className="flex bg-[#2D2D2D]">
      <header className="flex items-center  justify-between p-3  gap-2">
        <img
          className="rounded-full cursor-pointer bg-gray-100"
          style={{
            width: "37px",
            height: "37px",

            objectFit: "contain",
          }}
          src={profileImage || initialIconUrl}
        />

        <div className="text-[19.44px]  font-bold cursor-pointer text-white">
          {userRole === publicUser && <div>Erik Jones art.com</div>}
          {userRole === user && <div>Erik Jones art.com</div>}
          {userRole === privateUser && <div>Ben art.com</div>}
        </div>
      </header>
    </div>
  );
};

export default Header;
