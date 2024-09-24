import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router"; // Import useLocation here
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Line68 from "../../../../assets/Line68.png";
import crossCircle from "../../../../assets/crossCircle.png";
import checkCircle from "../../../../assets/checkCircleblack.png";
import checkCircleWhite from "../../../../assets/checkCircleWhite.png";
import questionmarkcircle from "../../../../assets/questionmarkcircle.svg";
import comment from "../../../../assets/comment.svg";
import { baseURL } from "../../../../Constants/urls";
import { useToastManager } from "../../../Context/ToastContext";
import { debounce } from "lodash";

const EditBoardInfo = () => {
  const toast = useToastManager();
  const [selectedRating, setSelectedRating] = useState("G");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowComments, setAllowComments] = useState(false);
  const [isCheckCircleToggled, setIsCheckCircleToggled] = useState(false);
  const [isCrossCircleToggled, setIsCrossCircleToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const imageUrl = location?.state?.imageUrl;
  let imageUrl1 = imageUrl?.replace(/^"|"$/g, "");
  const navigate = useNavigate();
  const boardId = location?.state?.boardId;
  const boardImageId = location?.state?.boardImageId;
  const [isFetching, setIsFetching] = useState(true);
  console.log("BoardId : 394 ", boardId);
  console.log("BoardImageId :", boardImageId);
  console.log("BoardImageId :", imageUrl);

  const handleBack = () => {
    navigate("/board-builder-edit-board");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // If already loading, don't proceed
    if (isLoading) return;

    const token = localStorage.getItem("token");

    // Validate input fields
    if (!title.trim()) {
      toast("Please enter a title for the board.");
      return;
    }

    if (!description.trim()) {
      toast("Please enter a description for the board.");
      return;
    }

    setIsLoading(true);

    const postData = JSON.stringify({
      boardId: boardId,
      boardImageId: boardImageId,
      imageUrl: imageUrl,
      title: title,
      description: description,
      allowComments: allowComments,
    });

    try {
      const response = await fetch(`${baseURL}/board/addBoardInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: postData,
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message);
        // console.log("o saved successfully" + data.message);
      } else {
        toast(data.message);
        console.log(data.message);
      }
    } catch (error) {
      toast(error.message);
    } finally {
      setIsLoading(false);
    }

    navigate("/board-builder-edit-board");
  };

  // Debounce the handleSave function
  const debouncedHandleSave = debounce(handleSave, 300);

  useEffect(() => {
    if (boardImageId) {
      fetchBoardInfo();
    }
  }, [boardImageId]);

  const fetchBoardInfo = async () => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${baseURL}/board/fetchBoardEditInfo?boardImageId=${boardImageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log("Data 1", data.data.data.title);

        // const titleInfo = data?.data?.data?.title;
        // const descriptionInfo = data?.data?.data?.description;
        // Update state with fetched data
        setTitle(data?.data?.data?.title || "");
        setDescription(data?.data?.data?.description || "");
        // setAllowComments(data.allowComments || false);
        // Add any other state updates based on the API response
      } else {
        toast("Failed to fetch board info");
      }
    } catch (error) {
      console.error("Error fetching board info:", error);
      toast("Error fetching board info");
    } finally {
      setIsFetching(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleYesClick = () => {
    setSelectedOption(selectedOption === "yes" ? null : "yes");
  };

  const handleNoClick = () => {
    setSelectedOption(selectedOption === "no" ? null : "no");
  };

  const toggleComments = () => {
    setAllowComments(!allowComments);
  };

  console.log("Rendering with state:", { title, description });

  return (
    <div className="container mx-auto text-white h-screen flex-grow">
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <div className="container mx-auto text-white h-screen flex-grow">
          <div className="relative w-full h-full">
            <div
              onClick={handleBack}
              className="flex items-center w-fit px-3  mt-2 space-x-2 mb-4 cursor-pointer"
            >
              <AiOutlineArrowLeft className="text-xl" />
              <span className="text-lg p-1">Back</span>
            </div>

            <img
              src={imageUrl}
              alt="Board"
              className="w-full h-[40vh] object-contain"
            />

            <div className="absolute top-1/2 h-auto left-0 right-0 bg-black bg-opacity-50 p-4 py-10 flex flex-col">
              <input
                className="text-lg mb-2 bg-transparent text-white border-none resize-none outline-none overflow-auto"
                value={title}
                onChange={handleTitleChange} 
                placeholder="Title Board"
              />
              <textarea
                className="w-full bg-transparent text-white border-none resize-none outline-none h-[20vh] overflow-auto"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter Board Description"
                style={{ lineHeight: "1.5em" }}
              />
              <div className="text-white mt-2">
                {description.split("\n").map((line, index) => (
                  <div key={index} className=""></div>
                ))}
              </div>
            </div>

            <div
              className="fixed bottom-0 left-[18vw] right-[18vw] bg-blue-400 h-10 mb-5 flex items-center rounded-full justify-center font-bold text-xl text-white cursor-pointer"
              onClick={debouncedHandleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving" : "Save"}

              <img
                src={checkCircleWhite}
                alt="Check Circle White"
                className="ml-3 w-5 h-5"
              />
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default EditBoardInfo;
