// import React, { useState, useRef, useCallback } from "react";
// import Webcam from "react-webcam";
// import handleBack from "../../../assets/handleBack.svg";
// import EditBoard from "../EditBoard";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineFlipCameraIos } from "react-icons/md";

// const ImageFromCamera = () => {
//   const [cameraImage, setCameraImage] = useState(null);
//   const [showCamera, setShowCamera] = useState(true);
//   const [useFrontCamera, setUseFrontCamera] = useState(false);
//   const webcamRef = useRef(null);
//   const navigate = useNavigate(); const [SelectedImage, setSelectedImage] = useState();

//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCameraImage(imageSrc);
//     setShowCamera(false);
//   }, [webcamRef]);

//   const handleBackFunction = () => {
//     navigate("/create-new-board");
//   };
//   const handleReceiveImageUrl = (url) => {
//     setCameraImage(url);
//   };
//   const videoConstraints = {
//     facingMode: useFrontCamera ? "user" : { exact: "environment" },
//   };

//   const handleSwitchCamera = () => {
//     setUseFrontCamera((prev) => !prev);
//   };

//   const handleImageFromCamera = async (event) => {
//     console.log("camera clicked");

//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0]; // Changed to access the first file instead of the second
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = async () => {
//           setImageFromChangeBG(reader.result);

//           const formData = new FormData();
//           formData.append("file", file);

//           // Add your code to handle formData here
//         };
//         reader.readAsDataURL(file);

//         const storedToken = localStorage.getItem("token");
//         console.log("before try");

//         try {
//           const response = await fetch(
//             `${baseURL}/file-upload/uploadFile`,
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${storedToken}`,
//               },
//               body: formData,
//             }
//           );

//           if (response.ok) {
//             const result = await response.json();
//             const imageUrl = result.data.url;

//             setSelectedImage(imageUrl);
//             navigate("/board-builder-edit-board", { state: { imageSrc: reader.result, imageUrl } })

//             console.log("imageFromChangeBG", imageUrl);
//           } else {
//             console.error(
//               "Failed to upload file",
//               response.status,
//               response.statusText
//             );
//           }
//         } catch (error) {
//           console.error("Error uploading file:", error);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   }
//   return (
//     <div className="justify-center items-center">

//       <div className=" container flex px-3 justify-center items-center  gap-x-26">
//         <button className="h-auto w-20   flex items-center" onClick={handleBackFunction}>
//           <img src={handleBack} className="text-3xl border-white" alt="Go Back" />
//         </button>
//         <div
//           onClick={handleSwitchCamera}
//           className="w-12 h-12 pl-80  text-white rounded"
//         ><MdOutlineFlipCameraIos className="w-8 h-8" />
//         </div>
//       </div>
//       <div className="flex flex-col items-center space-y-4">
//         {showCamera && (
//           <div className="flex flex-col items-center ">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               videoConstraints={videoConstraints}
//               mirrored={true}
//               screenshotFormat="image/jpeg"
//               className="w-full h-full bg-gray-300"
//             />
//             <button
//               onClick={capture}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//               onClickCapture={handleImageFromCamera}
//             >
//               Capture Photo
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageFromCamera;


/// latest one

// import React, { useState, useRef, useCallback } from "react";
// import Webcam from "react-webcam";
// import handleBack from "../../../assets/handleBack.svg";
// import { useNavigate } from "react-router-dom";
// import { MdOutlineFlipCameraIos } from "react-icons/md";
// import { baseURL } from "../../../Constants/urls";

// const ImageFromCamera = () => {
//   const [cameraImage, setCameraImage] = useState(null);
//   const [showCamera, setShowCamera] = useState(true);
//   const [useFrontCamera, setUseFrontCamera] = useState(false);
//   const webcamRef = useRef(null);
//   const navigate = useNavigate();
//   const [selectedImage, setSelectedImage] = useState(null);

//   const capture = useCallback(async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCameraImage(imageSrc);
//     setShowCamera(false);

//     const file = await (await fetch(imageSrc)).blob();
//     const formData = new FormData();
//     formData.append("file", file);

//     const storedToken = localStorage.getItem("token");

//     try {
//       const response = await fetch(`${baseURL}/file-upload/uploadFile`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${storedToken}`,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const imageUrl = result.data.url;
//         setSelectedImage(imageUrl);
//         navigate("/board-builder-edit-board", {
//           state: { imageSrc: imageSrc, imageUrl: imageUrl },
//         });
//       } else {
//         console.error(
//           "Failed to upload file",
//           response.status,
//           response.statusText
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   }, [webcamRef, navigate]);

//   const handleBackFunction = () => {
//     navigate("/create-new-board");
//   };

//   const handleSwitchCamera = () => {
//     setUseFrontCamera((prev) => !prev);
//   };

//   const videoConstraints = {
//     facingMode: useFrontCamera ? "user" : { exact: "environment" },
//   };

//   return (
//     <div className="justify-center items-center">
//       <div className="container top-2 flex px-3 justify-center items-center gap-x-20">
//         <button
//           className="h-auto w-20 flex items-center"
//           onClick={handleBackFunction}
//         >
//           <img
//             src={handleBack}
//             className="text-3xl border-white"
//             alt="Go Back"
//           />
//         </button>
//         <div
//           onClick={handleSwitchCamera}
//           className="w-12 h-12 pl-80 text-white rounded"
//         >
//           <MdOutlineFlipCameraIos className="w-8 h-8" />
//         </div>
//       </div>
//       <div className="flex flex-col items-center space-y-4">
//         {showCamera && (
//           <div className="flex flex-col items-center">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               videoConstraints={videoConstraints}
//               mirrored={true}
//               screenshotFormat="image/jpeg"
//               className="w-full h-full bg-gray-300"
//             />
//             <button
//               onClick={capture}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Capture Photo
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageFromCamera;
