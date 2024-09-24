import React, { useState, useEffect } from "react";
import handleBack from "../../../assets/handleBack.svg";
import BoardBuilderText from "../../../assets/BoardBuilderText.svg";
import plusGrayCircle from "../../../assets/plusGrayCircle.svg";
import savedBoards from "../../../assets/savedBoards.svg";
import ADS from "../../../assets/ADS.svg";
import questionmarkcircle from "../../../assets/questionmarkcircle.svg";

import fromGalary from "../../../assets/Group115.png";
import fromBlank from "../../../assets/fromBlank.svg";
import fromPhone from "../../../assets/fromPhone.svg";
import { useNavigate } from "react-router";
import EditBoard from "../EditBoard";
import ImageFromGalary from "./ImageFromGalary";
import { baseURL } from "../../../Constants/urls";
import DesktopNavbar from "../../common/DesktopNavbar";
import FrameSaved from "../../../assets/FrameSaved.svg";
import FrameBlank from "../../../assets/FrameBlank.svg";
import FrameGalary from "../../../assets/FrameGalary.svg";
import blankMobile from "../../../assets/blankMobile.svg";
import gallaryMobile from "../../../assets/gallaryMobile.svg";
import exixtingProjects from "../../../assets/exixtingProjects.svg";
import ActionBar from "../ActionBar/ActionBar";
import { useToastManager } from "../../Context/ToastContext";
import { PropagateLoader } from "react-spinners";

const NewBoard = ({ isTappableVisible }) => {
  const toast = useToastManager();
  const navigate = useNavigate();
  const [selectedImageFromGalary, setSelectedImageFromGalary] = useState(true);
  const [createBlankCanvas, setCreateBlankCanvas] = useState(false);
  const [SelectedImage, setSelectedImage] = useState();
  const [buttonIsClicked, setButtonIsClicked] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader

  useEffect(() => {
    // Clear tappable areas and layers from localStorage
    sessionStorage.removeItem("boardId");
    sessionStorage.removeItem("boardImageId");
    localStorage.removeItem("activeTappableId");
    localStorage.removeItem("tappableAreas");
    localStorage.removeItem("layers");
    localStorage.removeItem("editBoardData");
    sessionStorage.removeItem("tappableData");
  }, []);

  const handleBackFunction = () => {
    navigate("/boardBuilder");
  };

  const handleImageUpload = async (event) => {
    setLoading(true); // Show loader when upload starts
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setSelectedImageFromGalary(reader?.result);

        const formData = new FormData();
        formData.append("file", file);

        const storedToken = localStorage.getItem("token");

        try {
          // First API call
          const uploadFilePromise = fetch(`${baseURL}/file-upload/uploadFile`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
            body: formData,
          });

          // Wait for the first API call to complete
          const uploadResponse = await uploadFilePromise;

          if (uploadResponse?.ok) {
            const result = await uploadResponse?.json();
            const imageUrl = result?.data?.url;

            // Second API call
            const createBoardPromise = fetch(
              `${baseURL}/board/createBoard?imageUrl=${encodeURIComponent(
                imageUrl
              )}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            // Wait for both API calls to complete
            const [_, createBoardResponse] = await Promise.all([
              uploadFilePromise,
              createBoardPromise,
            ]);

            if (createBoardResponse.ok) {
              const createBoardResult = await createBoardResponse?.json();
              setSelectedImage(imageUrl);
              sessionStorage.setItem("imagefromGalary", reader?.result);
              sessionStorage.setItem("state", JSON.stringify({ imageUrl }));

              const boardId = createBoardResult?.data?.data?.boardId;
              const boardImageId = createBoardResult?.data?.data?.boardImageId;
              sessionStorage.setItem("boardId", boardId);
              sessionStorage.setItem("boardImageId", boardImageId);

              navigate("/board-builder-edit-board", {
                state: {
                  imagefromGalary: reader?.result,
                  boardId,
                  boardImageId,
                },
              });
            } else {
              console.error(
                "Failed to create board",
                createBoardResponse?.status,
                createBoardResponse?.statusText
              );
            }
          } else {
            toast("Image Too Large, please upload image less than 3 MB");
          }
        } catch (error) {
          console.error("Error during API calls:", error);
        } finally {
          setLoading(false); // Hide loader after processing
        }
      };

      if (file?.type?.startsWith("image/")) {
        reader?.readAsDataURL(file);
      } else if (file?.type === "image/gif") {
        reader?.readAsArrayBuffer(file);
      } else {
        console.log("Unsupported file type:", file?.type);
        setLoading(false); // Hide loader if unsupported file type
      }
    } else {
      console.log("No file selected");
      setLoading(false); // Hide loader if no file selected
    }
  };

  const handleBlank = () => {
    sessionStorage.removeItem("imagefromGalary");
    sessionStorage.removeItem("state");
    setCreateBlankCanvas(true);
    navigate("/board-builder-edit-board", {
      state: { createBlankCanvas: true },
    });
  };

  const handleNewBoardCreator = () => {
    setLoading(true); // Show loader when navigating
    navigate("/create-new-board");
    setButtonIsClicked("NEW");
    setLoading(false); // Hide loader after navigation
  };

  const handleSaved = () => {
    setLoading(true);
    setButtonIsClicked("SAVED");
    navigate("/create-new-board-saved");
    setLoading(false);
  };

  const handleADS = () => {
    setLoading(true);
    setButtonIsClicked("ADS");
    navigate("/create-new-board-ADS");
    setLoading(false);
  };

  const handleClose = () => {
    navigate("/prymr");
  };

  if (loading) {
    return (
      <div className="text-white place-content-center justify-center text-center h-screen ">
        <span className="mb-2"> Loading </span>
        <PropagateLoader color="white" className="mt-3" />
      </div>
    );
  }

  return (
    <>
      <div className="  flex items-center justify-center w-full h-full fixed inset-0">
        <div className="text-white rounded-lg">
          <div className="bg-[#6100FF] text-sm flex justify-between p-2 rounded-t-3xl">
            <span className="ml-2 ">New Project </span>
            <span className="md:block hidden">
              Select Background For Board{" "}
            </span>
            <span className="mr-2 cursor-pointer" onClick={handleClose}>
              X
            </span>
          </div>
          <div className="bg-[#3B3B3B]">
            <span className="block md:hidden  py-2 pl-3">
              Select Background For Board{" "}
            </span>

            <div className="bg-[#3B3B3B] sm:mb-5 flex flex-col sm:flex-row justify-center items-center rounded-b-lg gap-2 p-4">
              <label htmlFor="fileInput1" className="flex justify-center">
                <img
                  src={FrameGalary}
                  alt="From Image"
                  className="hidden sm:block h-40 m-2 cursor-pointer"
                />
                <img
                  src={gallaryMobile}
                  alt="From Image"
                  className="block sm:hidden   cursor-pointer"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput1"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <div className="flex justify-center">
                <img
                  src={FrameSaved}
                  className="hidden sm:block h-40 m-2 cursor-pointer"
                />
                <img
                  src={exixtingProjects}
                  className="block sm:hidden  cursor-pointer"
                />
              </div>
              <label htmlFor="fileInput3" className="flex justify-center">
                <img
                  src={FrameBlank}
                  alt="From Image"
                  className="hidden sm:block h-40 m-2 cursor-pointer"
                  onClick={handleBlank}
                />
                {createBlankCanvas && (
                  <EditBoard createBlankCanvas={createBlankCanvas} />
                )}
              </label>
            </div>
          </div>
        </div>
        {isTappableVisible && <NewTappable />}
      </div>
    </>
  );
};

export default NewBoard;
