import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backarrow from "../../../assets/backarrow.png";
import BellNotification from "../../../assets/BellNotification.png";
import PlusImage from "../../../assets/plusImage.png";
import WalletImage from "../../../assets/wallet.png";
import CircleImage from "../../../assets/circle.png";
import logoutRedBtn from "../../../assets/logoutRedBtn.png";
import Navbar from "../../common/Navbar";
import { baseURL } from "../../../Constants/urls";
import { useToastManager } from "../../Context/ToastContext";
import ProfileMenu from "../../../Profile Settings/ProfileMenu";
import { LuShare2 } from "react-icons/lu";
import Masonry from "react-masonry-css";
import { PropagateLoader } from "react-spinners";

const EmailSentNotification = ({ emailRequestSentMessage }) => {
  return (
    <div className="flex items-center justify-center mt-5 w-full">
      <div className="bg-blue-500 text-white px-2 py-2  shadow-lg text-center w-3/4">
        <p className="text-md mb-2">
          {emailRequestSentMessage
            ? emailRequestSentMessage
            : `An email was sent to the email associated with your account`}
        </p>
        {!emailRequestSentMessage && (
          <p className="text-md font-bold">Thank you!!</p>
        )}
      </div>
    </div>
  );
};

const VisitorProfile = () => {
  const navigate = useNavigate();
  const toast = useToastManager();
  const [profileData, setProfileData] = useState(null);
  const userRole = localStorage.getItem("userRole");

  const [editedData, setEditedData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emailRequestSent, setEmailRequestSent] = useState(false);

  const [isFullImage, setIsFullImage] = useState(false);

  const [fullImageUrl, setFullImageUrl] = useState();
  const [fullImageId, setFullImageId] = useState();
  const [currentBoardId, setCurrentBoardId] = useState();

  const [tappableAreas, setTappableAreas] = useState([]);

  const [emailRequestSentMessage, setEmailRequestSentMessage] = useState("");

  const profileImage = localStorage.getItem("profileImage");
  const initialIconUrl = localStorage.getItem("initialProfileIcon");

  console.log(profileImage);
  console.log(initialIconUrl);
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/auth/getProfileDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile details response:", response.data);
      if (response.data.status) {
        setProfileData(response.data.data);
        setEditedData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  const handleRemoveProfileIcon = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/auth/removeProfileIcon`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setProfileData((prevData) => ({
          ...prevData,
          profileIconUrl: initialIconUrl,
        }));
        toast("Profile icon removed successfully", "success");
        localStorage.removeItem("profileImage");
        setShowPopup(false);
      } else {
        toast("Failed to remove profile icon", "error");
      }
    } catch (error) {
      console.error("Error removing profile icon:", error);
      toast("Error removing profile icon", "error");
    }
  };

  const handleBack = () => {
    navigate("/prymr");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("initialIconUrl");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  // Toggle editing state
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Toggle popup visibility
  const handleIconClick = () => {
    setShowPopup(!showPopup);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Make sure the key matches what your API expects

      try {
        const token = localStorage.getItem("token");

        // Upload the file to the file-upload API
        const uploadResponse = await axios.post(
          `${baseURL}/file-upload/uploadFile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.data.status) {
          // Extract the uploaded image URL
          const imageUrl = uploadResponse.data.data.url;
          console.log("Image uploaded successfully. URL:", imageUrl);

          // Prepare payload for updating profile icon
          const payload = { imageUrl };
          console.info("Payload for profile icon update:", payload);

          // Call the API to update the profile icon
          const response = await axios.post(
            `${baseURL}/auth/uploadProfileIcon`,
            { image: imageUrl },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.status) {
            setProfileData((prevData) => ({
              ...prevData,
              profileIconUrl: imageUrl,
            }));
            localStorage.setItem("profileImage", imageUrl);
            toast("Profile icon updated successfully", "success");
            setShowPopup(false);
          } else {
            toast("Failed to update profile icon", "error");
          }
        } else {
          toast("Failed to upload image", "error");
        }
      } catch (error) {
        console.error("Error updating profile icon:", error);
        toast("Error updating profile icon", "error");
      }
    }
  };
  if (!profileData) {
    return <div>Loading...</div>;
  }
  // my-earning

  const menuList = [
    { name: "My Earnings", icons: WalletImage, count: 12, url: "/my-earning" },
    // {
    //   name: "Subscription",
    //   icons: CircleImage,
    //   count: 0,
    //   url: "/#",
    // },
    {
      name: "Become a Prymr Creator",
      icons: PlusImage,
      count: 0,
      url: "/became-creator",
    },
  ];

  const handlenavigate = (url) => {
    navigate(url);
  };

  const handleEmailRequest = async () => {
    setEmailRequestSent(false);
    setEmailRequestSentMessage("");

    const token = localStorage.getItem("token");

    const apiUrl = `${baseURL}` + `/auth/sendRequestToBecomeCreator`;
    console.log("apiUrl", apiUrl);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
    };
    await fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEmailRequestSent(true);

        console.log("Success:", data.message);
        setEmailRequestSentMessage(data?.message || "");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const closeFullImage = () => {
    setIsFullImage(false);
    setFullImageUrl("");
    setFullImageId("");
  };

  const displayFullImage = async (
    url,
    imageId,
    boardId,
    isPublic,
    isPrivate
  ) => {
    // setFullImageUrl(url);
    // setFullImageId(imageId);
    // setCurrentBoardId(boardId);
    // if (isPublic) {
    //   setCurrentPublicBoardId(boardId);
    //   setCurrentPublicBoardImageId(imageId);
    //   await fetchAreas(boardId, imageId);
    // } else {
    //   setCurrentPrivateBoardId(boardId);
    //   setCurrentPrivateBoardImageId(imageId);
    //   await fetchAreas(boardId, imageId);
    // }
    // if (isPrivate) {
    //   setCurrentPublicBoardId(boardId);
    //   setCurrentPublicBoardImageId(imageId);
    //   await fetchAreas(boardId, imageId);
    // } else {
    //   setCurrentPrivateBoardId(boardId);
    //   setCurrentPrivateBoardImageId(imageId);
    //   await fetchAreas(boardId, imageId);
    // }
    // setIsFullImage(true);
  };

  return (
    <>
      <div className=" lg:w-[30%] bg-black text-white ">
        <div className="w-full flex justify-between items-center px-4 py-2">
          <div className="w-2/4">
            <img
              src={backarrow}
              alt="Back Arrow"
              className="w-4 h-4 cursor-pointer"
              onClick={handleBack}
            />
          </div>
          <div className="w-2/4 flex justify-end">
            <LuShare2 color="white" />
          </div>
        </div>
        <header
          className={`flex  items-start flex-col p-4 ${showPopup ? "" : ""}`}
        >
          <div className="flex items-center  space-x-2">
            <div className="relative">
              <img
                src={profileImage || initialIconUrl}
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer bg-gray-100"
                style={{ objectFit: "contain" }}
                onClick={handleIconClick}
              />
            </div>
            <div className="text-sm">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={editedData.firstName}
                    onChange={handleChange}
                    className="bg-gray-800 text-white p-1 rounded"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={editedData.lastName}
                    onChange={handleChange}
                    className="bg-gray-800 text-white p-1 rounded mt-1"
                  />
                </>
              ) : (
                <>
                  <div>{`${profileData.firstName} ${profileData.lastName}`}</div>
                  <div className="text-[#ffffff]">{profileData.email}</div>
                </>
              )}
            </div>
          </div>
          <div className="pl-7 -mt-3">
            <button
              className="text-blue-500   cursor-pointer"
              // onClick={isEditing ? handleSave : handleEdit}
            >
              edit
              {/* {isEditing ? "Save" : "Edit"} */}
            </button>
          </div>
        </header>

        {showPopup && (
          <div className="absolute m-5 ml-[5vw] bg-gray-800 p-2 rounded shadow-lg z-10">
            <button
              className="text-white bg-blue-500 px-2 py-1 rounded mb-2"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Change Profile
            </button>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className="text-white bg-red-500 px-2 py-1 rounded"
              onClick={handleRemoveProfileIcon}
            >
              Remove Profile
            </button>
          </div>
        )}

        {/* <nav
        className={`p-4 ${
          showPopup
            ? "mt-8 transition-transform duration-300 ease-in-out transform translate-y-16"
            : ""
        }`}
      >
        <ul className="space-y-4">
          {menuList?.map((menu) => (
            <li
              className="flex items-center gap-5"
              onClick={() => handlenavigate(menu?.url)}
            >
              <span className="flex gap-2 items-center">
                <img
                  src={menu?.icons ? menu?.icons : BellNotification}
                  alt="Notification"
                  className="w-8 h-8"
                />
                {menu?.name}
              </span>
              {menu?.count > 0 && (
                <span className="bg-yellow-500 text-black rounded-full px-2 py-1">
                  {menu?.count}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav> */}

        <ProfileMenu setTappableAreas={setTappableAreas} />

        <footer className="p-4 pb-20   w-full">
          <button
            className="text-[#FF0404] text-2xl cursor-pointer flex gap-3"
            onClick={handleLogout}
          >
            <img src={logoutRedBtn} className="h-6 w-6 mt-1" alt="Logout" />
            Log Out
          </button>
        </footer>
        <Navbar />
      </div>
      <div className="lg:w-[70%]">
        {isFullImage && (
          <Suspense fallback={<div>Loading full image...</div>}>
            <div className="w-full h-full">
              {(currentPublicBoardId && currentPublicBoardImageId) ||
              (currentPrivateBoardId && currentPrivateBoardImageId) ? (
                <FullImageWithTappables
                  imageUrl={fullImageUrl}
                  imageId={fullImageId}
                  boardId={currentBoardId}
                  onClose={closeFullImage}
                  closeFullImage={closeFullImage}
                  tappableAreas={tappableAreas}
                  reactionId={reactionId}
                  setReactionId={setReactionId}
                  singleTappableId={singleTappableId}
                  singleReactionId={singleReactionId}
                />
              ) : (
                <div>
                  Loading <PropagateLoader color="white" />
                </div>
              )}
            </div>
          </Suspense>
        )}
      </div>
    </>
  );
};

