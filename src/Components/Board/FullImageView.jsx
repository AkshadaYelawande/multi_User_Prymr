import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useToastManager } from "../Context/ToastContext";
import { baseURL } from "../../Constants/urls";

const FullImageView = () => {
  const toast = useToastManager();
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, onChangeBackground } = location.state || {};
  const [changedBG, setNewImageUrl] = useState("");

  const handleFileChange = async (event) => {
    console.log("handleFileChange");

    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file);

      try {
        console.log("Starting file upload process...");

        // Get the stored token
        const storedToken = localStorage.getItem("token");
        console.log("Stored token retrieved:", storedToken);

        // Get the boardImageId from session storage
        const boardImageId = sessionStorage.getItem("boardImageId");
        console.log(
          "Board Image ID retrieved from session storage:",
          boardImageId
        );

        if (!boardImageId) {
          console.error("boardImageId not found in session storage");
          toast("Board image ID is missing. Please select a board first.");
          return;
        }

        console.log("Uploading the new image...");

        // First, upload the new image
        const formData = new FormData();
        formData.append("file", file);
        console.log("Form data prepared with file:", formData);

        const uploadResponse = await fetch(
          `${baseURL}/file-upload/uploadFile`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
            body: formData,
          }
        );

        console.log("Upload response received:", uploadResponse);

        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! status: ${uploadResponse.status}`);
        }

        const uploadResult = await uploadResponse.json();
        const changedBG = uploadResult.data.url;
        console.log("Image uploaded successfully. New Image URL:", changedBG);

        console.log("Updating board background image...");

        // Now, update the board's background image
        const updateResponse = await fetch(
          `${baseURL}/board/editBoardBackgroundImage`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
            body: JSON.stringify({
              boardImageId: boardImageId,
              imageUrl: changedBG,
            }),
          }
        );

        console.log("Board update response received:", updateResponse);

        if (!updateResponse.ok) {
          throw new Error(`HTTP error! status: ${updateResponse.status}`);
        }

        const updateResult = await updateResponse.json();
        console.log(
          "Board background image updated successfully:",
          updateResult
        );

        // Set the new image URL in the component state
        setNewImageUrl(changedBG);
        console.log("New image URL set in state:", changedBG);

        // If there's an onChangeBackground function, call it with the new URL
        if (onChangeBackground) {
          console.log("Calling onChangeBackground with new image URL...");
          onChangeBackground(changedBG);
        }
        navigate("/board-builder-edit-board", {
          state: { changedBG: changedBG },
        });
        toast("Image uploaded and board updated successfully!");

        // Navigate back to the previous page
        console.log("Navigating back to the previous page...");
      } catch (error) {
        console.error("Error uploading and updating image:", error);
        toast("Failed to upload and update image. Please try again.");
      }
    } else {
      console.log("No file selected.");
    }
  };

  const handleClose = () => {
    navigate("/board-builder-edit-board", {
      state: { changedBG },
    });
  };
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black p-5">
      <div className="relative h-full w-full max-h-full max-w-full border-4 border-indigo-600">
        <img
          src={changedBG || imageUrl}
          alt="Full View"
          className="h-full w-full object-contain"
        />
        <button
          onClick={handleClose}
          className="absolute w-6 h-6 top-4 right-4 bg-red-700 text-white p-2 rounded-full flex items-center justify-center"
        >
          X
        </button>
        <button className="absolute w-8 bottom-6 left-6 bg-blue-500 text-white p-2 rounded-full flex items-center justify-center">
          <FaPlus />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
};

export default FullImageView;
