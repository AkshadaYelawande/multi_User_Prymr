import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import handleBack from "../../../assets/handleBack.svg";
import changeBg from "../../../assets/changeBg.png";
import deletee from "../../../assets/redDelete.svg";
import getCroppedImg from "./CroppedImage";
import "./create.css";
import { baseURL } from "../../../Constants/urls";

const ImageFromGalary = () => {
  const location = useLocation();
  const { imagefromGalary, imageUrl } = location.state || {};
  const navigate = useNavigate();
  const imgGalaryRef = useRef();

  const [croppedImage, setCroppedImage] = useState(null);
  const [imageFromChangeBG, setImageFromChangeBG] = useState(null);
  const [file, setFile] = useState(null);

  const handleBackFunction = () => {
    navigate("/create-new-board");
  };

  const handleDelete = () => {
    // alert("Delete Content?");
    navigate("/create-new-board");
  };

  const showCroppedImage = async () => {
    try {
      let croppedImageUrl = imagefromGalary; // Default to original image URL

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const storedToken = localStorage.getItem("token");

        const response = await fetch(`${baseURL}/file-upload/uploadFile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const imageUrl = result.data.url;
          setImageFromChangeBG(imageUrl);
          croppedImageUrl = imageUrl;
        } else {
          console.error(
            "Failed to upload file",
            response.status,
            response.statusText
          );
        }
      }

      const croppedUrl = await getCroppedImg(croppedImageUrl);
      setCroppedImage(croppedUrl);
      navigate("/board-builder-edit-board", {
        state: { imageUrl: croppedUrl },
      });
    } catch (error) {
      console.error("Error cropping image:", error);
      navigate("/board-builder-edit-board", {
        state: { imagefromGalary, imageUrl },
      });
    }
  };

  const handleChangeBackground = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImageFromChangeBG(URL.createObjectURL(file));
    }
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <div className="container sm:pl-4">
      <div className="flex items-center h-[15vh] w-full">
        <button className="flex w-auto h-auto" onClick={handleBackFunction}>
          <img src={handleBack} alt="Back" className="text-3xl border-white" />
        </button>
        <h1 className="font-bold text-xl text-white ml-4">BoardBuilder</h1>
      </div>

      <div className="pl-[30px] flex items-center justify-center">
        <div className="border-2 border-dashed border-[#f5f4f4] rounded-[30px] h-[50vh] sm:h-[60vh] w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw]">
          {imageFromChangeBG ? (
            <TransformWrapper>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <img
                  ref={imgGalaryRef}
                  src={imageFromChangeBG}
                  alt="Selected"
                  style={imgStyle}
                />
              </TransformComponent>
            </TransformWrapper>
          ) : (
            imagefromGalary && (
              <TransformWrapper>
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <img
                    ref={imgGalaryRef}
                    src={imagefromGalary}
                    alt="Selected"
                    style={imgStyle}
                  />
                </TransformComponent>
              </TransformWrapper>
            )
          )}
        </div>
      </div>

      <div className="flex justify-center items-center h-full">
        <div className="container flex items-center justify-between py-5 sm:py-3 text-[#8B8B8B] w-full gap-x-20">
          <label htmlFor="fileInput1" className="m-3 flex justify-center pl-4">
            <div className="flex items-center w-auto px-3 text-white bg-[#363636] p-2 gap-2 rounded">
              <img
                src={changeBg}
                alt="Change Background Icon"
                className="h-5 w-5 text-wrap"
              />
              <span>Change Background</span>
              <input
                type="file"
                accept="image/*"
                id="fileInput1"
                className="hidden"
                onChange={handleChangeBackground}
              />
            </div>
          </label>

          <img
            src={deletee}
            alt="Delete"
            className="right-2 w-56 h-10 bg-black text-white bg-transparent px-4 py-2 rounded-full"
            onClick={handleDelete}
          />
        </div>
      </div>

      <div className="bg-black py-5 h-[10vh] w-full mt-[1vh] flex items-center justify-center">
        <div
          className="bg-[#0085FF] h-10 flex items-center justify-center text-black w-full max-w-xs sm:w-50 sm:bottom-0 md:max-w-sm lg:max-w-md xl:max-w-lg rounded-full font-bold px-4 cursor-pointer"
          onClick={showCroppedImage}
        >
          Save Mobile View
        </div>
      </div>
    </div>
  );
};

export default ImageFromGalary;