export default VisitorProfile;

// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import backarrow from "../../../assets/backarrow.png";
// // import BellNotification from "../../../assets/BellNotification.png";
// // import logoutRedBtn from "../../../assets/logoutRedBtn.png";
// // import Navbar from "../../common/Navbar";
// // import { baseURL } from "../../../Constants/urls";
// // import { useToastManager } from "../../Context/ToastContext";

// // const VisitorProfile = () => {
// //   const navigate = useNavigate();
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [profileData, setProfileData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     userName: "",
// //     profileDescription: "",
// //     follower: 0,
// //     following: 0,
// //     board: 0,
// //   });
// //   const [editedData, setEditedData] = useState({});
// //   const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
// //   const toast = useToastManager(); // For showing toast notifications

// //   const profileImage = localStorage.getItem("profileImage");
// //   const initialIconUrl = localStorage.getItem("initialIconUrl");

// //   useEffect(() => {
// //     console.log("Fetching profile details...");
// //     fetchProfileDetails();
// //   }, []);

// //   // Fetch profile details from the backend
// //   const fetchProfileDetails = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       console.log("Fetching with token:", token);
// //       const response = await axios.get(`${baseURL}/auth/getProfileDetails`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       console.log("Profile details response:", response.data);
// //       if (response.data.status) {
// //         setProfileData(response.data.data);
// //         setEditedData(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching profile details:", error);
// //     }
// //   };

// //   // Navigate back to home
// //   const handleBack = () => {
// //     console.log("Navigating back to home");
// //     navigate("/home");
// //   };

// //   // Logout and clear session data
// //   const handleLogout = () => {
// //     console.log("Logging out and clearing localStorage");
// //     localStorage.clear(); // Clears all local storage items
// //     navigate("/");
// //   };

// //   // Toggle editing state
// //   const handleEdit = () => {
// //     console.log("Entering edit mode");
// //     setIsEditing(true);
// //   };

// //   // Save the edited profile data
// //   const handleSave = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       console.log("Saving profile data with token:", token);
// //       console.log("Edited data:", editedData);
// //       const response = await axios.put(
// //         `${baseURL}/auth/updateProfileDetails`,
// //         editedData,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       console.log("Save response:", response.data);

// //       if (response.data.status) {
// //         setProfileData(editedData);
// //         setIsEditing(false);
// //         toast("Profile updated successfully.", { type: "success" });
// //       } else {
// //         toast("Profile update failed.", { type: "error" });
// //       }
// //     } catch (error) {
// //       console.error("Error updating profile:", error);
// //       toast("Error updating profile.", { type: "error" });
// //     }
// //   };

// //   // Update profile data when input changes
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     console.log("Input changed:", { name, value });
// //     setEditedData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Remove profile icon
// //   const handleRemoveProfileIcon = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       console.log("Removing profile icon with token:", token);
// //       const response = await axios.post(
// //         `${baseURL}/auth/removeProfileIcon`,
// //         {},
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       console.log("Remove icon response:", response.data);

// //       if (response.data.status) {
// //         localStorage.removeItem("profileImage");
// //         setProfileData((prev) => ({ ...prev, profileImage: null }));
// //         toast("Profile icon removed successfully.", { type: "success" });
// //         setShowPopup(false);
// //       } else {
// //         toast("Failed to remove profile icon.", { type: "error" });
// //       }
// //     } catch (error) {
// //       console.error("Error removing profile icon:", error);
// //       toast("An error occurred while removing the profile icon.", {
// //         type: "error",
// //       });
// //     }
// //   };

// //   // Upload and update the profile icon
// //   const handleUploadProfileIcon = async (file) => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       console.log("Uploading profile icon with token:", token);
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       console.log("Form data for file upload:", file);

// //       // Upload the file
// //       const uploadResponse = await axios.post(
// //         `${baseURL}/file-upload/uploadFile`,
// //         formData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "multipart/form-data",
// //           },
// //         }
// //       );
// //       console.log("File upload response:", uploadResponse.data);

// //       if (uploadResponse.data.status) {
// //         const imageUrl = uploadResponse.data.data.url;
// //         console.log("Uploaded image URL:", imageUrl);

// //         const response = await axios.post(
// //           `${baseURL}/auth/uploadProfileIcon`,
// //           { image: imageUrl },
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           }
// //         );
// //         console.log("Profile icon update response:", response.data);

