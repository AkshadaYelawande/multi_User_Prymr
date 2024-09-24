import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Cropper from "react-easy-crop";
import handleBack from "../../../assets/handleBack.svg";
import yellowpluscircle from "../../../assets/yellowpluscircle.svg";
import changeBg from "../../../assets/changeBg.png";
import deletee from "../../../assets/redDelete.svg";
import fullScreen from "../../../assets/fullScreen.svg";
import getCroppedImg from "./CroppedImage";
import "./create.css";
import { baseURL } from "../../../Constants/urls";
import { FiFolderPlus } from "react-icons/fi";

const SaveDesktopView = () => {
  const location = useLocation();
  const { imagefromGalary, imageUrl } = location.state || {};
  const navigate = useNavigate();
  const imgGalaryRef = useRef();

  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log("Cropped area:", croppedArea);
    console.log("Cropped area pixels:", croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(
        imagefromGalary,
        croppedAreaPixels
      );
      setCroppedImage(croppedImageUrl);
      const encodedUrl = encodeURIComponent(croppedImageUrl);
      navigate("/create/new-board/desktop-view", {
        state: { imageUrl },
      });
    } catch (e) {
      console.error(e);
      console.log("catch error in save desktop boards", e);
      navigate("/create/new-board/desktop-view", {
        state: { imagefromGalary, imageUrl },
      });
    }
  };

  const handleChangeBackground = async (event) => {
    console.log("handleChangeBackground clicked");

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result;
        setImageFromChangeBG(imageDataUrl);

        const formData = new FormData();
        formData.append("file", file);

        const storedToken = localStorage.getItem("token");

        try {
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

            navigate("/create-new-board-galary", {
              state: { imageFromChangeBG: imageDataUrl, imageUrl },
            });

            console.log("imageFromChangeBG", imageUrl);
          } else {
            console.error(
              "Failed to upload file",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (file) {
      handleChangeBackground(file);
    }
  }, [file]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <div className="container sm:pl-4">
      <div className="flex items-center h-[10vh] w-full">
        <button className="flex w-auto h-auto" onClick={handleBackFunction}>
          <img src={handleBack} alt="Back" className="text-3xl border-white" />
        </button>
        <h1 className="font-bold text-xl text-white ml-4">BoardBuilder</h1>
      </div>
      <div className=" flex items-center justify-center mt-[22vh]">
        {
          / <div className="border-2 border-dashed border-[#f5f4f4] rounded-[30px] h-[50vh] sm:h-[60vh] w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw]"> /
        }
        <div className="border-2 border-dashed border-[#f5f4f4] rounded-[30px] h-[30vh] w-[70vw]">
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

      <div className="container flex items-center justify-between  sm:py-3 text-[#8B8B8B] w-full gap-x-15">
        <label htmlFor="fileInput1" className="m-3 flex justify-center pl-4">
          <div className="flex items-center w-auto px-3 text-white bg-[#363636]  gap-2 rounded">
            <img
              src={changeBg}
              alt="Change Background Icon"
              className="h-5 w-5 text-wrap"
            />
            <span className="w-[50vw]">Change Background</span>
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
      <div className=" fixed bottom-2 py-5 h-[10vh] w-full mt-[1vh] flex items-center justify-center">
        <div
          className="bg-[#0085FF] h-10 flex items-center justify-center text-black w-full max-w-xs sm:w-50 sm:bottom-0 md:max-w-sm lg:max-w-md xl:max-w-lg rounded-full font-bold px-4 cursor-pointer"
          onClick={showCroppedImage}
        >
          Save Desktop View
        </div>
      </div>
    </div>
  );
};

export default SaveDesktopView;
