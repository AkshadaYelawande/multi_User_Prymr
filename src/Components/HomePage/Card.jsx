// //new figma card
// import React, { useEffect, useRef, useState } from "react";
// import threedot from "../../assets/threedots.svg";
// import smallavatar from "../../assets/smallAvatar.svg";
// import bookmark from "../../assets/bookmark.svg";
// import comment from "../../assets/comment.svg";
// import book from "../../assets/book.svg";
// import share from "../../assets/Share.svg";
// import viewColumns from "../../assets/viewColumns.png";
// import viewBox from "../../assets/viewBox.png";
// import artImage from "../../assets/Art.svg";
// import yellowbookmark from "../../assets/yellowbookmark.svg";
// import arrowspointingout from "../../assets/arrowspointingout.svg";
// import X from "../../assets/x-mark.svg";
// import folder from "../../assets/folderimg.svg";
// import blockicon from "../../assets/block.svg";
// import CheckCircle from "../../assets/CheckCircle.svg";
// import WarningCircle from "../../assets/WarningCircle.svg";
// import support from "../../assets/support.svg";
// import deleteBai from "../../assets/deleteBai.svg";
// import "./home.css";
// import line from "../../assets/Line.svg";
// import { useNavigate } from "react-router";
// import { baseURL } from "../../Constants/urls";
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/free-mode";

// const Card = ({ board }) => {
//   const [isFollowing, setIsFollowing] = useState();
//   const [isOpenOption, setIsOpenOption] = useState(false);
//   const [isBookmarkOption, setIsBookmarkOption] = useState(false);
//   const [link, setLink] = useState("");
//   const [isImageOption, setIsImageOption] = useState(false);
//   const [followingCreator, setFollowingCreator] = useState(true);
//   const [followBoard, setFollowBoard] = useState(false);
//   const [layout, setLayout] = useState("grid"); // State to manage layout
//   const componentRef = useRef(null);
//   const navigate = useNavigate();

//   if (!board) return null;

//   const token = localStorage.getItem("token");

//   const handleFollow = async () => {
//     try {
//       console.log("save");
//       const response = await fetch(`${baseURL}/user/followUser`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           followedUserId: board.user._id,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setIsFollowing(!isFollowing);
//       }
//     } catch (error) {
//       console.log("Error following user", error);
//     }
//   };

//   const handleScroll = () => {
//     if (componentRef.current) {
//       const topPosition = componentRef.current.getBoundingClientRect().top;
//       if (topPosition <= 40) {
//         setIsOpenOption(false);
//         setIsBookmarkOption(false);
//         setIsImageOption(false);
//       }
//     }
//   };

//   return (
//     <div className="mb-4 rounded-3xl pt-[2vh]">
//       <div className="relative container text-white">
//         <div className="flex m-2 justify-between items-center">
//           <p className="font-italic">Most recent uploads</p>
//           <div className="flex space-x-2 ml-auto">
//             <img src={viewColumns} onClick={() => setLayout("column")} />
//             <img src={viewBox} onClick={() => setLayout("grid")} />
//           </div>
//         </div>

//         <div
//           className={`cards-container ${
//             layout === "grid" ? "grid grid-cols-2 " : "flex flex-col"
//           }`}
//         >
//           {board &&
//             board.BoardImages &&
//             board.BoardImages.map((image, index) => (
//               <div
//                 key={index}
//                 className="text-[#747171] bg-[#414040]   mt-2 m-2  flex flex-col gap-2 relative"
//                 style={{ borderRadius: "1.5rem" }}
//               >
//                 <img
//                   className="h-[40vh] rounded-3xl  object-cover w-full"
//                   src={image.imageUrl}
//                   alt="homepageimage"
//                 />
//                 <div className=" left-2 flex m-2 h-20 space-x-2">
//                   <Swiper
//                     spaceBetween={10}
//                     slidesPerView="auto"
//                     centeredSlides={true}
//                   >
//                     {imagesforsmallpost.map((image, index) => (
//                       <SwiperSlide key={index}>
//                         <img className="ml-1" key={index} src={image.src} />
//                         <img src={deleteBai} className="ml-1 w-2 w-h" />
//                         <img src={deleteBai} className="ml-1" />
//                       </SwiperSlide>
//                     ))}
//                   </Swiper>
//                 </div>
//                 <h3 className="text-xl ml-3 text-[#BFBFBF]">{image.title}</h3>
//                 <p className="ml-3 text-[#959595]">Interaction Poster</p>
//                 <div className="px-3 flex italic mb-7">
//                   <div className="text-[#999999]">974 Post Interactions</div>
//                   <h2 className="ml-auto">2 days</h2>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;

// old figma card
// import React, { useEffect, useRef, useState } from "react";
// import threedot from "../../assets/threedots.svg";
// import smallavatar from "../../assets/smallAvatar.svg";