// //         if (response.data.status) {
// //           localStorage.setItem("profileImage", imageUrl);
// //           setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
// //           toast("Profile icon updated successfully.", { type: "success" });
// //           setShowPopup(false);
// //         } else {
// //           toast("Failed to update profile icon.", { type: "error" });
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error uploading profile icon:", error);
// //       toast("An error occurred while uploading the profile icon.", {
// //         type: "error",
// //       });
// //     }
// //   };

// //   // Toggle popup visibility
// //   const handleIconClick = () => {
// //     console.log("Toggling popup visibility");
// //     setShowPopup(!showPopup);
// //   };

// //   // Handle file input change
// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     console.log("File selected for upload:", file);
// //     if (file) {
// //       handleUploadProfileIcon(file);
// //     }
// //   };

//   return (
//     <div className="h-screen lg:w-[30%] bg-black text-white">
//       <header
//         className={`flex bg-[#191919] items-center justify-between p-4 ${
//           showPopup ? "" : ""
//         }`}
//       >
//         <div className="flex items-center space-x-2">
//           <img
//             src={backarrow}
//             alt="Back Arrow"
//             className="w-4 h-4 cursor-pointer"
//             onClick={handleBack}
//           />
//           <div className="relative">
//             <img
//               src={profileImage || initialIconUrl}
//               alt="User"
//               className="w-8 h-8 rounded-full cursor-pointer"
//               onClick={handleIconClick}
//             />
//           </div>
//           <div className="text-sm">
//             {isEditing ? (
//               <>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={editedData.firstName}
//                   onChange={handleChange}
//                   className="bg-gray-800 text-white p-1 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={editedData.lastName}
//                   onChange={handleChange}
//                   className="bg-gray-800 text-white p-1 rounded mt-1"
//                 />
//               </>
//             ) : (
//               <>
//                 <div>{`${profileData.firstName} ${profileData.lastName}`}</div>
//                 <div>{profileData.email}</div>
//               </>
//             )}
//           </div>
//         </div>
//         <div>
//           <button
//             className="text-blue-500 ml-auto mr-5 cursor-pointer"
//             onClick={isEditing ? handleSave : handleEdit}
//           >
//             {isEditing ? "Save" : "Edit"}
//           </button>
//         </div>
//       </header>

