import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import deletee from "../../assets/delete.svg";
import heart from "../../assets/heart.svg";
import redHeart from "../../assets/redHeart.svg";
import Avatar_pizzaboy from "../../assets/Avatar_pizzaboy.png";
import XIcon from "../../assets/X.svg";
import { baseURL } from "../../Constants/urls";

const ViewReaction = ({
  reactionData,
  onClose,
  addReactionLike,
  removeReactionLike,
  // reaction,
  deleteReaction,
  selectedEmoji,
}) => {
  console.log("canDelete : ", selectedEmoji);
  const [likeCount, setLikeCount] = useState(
    reactionData?.data?.data?.likesCount || reactionData?.data?.data?.totalLikes
  );
  const [isLiked, setIsLiked] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const componentRef = useRef(null);
  const [adjustment, setAdjustment] = useState({ x: 0, y: 0 });
  const profileImage = localStorage.getItem("profileImage");
  const initialIconUrl = localStorage.getItem("initialProfileIcon");

  console.log("1334567", reactionData?.data?.data?.totalLikes);

  useEffect(() => {
    const updatePosition = () => {
      if (componentRef.current) {
        const rect = componentRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 20; // Padding from viewport edges

        let adjustX = 0;
        let adjustY = 0;

        // Check and adjust horizontally
        if (rect.right > viewportWidth - padding) {
          adjustX = viewportWidth - padding - rect.right;
        } else if (rect.left < padding) {
          adjustX = padding - rect.left;
        }

        // Check and adjust vertically
        if (rect.bottom > viewportHeight - padding) {
          adjustY = viewportHeight - padding - rect.bottom;
        } else if (rect.top < padding) {
          adjustY = padding - rect.top;
        }

        setAdjustment({ x: adjustX, y: adjustY });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  if (!reactionData) return null;

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long", // e.g., "Sunday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "August"
      day: "numeric", // e.g., "25"
      hour: "numeric", // e.g., "5 PM"
      minute: "numeric", // e.g., "01"
      second: "numeric", // e.g., "18"
      hour12: true, // 12-hour format with AM/PM
    });
  };

  const handleLikeClick = async () => {
    try {
      if (!isLiked) {
        // Add like
        const result = await addReactionLike({
          singleReactionId: reactionData.data.data.reactionId,
        });
        if (result) {
          setLikeCount((prevCount) => prevCount + 1);
          setIsLiked(true);
        }
      } else {
        // Remove like
        if (typeof removeReactionLike === "function") {
          const result = await removeReactionLike({
            singleReactionId: reactionData.data.data.reactionId,
          });
          if (result) {
            setLikeCount((prevCount) => prevCount - 1);
            // setIsLiked(false);
            setIsLiked(false);
          }
        } else {
          // Fallback behavior if removeReactionLike is not available
          console.warn(
            "removeReactionLike function is not available. Using fallback behavior."
          );
          setLikeCount((prevCount) => prevCount - 1);
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Optionally, you can show an error message to the user here
    }
  };
  const handleDeleteClick = async () => {
    try {
      await deleteReaction(reactionData.data.data.reactionId);
      onClose(); // Close the reaction view after deletion
    } catch (error) {
      console.error("Error deleting reaction:", error);
    }
  };

  const canDelete = reactionData.data.data.youCanDeleteThisReaction;
  console.log(reactionData.data.data);
  const hasContentUrl = reactionData.data.data.contentUrl !== null;

  return (
    <div
      ref={componentRef}
      style={{
        width: "314px",
        backgroundColor: "#303030",
        color: "white",
        borderRadius: "15px",
        padding: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transform: `translate(${adjustment.x}px, ${adjustment.y}px)`,
        transition: "transform 0.3s",
      }}
    >
      <div className="self-stretch justify-between items-center gap-2.5 flex">
        <div className="grow shrink basis-0 h-7 justify-start items-center gap-2.5 flex overflow-hidden">
          <div className="flex-shrink-0 w-7 h-7 p-0.5 bg-white rounded-[31px] border border-black justify-center items-center flex">
            <img
              className="w-full h-full object-cover rounded-[28.50px] border-white"
              src={profileImage || initialIconUrl}
              alt="Avatar"
            />
          </div>
          <div className="flex min-w-0 justify-between items-center gap-2.5">
            <div className="text-white text-sm font-bold font-['Nunito'] truncate">
              {reactionData.data.data.user.userName}
            </div>
            <div style={{ fontSize: "11px", color: "#9f9f9f" }}>
              {new Date(reactionData.data.data.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="cursor-pointer ml-2" onClick={onClose}>
          <img src={XIcon} alt="Close" />
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <div
          style={{
            flexGrow: 1,
            fontSize: "13px",
            overflowY: "auto",
            maxHeight: "75px",
          }}
        >
          {reactionData.data.data.contentText}
        </div>
        <div style={{ position: "relative", width: "75px", height: "75px" }}>
          <img
            className="bg-white"
            src={reactionData.data.data.backgroundCapture}
            style={{ width: "100%", height: "100%", borderRadius: "4px" }}
          />
          {selectedEmoji && (
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "-10px",
                fontSize: "18px",
              }}
            >
              {selectedEmoji}
            </div>
          )}
        </div>
      </div>

      {hasContentUrl && (
        <div style={{ marginBottom: "10px" }}>
          <img
            src={reactionData.data.data.contentUrl}
            style={{ width: "100%", borderRadius: "4px" }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: hasContentUrl ? "10px" : "0",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#389fff",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Reply
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {canDelete && (
            <button
              onClick={handleDeleteClick}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              🗑️
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleLikeClick}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
            <span style={{ fontSize: "14px", fontWeight: "semibold" }}>
              {likeCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReaction;

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import deletee from "../../assets/delete.svg";
// import heart from "../../assets/heart.svg";
// import redHeart from "../../assets/redHeart.svg";
// import Avatar_pizzaboy from "../../assets/Avatar_pizzaboy.png";
// import XIcon from "../../assets/X.svg";

// const ViewReaction = ({
//   reactionData,
//   onClose,
//   addReactionLike,
//   removeReactionLike,
//   deleteReaction,
// }) => {
//   const [likeCount, setLikeCount] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const componentRef = useRef(null);
//   const [adjustment, setAdjustment] = useState({ x: 0, y: 0 });
//   console.log(reactionData);
//   // Memoize the position update function to avoid unnecessary updates
//   const updatePosition = useCallback(() => {
//     if (componentRef.current) {
//       const rect = componentRef.current.getBoundingClientRect();
//       const viewportWidth = window.innerWidth;
//       const viewportHeight = window.innerHeight;
//       const padding = 20;

//       let adjustX = 0;
//       let adjustY = 0;

//       // Check and adjust horizontally
//       if (rect.right > viewportWidth - padding) {
//         adjustX = viewportWidth - padding - rect.right;
//       } else if (rect.left < padding) {
//         adjustX = padding - rect.left;
//       }

//       // Check and adjust vertically
//       if (rect.bottom > viewportHeight - padding) {
//         adjustY = viewportHeight - padding - rect.bottom;
//       } else if (rect.top < padding) {
//         adjustY = padding - rect.top;
//       }

//       setAdjustment({ x: adjustX, y: adjustY });
//     }
//   }, []);

//   // Only update position when the component mounts or on window resize
//   useEffect(() => {
//     updatePosition();
//     window.addEventListener("resize", updatePosition);
//     return () => {
//       window.removeEventListener("resize", updatePosition);
//     };
//   }, [updatePosition]);

//   useEffect(() => {
//     if (reactionData?.data?.data) {
//       const totalLikes =
//         reactionData.data.data.likesCount ||
//         reactionData.data.data.totalLikes ||
//         0;
//       setLikeCount(totalLikes);
//       setIsLiked(reactionData.data.data.youLikedIt || false);
//     }
//   }, [reactionData]);

//   const handleLikeClick = async () => {
//     if (!isLiked) {
//       try {
//         const result = await addReactionLike({
//           singleReactionId: reactionData.data.data.reactionId,
//         });
//         if (result) {
//           setLikeCount((prevCount) => prevCount + 1);
//           setIsLiked(true);
//         }
//       } catch (error) {
//         console.error("Error adding like:", error);
//       }
//     } else {
//       try {
//         const result = await removeReactionLike({
//           singleReactionId: reactionData.data.data.reactionId,
//         });
//         if (result) {
//           setLikeCount((prevCount) => Math.max(0, prevCount - 1));
//           setIsLiked(false);
//         }
//       } catch (error) {
//         console.error("Error removing like:", error);
//       }
//     }
//   };

//   const handleDeleteClick = async () => {
//     try {
//       await deleteReaction(reactionData.data.data.reactionId);
//       onClose();
//     } catch (error) {
//       console.error("Error deleting reaction:", error);
//     }
//   };

//   return (
//     <div
//       ref={componentRef}
//       className="fixed w-[314px] text-white h-[190px] p-2.5 backdrop-blur-[30px] bg-[#303030] rounded-[15px] flex-col justify-start items-start gap-[10px] inline-flex"
//       style={{
//         transform: `translate(${adjustment.x}px, ${adjustment.y}px)`,
//         transition: "transform 0.3s",
//       }}
//     >
//       <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
//         <div className="grow shrink basis-0 h-7 justify-start items-center gap-2.5 flex overflow-hidden">
//           <div className="flex-shrink-0 w-7 h-7 p-0.5 bg-white rounded-[31px] border border-black justify-center items-center flex">
//             <img
//               className="w-full h-full object-cover rounded-[28.50px] border-white"
//               src={Avatar_pizzaboy}
//               alt="Avatar"
//             />
//           </div>
//           <div className="flex-grow min-w-0 justify-center items-center gap-2.5">
//             <div className="text-white text-sm font-bold font-['Nunito'] truncate">
//               {reactionData.data.user.userName}
//             </div>
//           </div>
//         </div>
//         <div className="cursor-pointer" onClick={onClose}>
//           <img src={XIcon} alt="Close" />
//         </div>
//       </div>
//       <div className="w-[293px] h-[75px] relative gap-2">
//         <div className="w-[218px] h-[75px] p-2 pt-0 left-0 top-0 absolute text-[13px] font-semibold font-['Nunito'] break-words overflow-y-auto">
//           {reactionData.data.data.contentText}
//         </div>
//         {/* <div className="w-[75px] h-[75px] left-[218px] top-0 absolute bg-white rounded-md border border-[#e1e1e1] justify-center items-center inline-flex">
//           <img
//             className="w-[75px] h-[75px] rounded-[10px]"
//             src={reactionData.data.data.backgroundCapture}
//             alt="Reaction Background"
//           />
//         </div> */}
//         <div className="w-[75px] h-[75px] left-[218px] top-0 absolute bg-white rounded-md border border-[#e1e1e1] justify-center items-center inline-flex">
//           <img
//             className="w-[75px] h-[75px] rounded-[10px]"
//             src={reactionData.data.data.contentUrl}
//             alt="Reaction Background"
//           />
//         </div>
//       </div>
//       <div className="self-stretch flex justify-between items-center px-2 pt-2">
//         <div className="text-[#389fff] text-[13px] font-normal font-['Nunito']">
//           Reply
//         </div>
//         <div className="flex items-center gap-4">
//           <div
//             className="w-6 h-6 relative cursor-pointer"
//             onClick={handleDeleteClick}
//           >
//             <img src={deletee} alt="Delete Icon" />
//           </div>
//           <div className="flex items-center gap-2">
//             <div
//               className={`w-6 h-6 relative ${
//                 isLiked ? "cursor-pointer" : "cursor-not-allowed"
//               }`}
//               onClick={handleLikeClick}
//             >
//               <img src={isLiked ? redHeart : heart} alt="Like Icon" />
//             </div>
//             <div className="text-center text-white text-sm font-semibold">
//               {likeCount}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewReaction;