// import bookmark from "../../assets/bookmark.svg";
// import comment from "../../assets/comment.svg";
// import book from "../../assets/book.svg";
// import Slider from "react-slick";
// import share from "../../assets/Share.svg";

// import artImage from "../../assets/Art.svg";
// import { GoGift } from "react-icons/go";
// import yellowbookmark from "../../assets/yellowbookmark.svg";
// import arrowspointingout from "../../assets/arrowspointingout.svg";
// import X from "../../assets/x-mark.svg";
// import folder from "../../assets/folderimg.svg";
// import blockicon from "../../assets/block.svg";
// import CheckCircle from "../../assets/CheckCircle.svg";
// import WarningCircle from "../../assets/WarningCircle.svg";

// import support from "../../assets/support.svg";
// import "./home.css";
// import line from "../../assets/Line.svg";
// import { useNavigate } from "react-router";

// const Card = ({ board }) => {
//   const [isFollowing, setIsFollowing] = useState();

//   const [isOpenOption, setIsOpenOption] = useState(false);

//   const [isBookmarkOption, setIsBookmarkOption] = useState(false);
//   const [link, setLink] = useState("");
//   const [isImageOption, setIsImageOption] = useState(false);
//   const [followingCreator, setFollowingCreator] = useState(true);
//   const [followBoard, setFollowBoard] = useState(false);
//   const [pageHeight, setPageHeight] = useState(window.innerHeight);
//   const componentRef = useRef(null);
//   const navigate = useNavigate();
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     ResizeObserverSize: 10,
//   };

//   const bookmarkOptions = [
//     {
//       image: folder,
//       name: "Quick Bookmark",
//     },
//     {
//       image: folder,
//       name: "Add Folder",
//     },
//     {
//       image: folder,
//       name: "Create New Folder",
//     },
//   ];

//   if (!board) return null;

//   const token = localStorage.getItem("token");

//   const handleFollow = async () => {
//     try {
//       console.log("save");
//       const response = await fetch(
//         `https://prymr-dev-backend.vercel.app/api/user/followUser`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             followedUserId: board.user._id,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setIsFollowing(!isFollowing);
//       }
//     } catch (error) {
//       console.log("Error following user", error);
//     }
//   };

