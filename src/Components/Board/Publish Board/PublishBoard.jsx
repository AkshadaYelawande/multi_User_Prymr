import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import createCollection from "../../../assets/createCollection.svg";
import {
  baseURL,
  privateUser,
  publicUser,
  user,
} from "../../../Constants/urls";
import { useToastManager } from "../../Context/ToastContext";
import { IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { isParameter } from "typescript";

let singleCollectionId = "";
const PublishBoard = () => {
  const toast = useToastManager();
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = location?.state?.imageUrl;
  // const imageUrl = JSON.parse(sessionStorage.getItem("state"))?.imageUrl;
  const [collectionName, setCollectionName] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [privateCollections, setPrivateCollections] = useState([]);
  const [publicCollections, setPublicCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const boardId = sessionStorage.getItem("boardId");
  const boardImageId = sessionStorage.getItem("boardImageId");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [tappableImages, setTappableImages] = useState([]);
  const [isPrivateBoard, setIsPrivateBoard] = useState(false); // Default to false (public)

  useEffect(() => {
    fetchCollections();
    fetchTappableImages();
  }, []);

  const fetchTappableImages = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(
        `${baseURL}/board/viewSingleBoardImageTappables?imageId=${boardImageId}&boardId=${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTappableImages(result.data.data);
        console.log("result.data.data", result.data.data);
      } else {
        toast(`Error ${response.status}: Failed to fetch tappable images`);
      }
    } catch (error) {
      console.error("Error fetching tappable images:", error);
      toast(`Network Error: ${error.message}`);
    }
  };

  const fetchCollections = async () => {
    setIsLoading(true);
    const userRole = localStorage.getItem("userRole");

    if (userRole === privateUser) {
      await fetchPrivateCollections();
    }
    if (userRole === publicUser) {
      await fetchPublicCollections();
    }
    if (userRole === user) {
      await fetchPublicCollections();
    }
    if (userRole === "admin") {
      await fetchPublicCollections();
    }

    setIsLoading(false);
  };

  const handleCreateNewCollection = async () => {
    if (!collectionName.trim()) {
      toast("Collection name cannot be empty");
      return;
    }

    setIsLoading(true);
    const storedToken = localStorage.getItem("token");

    try {
      const response = await fetch(`${baseURL}/board/createNewCollection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ collectionName }),
      });
      console.log("CollectionNAme : ", collectionName);

      const result = await response.json();

      if (response.ok) {
        toast(
          `Success: ${result.message || "Collection created successfully!"}`
        );
        setCollectionName("");
        setIsInputVisible(false);
        await fetchCollections();
        setIsExpanded(true);
      } else {
        toast(
          `Error ${response.status}: ${
            result.message || "Failed to create collection"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating new collection:", error);
      toast(`Network Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  let publicCollectionIds = [];
  let privateCollectionIds = [];

  const fetchPrivateCollections = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${baseURL}/board/fetchPrivateUserCollections?page=1&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPrivateCollections(result.data.data || []);

        const collections = result?.data?.data || [];

        // Log the IDs
        console.log("Private Collection IDs:", privateCollectionIds);

        // If you want to log each ID separately
        privateCollectionIds.forEach((id, index) => {
          console.log(`Private Collection ID ${index + 1}:`, id);
          console.log(`Private Collection Name ${index + 1}:`, collectionName);
        });
      } else {
        toast("Failed to fetch private collections");
      }
    } catch (error) {
      console.error("Error fetching private collections:", error);
      toast("Error fetching private collections");
    }
  };

  const fetchPublicCollections = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${baseURL}/board/fetchPublicUserCollections?page=1&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPublicCollections(result.data.data || []);

        const collections = result?.data?.data || [];

        publicCollectionIds = collections?.map((collection) => collection.id);

        // Log the IDs
        console.log("Public Collection IDs:", publicCollectionIds);

        // If you want to log each ID separately
        publicCollectionIds.forEach((id, index) => {
          console.log(`Public Collection ID ${index + 1}:`, id, name);
        });
      } else {
        toast("Failed to fetch public collections");
      }
    } catch (error) {
      console.error("Error fetching public collections:", error);
      toast("Error fetching public collections");
    }
  };

  const navigatetoahome = async () => {
    if (!selectedCollectionId) {
      toast("Please select a collection first");
      return;
    }

    const storedToken = localStorage.getItem("token");

    if (!boardImageId) {
      toast("Board image ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        collectionId: selectedCollectionId,
        boardImageId: boardImageId,
        isPrivateBoard: isPrivateBoard,
        boardStatus: "published",
      };

      // Check if all payload requirements are met
      if (!payload.collectionId || !payload.boardImageId) {
        toast("Missing required information for publishing");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${baseURL}/board/publishBoard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast("Board published successfully!");
        navigate("/prymr");
      } else {
        toast(`Error: ${result.message || "Failed to publish board"}`);
      }
    } catch (error) {
      console.error("Error publishing board:", error);
      toast(`Network Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggle = () => {
    setIsPrivateBoard(!isPrivateBoard);
  };
  const handleBack = () => {
    navigate("/board-builder-edit-board");
  };

  return (
    <div className="lg:w-[30%]">
      <div className="w-[418px] h-[50px] rounded-tl-lg relative bg-[#202020] flex-col justify-start items-start inline-flex">
        <div className="p-2.5 justify-center items-center gap-2.5 inline-flex">
          <div className="text-white text-[22.43px] font-bold font-['Nunito']">
            Save Project
          </div>
        </div>
      </div>
      <div className="w-[418px] h-[239px] relative bg-[#202020] rounded-b-[19px] border-[#606060]">
        <div className="w-[181.08px] h-[196.05px] pl-[0.08px] left-[15.92px] top-[23.23px] absolute bg-[#232323] rounded-md flex-col justify-center items-center inline-flex overflow-hidden">
          <div className="w-[187.79px] grow shrink basis-0 pb-[0.82px] border-[#0084ff] flex-col justify-center items-center inline-flex">
            <div className="w-full h-full relative">
              <img
                src={imageUrl}
                alt="Project preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>{" "}
        <div className="w-[180px] h-[38px] left-[219px] top-[23px] absolute bg-[#202020] rounded-md justify-start items-center inline-flex">
          <div className="w-[178px] h-[47px] text-white text-lg font-bold font-['Nunito'] tracking-tight">
            {tappableImages?.length > 0 ? tappableImages[0].boardTitle : ""}

            {/* <div className="grid grid-cols-auto-fill gap-4"> */}
            <div className="flex flex-wrap justify-start gap-2 mt-2">
              {tappableImages?.map(
                (tappableImage, index) =>
                  tappableImage.isTappable && (
                    <div key={tappableImage.tappableId} className="w-10 h-10">
                      <img
                        src={tappableImage.tappableImage}
                        alt={tappableImage.boardTitle}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[418px] ">
        <div className="text-[#f8f8f8] text-base p-3 font-normal  font-['Nunito'] leading-[17.76px]">
          Choose a folder to save to.
        </div>
        <div className="text-[#f8f8f8] py-4 flex p-3 gap-3 text-base font-normal font-['Nunito'] leading-[17.76px]">
          <img
            src={createCollection}
            className="ml-2 cursor-pointer"
            onClick={handleCreateNewCollection}
            alt="Create new collection"
          />
          {isInputVisible ? (
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Create New Collection"
              className="text-xl mt-3 bg-transparent border-b border-[#f8f8f8] focus:outline-none"
              onBlur={() => setIsInputVisible(false)}
            />
          ) : (
            <span
              className="text-xl mt-3 cursor-pointer"
              onClick={() => setIsInputVisible(true)}
            >
              Create New Collection
            </span>
          )}
        </div>

        <div className="h-[31px] flex items-end gap-[9px] ml-[22px]">
          {" "}
          <span className="text-white text-md"> Is Board Private </span>
          <div
            className={`text-[13px] ml-auto font-medium font-['Inter'] leading-[30.02px] tracking-tight ${
              !isPrivateBoard ? "text-white" : "text-[#383a3b]"
            }`}
          >
            <span className="text-base"> No</span>
          </div>
          <div
            className={`p-[2.50px]  border  w-14  rounded-full flex cursor-pointer ${
              isPrivateBoard ? "bg-[#0084ff]" : "bg-[#0084ff]"
            }`}
            onClick={handleToggle}
          >
            {" "}
            <div className="w-[25.02px] h-[25.02px] rounded-full shadow flex items-center justify-center">
              <div
                className={`w-[25.02px] h-[25.02px] rounded-full flex items-center justify-center transition-transform ${
                  isPrivateBoard
                    ? "transform translate-x-full bg-white"
                    : "bg-gray-200"
                }`}
              >
                {/* <div className="w-[12.51px] h-[12.51px] bg-[#2fff4a] rounded-full" /> */}
              </div>
            </div>
          </div>
          <div
            className={`text-[13px] font-medium font-['Inter'] leading-[30.02px] tracking-tight ${
              isPrivateBoard ? "text-white" : "text-[#383a3b]"
            }`}
          >
            <span className="text-base"> Yes</span>
          </div>
        </div>
        <div className="text-[#f8f8f8]  p-3 font-normal font-['Nunito'] leading-[17.76px] flex justify-center items-center whitespace-nowrap">
          <span className="w-auto ">Choose a folder to save to.</span>
          <button onClick={toggleExpanded} className="text-2xl ">
            {isExpanded ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>
        </div>

        {isExpanded && (
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="text-white text-center py-4">Loading...</div>
            ) : (
              <>
                {privateCollections?.map((collection) => (
                  <CollectionItem
                    key={collection.id}
                    collection={collection}
                    isPrivate={true}
                    // onSelect={setSelectedCollection}
                    // isSelected={selectedCollection?.id === collection.id}
                    onSelect={(id) => setSelectedCollectionId(id)}
                    isSelected={selectedCollectionId === collection.id}
                  />
                ))}
                {publicCollections?.map((collection) => (
                  <CollectionItem
                    key={collection.id}
                    collection={collection}
                    isPrivate={false}
                    // onSelect={setSelectedCollection}
                    // isSelected={selectedCollection?.id === collection.id}
                    onSelect={(id) => setSelectedCollectionId(id)}
                    isSelected={selectedCollectionId === collection.id}
                  />
                ))}
              </>
            )}
          </div>
        )}
        <div className="flex gap-5 py-16 justify-center">
          <button
            onClick={navigatetoahome}
            className={`bg-blue-400 rounded-full px-4 py-2 ${
              !selectedCollectionId ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedCollectionId}
          >
            Publish
          </button>
          <button
            className="bg-blue-400 rounded-full px-4 py-2"
            onClick={handleBack}
          >
            Cancel
          </button>
        </div>
      </div>{" "}
    </div>
  );
};

const handleSetCollectionId = (id) => {
  singleCollectionId = id;
  console.info("log 371");
  console.info(id);
  console.info("---------------------------------------------------");
};
const CollectionItem = ({ collection, isPrivate, onSelect, isSelected }) => (
  <div
    className={`w-auto h-[67.70px] relative bg-[#121212] rounded-[13px] mb-2 cursor-pointer ${
      isSelected ? "border-2 border-blue-400" : ""
    }`}
    onClick={() => onSelect(collection.id)}
  >
    <div className="w-[272.46px] h-[40.67px] left-[12.38px] top-[13.10px] absolute">
      <div className="w-[41.10px] h-[41.10px] left-0 top-0 absolute bg-[#0047ff] rounded-lg">
        <div className="w-[20.55px] h-[20.55px] left-0 top-0 absolute bg-[#d0d0d0]"></div>
        <div className="w-[20.55px] h-[20.55px] left-[20.55px] top-0 absolute bg-[#ff0000]"></div>
        <div className="w-[20.55px] h-[20.55px] left-0 top-[20.55px] absolute bg-[#999999]"></div>
      </div>
      <div className="left-[51.68px] top-[3.05px] absolute text-white text-sm font-bold font-['Nunito']">
        {collection.collectionName}
      </div>
      <div className="left-[52.41px] top-[22.37px] absolute text-[#23ff00] text-[10.17px] font-normal font-['Nunito'] leading-3">
        {isPrivate ? "Private" : "Public"} • Created:{" "}
        {new Date(collection.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);

export default PublishBoard;