//       {showPopup && (
//         <div className="absolute m-5 ml-[5vw] bg-gray-800 p-2 rounded shadow-lg z-10">
//           <button
//             className="text-white bg-blue-500 px-2 py-1 rounded mb-2"
//             onClick={() => document.getElementById("fileInput").click()}
//           >
//             Change Profile
//           </button>
//           <input
//             type="file"
//             id="fileInput"
//             className="hidden"
//             accept="image/*"
//             onChange={handleFileChange}
//           />
//           <button
//             className="text-white bg-red-500 px-2 py-1 rounded"
//             onClick={handleRemoveProfileIcon}
//           >
//             Remove Profile
//           </button>
//         </div>
//       )}

//       <div className="p-4">
//         <h2 className="text-xl font-bold mb-2">Profile Information</h2>
//         <div>
//           <label>Username:</label>
//           <p>{profileData.userName}</p>
//         </div>
//         <div>
//           <label>Description:</label>
//           {isEditing ? (
//             <textarea
//               name="profileDescription"
//               value={editedData.profileDescription}
//               onChange={handleChange}
//               className="w-full p-2 rounded bg-gray-800 text-white"
//             />
//           ) : (
//             <p>{profileData.profileDescription}</p>
//           )}
//         </div>

//         <div className="flex justify-between mt-4">
//           <div>
//             <label>Followers:</label>
//             <p>{profileData.follower}</p>
//           </div>
//           <div>
//             <label>Following:</label>
//             <p>{profileData.following}</p>
//           </div>
//           <div>
//             <label>Boards:</label>
//             <p>{profileData.board}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VisitorProfile;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import backarrow from "../../../assets/backarrow.png";
// import BellNotification from "../../../assets/BellNotification.png";
// import logoutRedBtn from "../../../assets/logoutRedBtn.png";
// import Navbar from "../../common/Navbar";
// import { baseURL } from "../../../Constants/urls";
// import { useToastManager } from "../../Context/ToastContext";

