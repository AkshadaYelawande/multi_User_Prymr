import React, { useEffect, useState } from "react";
import editToolNavbar from "../../assets/settings.png";
import handleBackk from "../../assets/handleBack.svg";
import cart from "../../assets/ShoppingCartpng.png";
import info from "../../assets/info.svg";
import bluepencile from "../../assets/bluepencil.svg";
import whitepencil from "../../assets/whitepencil.svg";
import { baseURL } from "../../Constants/urls";
import { useNavigate } from "react-router";
import Navbar from "../common/Navbar";
import xcircle from "../../assets/xcircle.png";

const CreatorInfo = ({ closeInfo, closeFullImage }) => {
  const [activeButton, setActiveButton] = useState("News");
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState("");
  const [activeSection, setActiveSection] = useState("News");
  const [profileBio, setProfileBio] = useState("");
  const [profileCV, setProfileCV] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editingSection, setEditingSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInfoForPublic();

    if (token && userRole === "privateUser") {
      fetchInfoForPrivate();
    }
  }, [token, userRole]);

  const fetchInfoForPublic = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/auth/getPublicProfileInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.status && result.message) {
        const data = result.data.data;
        setProfileCV(data.cv);
        setNewsData(data.news);
        setProfileBio(data.bio);
      } else {
        setMessage("Failed to fetch public profile information.");
      }
    } catch (error) {
      setMessage("Error fetching public profile information.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInfoForPrivate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/auth/getPrivateProfileInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status && result.message) {
        const data = result.data.data;
        setProfileCV(data.cv);
        setNewsData(data.news);
        setProfileBio(data.bio);
      } else {
        setMessage("Failed to fetch private profile information.");
      }
    } catch (error) {
      setMessage("Error fetching private profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditButtonClick = (section) => {
    setEditingSection(section);
    setIsEditing(true);
    setEditContent(
      section === "News" ? newsData : section === "Bio" ? profileBio : profileCV
    );
  };

  const handleSaveButtonClick = async () => {
    let endpoint = "";
    let queryParam = "";

    switch (editingSection) {
      case "News":
        endpoint = "addProfileNews";
        queryParam = "addProfileNews";
        break;
      case "Biography":
        endpoint = "addProfileBio";
        queryParam = "addBio";
        break;
      case "CV":
        endpoint = "addProfileCV";
        queryParam = "addProfileCV";
        break;
      default:
        setMessage("Invalid section");
        return;
    }

    try {
      const response = await fetch(
        `${baseURL}/auth/${endpoint}?${queryParam}=${encodeURIComponent(
          editContent
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.status && result.message) {
        setMessage(`${editingSection} updated successfully`);
        // Update the local state based on the section
        if (editingSection === "News") setNewsData(editContent);
        else if (editingSection === "Biography") setProfileBio(editContent);
        else if (editingSection === "CV") setProfileCV(editContent);
      } else {
        setMessage(`Failed to update ${editingSection}`);
      }
    } catch (error) {
      setMessage(`Error updating ${editingSection}`);
    } finally {
      setIsEditing(false);
      setEditingSection("");
    }
  };

  const handleBack = () => {
    closeInfo();
  };

  const renderContent = (section) => {
    const content =
      section === "News"
        ? newsData
        : section === "Biography"
        ? profileBio
        : profileCV;

    if (isEditing && editingSection === section) {
      return (
        <div className="flex-grow flex flex-col">
          <textarea
            rows="15"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 text-black "
          />
          <button
            onClick={handleSaveButtonClick}
            className="mt-2 bg-blue-500 text-white p-2 rounded  "
          >
            Save
          </button>
        </div>
      );
    }

    return (
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar pr-2">
          {content ? (
            <p className="break-words text-gray-400 text-xs">{content}</p>
          ) : (
            <p className="text-gray-500 text-xs italic">No content available</p>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="w-full sm:text-xs h-screen bg-[#2A2A2A]  lg:hidden text-white">
        <header className="flex   justify-between mt-[2vh] w-auto items-center">
          <div className="flex gap-2 ml-2 text-md">
            <img
              src={handleBackk}
              alt="Info"
              className="w-5 h-5 cursor-pointer"
              onClick={handleBack}
            />{" "}
            Info
            <img src={info} alt="Info" className="w-3 h-3 mt-1" />
          </div>

          {/* <div className="flex gap-2 mr-2 ml-auto">
            <img
              src={editToolNavbar}
              alt="Edit Tool Navbar"
              className="w-8 h-8"
            />
            <img src={cart} alt="Cart" className="w-8 h-8" />
          </div> */}
        </header>
        <div className="flex py-2 justify-between m-2 text-sm md:gap-28 sm:gap-3">
          {["News", "Biography", "CV"].map((section) => (
            <button
              key={section}
              className={`flex gap-2 justify-center text-center cursor-pointer rounded-full h-auto text-sm ${
                activeSection === section
                  ? "active-class bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </button>
          ))}
        </div>
        <div className="gap-4 my-4 flex flex-col">
          <div className="bg-[#2A2A2A] flex-1 min-h-[80vh] max-h-[80vh] flex flex-col">
            <div className="p-4 flex flex-col h-full">
              <div className="mb-2 ">
                <span className="font-semibold italic text-gray-400">
                  {activeSection}
                </span>
                <span className="text-blue-500 italic ml-2"> edit </span>
                {(userRole === "publicUser" || userRole === "privateUser") && (
                  <img
                    src={bluepencile}
                    className="w-5 h-5 cursor-pointer inline-block "
                    onClick={() => handleEditButtonClick(activeSection)}
                    alt="Edit"
                  />
                )}
              </div>
              {renderContent(activeSection)}
            </div>
          </div>
        </div>
      </div>
      <button
        className="absolute z-10 top-2 right-0 p-2 w-auto flex items-center text-white space-x-2"
        onClick={closeInfo}
        onTap={closeInfo}
      >
        <span className="italic text-sm">Exit Info</span>
        <img src={xcircle} className="w-5 h-5" alt="Exit icon" />
      </button>

      <div className="gap-1 lg:my-16 lg:flex justify-between hidden m-2 ">
        {["News", "Biography", "CV"].map((section) => (
          <div
            key={section}
            className="bg-[#2A2A2A] flex-1 min-h-[88vh] max-h-[88vh] flex flex-col"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-[#1E1E1E] p-3 pl-3 pr-5 rounded-full w-[18vh] text-center ">
                  {section}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold italic text-gray-400">
                  {section}
                </span>
                {(userRole === "publicUser" || userRole === "privateUser") && (
                  <img
                    src={bluepencile}
                    className="w-5 h-5 cursor-pointer inline-block ml-2"
                    onClick={() => handleEditButtonClick(section)}
                    alt="Edit"
                  />
                )}
              </div>
              {renderContent(section)}
            </div>
          </div>
        ))}
      </div>
      <div className="block lg:hidden">
        <Navbar />
      </div>
    </>
  );
};

export default CreatorInfo;