//   const handleScroll = () => {
//     if (componentRef.current) {
//       const topPosition = componentRef.current.getBoundingClientRect().top;
//       if (topPosition <= 40) {
//         setIsOpenOption(false);
//         setIsBookmarkOption(false);
//         setIsImageOption(false);
//       }
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleFollowingCreator = () => {
//     setFollowingCreator(!followingCreator);
//   };

//   const handleFollowBoard = () => {
//     setFollowBoard(!followBoard);
//   };

//   const handleShare = () => {
//     navigate("/home-share");
//     // Replace with your actual logic to generate the share link
//     const generatedLink = "https://www.example.com/post/123";
//     setLink(generatedLink);
//   };

//   return (
//     <div className="mb-4 rounded-3xl  pt-[2vh] ">
//       <div className="relative container text-white  ">
//         <div className="bg-[#191919]  flex justify-between px-3">
//           <div className="flex py-2   items-center gap-2">
//             <img src={smallavatar} className="ml-3 mr-2" />
//             <h3
//               className="text-[#FFFFff] text-l
// "
//             >
//               {board.user.userName}
//             </h3>

//             <button
//               className={
//                 isFollowing ? "text-blue-500 text-xl" : "text-[#BABABA] text-xl"
//               }
//               onClick={() => handleFollow()}
//             >
//               {isFollowing ? "Following" : "Follow"}
//             </button>
//           </div>
//           <div onClick={() => setIsOpenOption(!isOpenOption)}>
//             <img
//               src={threedot}
//               alt="threedot"
//               className="items-center px-4 py-3"
//             />
//           </div>
//         </div>

//         {isOpenOption && (
//           <div
//             className="bg-[#393939]  font-bold w-auto rounded-[20px]  m-1 absolute left-[30vw] top-[25vh] z-10   "
//             ref={componentRef}
//           >
//             <div className="flex items-center ml-6 py-5 ">
//               <input
//                 type="checkbox"
//                 checked={followingCreator}
//                 onChange={handleFollowingCreator}
//                 className="w-4 h-4 text-blue-500 focus:ring-blue-500 rounded-full border-2 border-white"
//               />
//               <label
//                 className={`ml-2 text-white ${
//                   followingCreator ? "text-blue-500" : ""
//                 }`}
//                 htmlFor="followingCreator"
//               >
//                 Following Creator
//               </label>
//             </div>
//             <div className="flex items-center  ml-6 ">
//               <input
//                 type="radio"
//                 name="follow"
//                 checked={followBoard}
//                 onChange={handleFollowBoard}
//                 className="w-4 h-4 text-blue-500 focus:ring-blue-500 rounded-full border-2 border-white"
//               />
//               <label
//                 className={`ml-2 text-white ${
//                   followBoard ? "text-blue-500" : ""
//                 }`}
//                 htmlFor="followBoard"
//               >
//                 Follow Board
//               </label>
//             </div>
//             <img src={line} className="px-6 p-2" />

//             <span className="flex p-1 px-4 w-122 h-22 text-[#FF0000] gap-3 mb-2">
//               <img src={WarningCircle} alt="Report" />
//               Report
//             </span>
//             <span className="flex p-1 px-5  text-[#FF0000] gap-3 mb-2">
//               <img src={blockicon} alt="Block" />
//               Block
//             </span>
//           </div>
//         )}

{
  /* <Slider {...settings}> */
}
{
  /* <div className="bg-[#383737] rounded-lg mb-3">
          {board &&
            board.BoardImages &&
            board.BoardImages.map((image, index) => (
              <div className="text-[#747171] bg-[#191919] flex flex-col gap-2 relative">
                <img
                  className="h-[70vh] object-cover w-full"
                  src={image.imageUrl}
                  alt="homepageimage"
                /> */
}

{
  /* {isBookmarkOption && (
                  <div
                    className="bg-[#363636] w-auto absolute bottom-[230px] left-2"
                    ref={componentRef}
                  >
                    <header className="flex pl-2 items-center justify-between bg-[#00000047] ">
                      <img
                        src={yellowbookmark}
                        className=" text-yellow-400 icon"
                      />
                      <h2 className=" text-yellow-300 px-2 p-3 font-medium text-base leading-15.54 tracking-5% text-right ">
                        Bookmark
                      </h2>
                      <button className="text-white"></button>
                      <img
                        src={arrowspointingout}
                        alt="arrowspointingout"
                        className="w-5 h-5 mr-2"
                      />
                      <img onClick={() => setIsBookmarkOption(false)} src={X} />
                    </header>
                    <div className="flex gap-5 my-2 px-2">
                      {bookmarkOptions.map((option) => (
                        <div className="flex flex-col">
                          <img
                            className="w-20 "
                            src={option.image}
                            alt="folder"
                          />
                          <p className="text-[10px]  text-wrap text-center relative -top-5 text-gray-600 font-semibold">
                            {option.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */
}
{
  /* 
                {isImageOption && (
                  <div
                    className="bg-[#191919] flex absolute bottom-[230px] right-2 w-auto"
                    ref={componentRef}
                  >
                    <div className="flex gap-1 items-center">
                      {" "}
                      <img src={artImage} className="rounded-[10px] h-full" />
                      <div>
                        <div className="flex  ">
                          <img
                            src={smallavatar}
                            className="px-4 border-white"
                          />
                          <p> FakeFroot 2h</p>{" "}
                        </div>{" "}
                        {/* <div className="pt-3 pl-3">
                          <p>Page 1</p>
                          <p>The HIstory og it All</p>
                          <p>Interactive post with 12 Tappable</p>{" "}
                        </div>{" "} */
}
{
  /* </div>
                    </div>
                  </div>
                )} * */
}

{
  /* <div className="flex justify-between mr-10 ">
                  <div className="flex px-5 gap-7 items-center">
                    <div
                      className="border-white"
                      onClick={() => setIsBookmarkOption(!isBookmarkOption)}
                    >
                      <img src={bookmark} alt="book" />
                    </div>

                    <img src={share} alt="share" onClick={handleShare} />

                    <div className="flex gap-1 text-white text-lg item-center">
                      <img src={comment} alt="comment" className="w-8 h-8 " />8
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-white float-right px-4 items-center m-3 mb-3 gap-2  ">
                      support
                      <img src={support} />
                    </div> */
}
{
  /* <div className=" items-center py-4 gap-1 text-m">
                    <img
                      onClick={() => {
                        setIsImageOption(!isImageOption);
                      }}
                      src={book}
                      className="w-7 h-7"
                      alt="book"
                    />
                    <span>
                      {index + 1}/{board.BoardImages.length}
                    </span>
                  </div> */
}
{
  /* </div>
                </div>
                <h3 className="text-xl ml-3 text-[#BFBFBF] ">{image.title}</h3>
                <p className=" ml-3 text-[#959595]">Interaction Poster</p>
                <div className="px-3 flex italic mb-7">
                  <div className="text-[#999999]">974 Post Interactions</div>
                  <h2 className="ml-auto "> 2 days </h2>
                </div> */
}
{
  /* <p className=" ml-3 text-white mb-3">{image.description}</p> */
}
{
  /* <div className="flex text-white float-right px-4 items-center m-3 mb-3 gap-2">
                support
                <img src={support} />
                {/* <GoGift className="w-84 h-84" /> */
}
{
  /* </div> */
}
// </div>
// ))}
//           {/* </Slider> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;