// const VisitorProfile = () => {
//   const navigate = useNavigate();
//   const toast = useToastManager();
//   const [profileData, setProfileData] = useState(null);
//   const userRole = localStorage.getItem("userRole");

//   const [editedData, setEditedData] = useState({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const profileImage = localStorage.getItem("profileImage");
//   const initialIconUrl = localStorage.getItem("initialProfileIcon");

//   console.log(profileImage);
//   console.log(initialIconUrl);
//   useEffect(() => {
//     fetchProfileDetails();
//   }, []);

//   const fetchProfileDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseURL}/auth/getProfileDetails`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Profile details response:", response.data);
//       if (response.data.status) {
//         setProfileData(response.data.data);
//         setEditedData(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching profile details:", error);
//     }
//   };

//   const handleRemoveProfileIcon = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${baseURL}/auth/removeProfileIcon`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status) {
//         setProfileData((prevData) => ({
//           ...prevData,
//           profileIconUrl: initialIconUrl,
//         }));
//         toast("Profile icon removed successfully", "success");
//         localStorage.removeItem("profileImage");
//         setShowPopup(false);
//       } else {
//         toast("Failed to remove profile icon", "error");
//       }
//     } catch (error) {
//       console.error("Error removing profile icon:", error);
//       toast("Error removing profile icon", "error");
//     }
//   };

//   const handleBack = () => {
//     navigate("/home");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("profileImage");
//     localStorage.removeItem("initialIconUrl");
//     navigate("/");
//   };

//   // Toggle editing state
//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   // Toggle popup visibility
//   const handleIconClick = () => {
//     setShowPopup(!showPopup);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedData((prev) => ({ ...prev, [name]: value }));
//   };

//   // const handleFileChange = async (e) => {
//   //   const file = e.target.files[0];
//   //   if (file) {
//   //     const formData = new FormData();
//   //     formData.append("profileIcon", file);

//   //     try {
//   //       const token = localStorage.getItem("token");
//   //       const response = await axios.post(
//   //         `${baseURL}/auth/uploadProfileIcon`,
//   //         formData,
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //             "Content-Type": "multipart/form-data",
//   //           },
//   //         }
//   //       );

//   //       if (response.data.status) {
//   //         setProfileData((prevData) => ({
//   //           ...prevData,
//   //           profileIconUrl: response.data.data.profileIconUrl,
//   //         }));
//   //         localStorage.setItem(
//   //           "profileImage",
//   //           response.data.data.profileIconUrl
//   //         );
//   //         toast("Profile icon updated successfully", "success");
//   //         setShowPopup(false);
//   //       } else {
//   //         toast("Failed to update profile icon", "error");
//   //       }
//   //     } catch (error) {
//   //       console.error("Error uploading profile icon:", error);
//   //       toast("Error uploading profile icon", "error");
//   //     }
//   //   }
//   // };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file); // Make sure the key matches what your API expects

//       try {
//         const token = localStorage.getItem("token");

//         // Upload the file to the file-upload API
//         const uploadResponse = await axios.post(
//           `${baseURL}/file-upload/uploadFile`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         if (uploadResponse.data.status) {
//           // Extract the uploaded image URL
//           const imageUrl = uploadResponse.data.data.url;
//           console.log("Image uploaded successfully. URL:", imageUrl);

//           // Prepare payload for updating profile icon
//           const payload = { imageUrl };
//           console.info("Payload for profile icon update:", payload);

//           // Call the API to update the profile icon
//           const response = await axios.post(
//             `${baseURL}/auth/uploadProfileIcon`,
//             { image: imageUrl },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           if (response.data.status) {
//             setProfileData((prevData) => ({
//               ...prevData,
//               profileIconUrl: imageUrl,
//             }));
//             localStorage.setItem("profileImage", imageUrl);
//             toast("Profile icon updated successfully", "success");
//             setShowPopup(false);
//           } else {
//             toast("Failed to update profile icon", "error");
//           }
//         } else {
//           toast("Failed to upload image", "error");
//         }
//       } catch (error) {
//         console.error("Error updating profile icon:", error);
//         toast("Error updating profile icon", "error");
//       }
//     }
//   };
//   if (!profileData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="h-screen lg:w-[30%] bg-black text-white">
//       <header
//         className={`flex bg-[#191919] items-center justify-between p-4 ${
//           showPopup ? "" : ""
//         }`}
//       >
//         <div className="flex items-center space-x-2">
//           <img
//             src={backarrow}
//             alt="Back Arrow"
//             className="w-4 h-4 cursor-pointer"
//             onClick={handleBack}
//           />
//           <div className="relative">
//             <img
//               src={profileImage || initialIconUrl}
//               alt="User"
//               className="w-8 h-8 rounded-full cursor-pointer"
//               onClick={handleIconClick}
//             />
//           </div>
//           <div className="text-sm">
//             {isEditing ? (
//               <>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={editedData.firstName}
//                   onChange={handleChange}
//                   className="bg-gray-800 text-white p-1 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={editedData.lastName}
//                   onChange={handleChange}
//                   className="bg-gray-800 text-white p-1 rounded mt-1"
//                 />
//               </>
//             ) : (
//               <>
//                 <div>{`${profileData.firstName} ${profileData.lastName}`}</div>
//                 <div>{profileData.email}</div>
//               </>
//             )}
//           </div>
//         </div>
//         <div>
//           <button
//             className="text-blue-500 ml-auto mr-5 cursor-pointer"
//             // onClick={isEditing ? handleSave : handleEdit}
//           >
//             Edit
//             {/* {isEditing ? "Save" : "Edit"} */}
//           </button>
//         </div>
//       </header>

//       {showPopup && (
//         <div className="absolute m-5 ml-[5vw] bg-gray-800 p-2 rounded shadow-lg z-10">
//           <button
//             className="text-white bg-blue-500 px-2 py-1 rounded mb-2"
//             onClick={() => document.getElementById("fileInput").click()}
//           >
//             Change Profile
//           </button>
//           <input
//             type="file"
//             id="fileInput"
//             className="hidden"
//             accept="image/*"
//             onChange={handleFileChange}
//           />
//           <button
//             className="text-white bg-red-500 px-2 py-1 rounded"
//             onClick={handleRemoveProfileIcon}
//           >
//             Remove Profile
//           </button>
//         </div>
//       )}

//       <nav
//         className={`p-4 ${
//           showPopup
//             ? "mt-8 transition-transform duration-300 ease-in-out transform translate-y-16"
//             : ""
//         }`}
//       >
//         <ul className="space-y-4">
//           <li className="flex items-center justify-between">
//             <span className="flex gap-4">
//               <img src={BellNotification} alt="Notification" />
//               Notifications
//             </span>
//             <span className="bg-yellow-500 text-black rounded-full px-2 py-1">
//               127
//             </span>
//           </li>
//         </ul>
//       </nav>

//       <footer className="p-4 fixed bottom-12 w-full">
//         <button
//           className="text-[#FF0404] text-2xl cursor-pointer flex gap-3"
//           onClick={handleLogout}
//         >
//           <img src={logoutRedBtn} className="h-6 w-6 mt-1" alt="Logout" />
//           Log Out
//         </button>
//       </footer>
//       <Navbar />
//     </div>
//   );
// };

// export default VisitorProfile;
