import { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaAngleDown, FaAnglesUp, FaAngleUp } from "react-icons/fa6";
import { IoLayersOutline } from "react-icons/io5";
import { baseURL } from "../Constants/urls";
import Masonry from "react-masonry-css";
import { Swiper, SwiperSlide } from "swiper/react";
import viewBox from "../assets/viewBox.png";
import viewColumns from "../assets/viewColumns.svg";

import "swiper/css";
import "swiper/css/free-mode";
function ProfileMenu({ setTappableAreas }) {
  const [showCollections, setShowCollections] = useState(false);

  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const [allBoardData, setAllBoards] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [collectionData, setCollectionsData] = useState([]);
  const [collectionBoardData, setCollectionsBoardData] = useState([]);
  const [collectionPage, setCollectionPage] = useState(1);
  const [collectionPageSize, setCollectionsPageSize] = useState(10);
  const [visibleItems, setVisibleItems] = useState(10); // Initially show 3 items
  const itemsPerPage = 3; // Number of items to display per click
  //
  const itemsPerChunk = [3, 3, 4]; // Chunks: First 3, next 3, then 4
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0); // Tracks which chunk we're on

  const fetchCollections = async (url) => {
    const apiUrl = `${baseURL}` + `${url}`;
    const headers = new Headers({
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };
    await fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.status) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && typeof data.data !== "string") {
          setCollectionsData((prevData) => ({
            ...prevData,
            count: data?.data?.count,
            data: [...(prevData?.data || []), ...data?.data?.data], // Assuming newData is the array you want to push
          }));
        }
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getImageClass = (colorCount, index) => {
    if (colorCount === 1) return "w-full h-full";
    if (colorCount === 2) return "w-1/2 h-full";
    if (colorCount === 3) {
      if (index === 0) return "w-1/2 h-1/2";
      return "w-1/2 h-1/2";
    }
    return "w-1/2 h-1/2";
  };

  // Function to handle "Show More" logic
  const showMore = async () => {
    // If more than 10 items and all data is already shown, make an API call
    if (
      collectionData?.count > 10 &&
      visibleItems === 10 &&
      collectionData?.data?.length !== collectionData?.count
    ) {
      // Mock API call to fetch new data (replace with your actual API call)
      setCollectionPage(collectionPage + 1);
      setVisibleItems(visibleItems + 10);
    }

    // If we're within the predefined chunk sizes
    // if (currentChunkIndex < itemsPerChunk?.length - 1) {
    //   // Add the current chunk size to the visible items count
    //   setVisibleItems(
    //     (prevVisible) => prevVisible + itemsPerChunk[currentChunkIndex + 1]
    //   );
    //   setCurrentChunkIndex((prevIndex) => prevIndex + 1);
    // }
  };

  const toggleExpand = (type, id) => {
    if (type === "title") {
      setExpandedTitles((prev) => ({ ...prev, [id]: !prev[id] }));
    } else {
      setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const fetchPublicBoards = async () => {
    try {
      // setLoading(true);
      const tappablePageSize = 3;
      const response = await fetch(
        `${baseURL}/board/fetchRecentPublicUserBoard?page=${1}&pageSize=${100}&tappablePageSize=${tappablePageSize}&userName=${userName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      const totalCount = data?.data?.count || 10;
      const newBoards = data?.data?.data || [];

      data?.data?.data.forEach((board, i) => {
        const publicBoardId = board.id;

        if (board.BoardImages && board.BoardImages.length > 0) {
          const publicBoardImageId = board.BoardImages[0].id;
        }

        // setCurrentPublicBoardId(publicBoardId);
        // setCurrentPublicBoardImageId(publicBoardImageId);
      });

      console.log("public data", data.data);

      setAllBoards((prevBoards) => {
        const updatedBoards = [...newBoards, ...prevBoards];
        return Array.from(new Set(updatedBoards.map(JSON.stringify))).map(
          JSON.parse
        );
      });

      // setBoardsPageSize(totalCount);

      // if (totalCount > 40) {
      //   setUseInfiniteScroll(true);
      // }

      // setPublicPage((prevPage) => prevPage + 1);

      // Call fetchPublicUserBoardTappable if tappablePageSize is more than 3
      // if (tappablePageSize > 3) {
      //   await fetchPublicUserBoardTappable(newBoards);
      // }

      // setPreviousTappablePageSize(tappablePageSize);
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return text?.slice(0, maxLength) + "...";
  };

  useEffect(() => {
    fetchCollections(
      `/board/fetchPublicUserCollectionsOnHomeFeed?page=${collectionPage}&pageSize=${collectionPageSize}&userName=${userName}`
    );
  }, []);

  useEffect(() => {
    fetchPublicBoards();
  }, []);

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
    <div className=" min-h-screen text-white p-2 rounded-lg">
      <div className="flex w-full space-x-2 mb-4">
        <button className=" w-[32%] text-sm rounded-md bg-[#2e2e2e] ">
          Followers
        </button>
        <button className=" w-[32%] text-sm rounded-md bg-[#2e2e2e] ">
          Following
        </button>
        <button className=" w-[32%] text-sm rounded-md bg-[#2e2e2e] ">
          My Earnings
        </button>
        <div className=" w-[4%] text-sm rounded-sm bg-[#2e2e2e] flex items-center cursor-pointer">
          <CiMenuKebab color="white" />
        </div>
      </div>

      <ul className="space-y-2">
        <li className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Info
        </li>
        <li className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Contact
        </li>
        <li
          className="flex items-center cursor-pointer"
          onClick={() => setShowCollections(!showCollections)}
        >
          <IoLayersOutline className="mr-2" />
          Collections{" "}
          <span className="pl-3">
            {showCollections ? <FaAngleUp /> : <FaAngleDown />}
          </span>
        </li>
        <div
          className={` custom-scrollbar transition-max-height mt-0 duration-500 ease-in-out overflow-y-scroll ${
            showCollections ? "max-h-40" : "max-h-0"
          }`}
          style={{
            marginTop: showCollections ? "10px" : "0px",
          }}
        >
          <div className="space-y-3 px-5 ">
            {collectionData?.data?.map((collection, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 "
                // onClick={() => getCollectionBoardData(collection?.id)}
              >
                <div className="w-12 h-12 flex flex-wrap rounded overflow-hidden cursor-pointer">
                  {collection?.Board?.slice(0, 4).map(
                    (boardImage, boardIndex) => (
                      <div
                        key={boardIndex}
                        className={` ${getImageClass(
                          collection?.Board.length,
                          boardIndex
                        )} `}
                      >
                        <img
                          src={boardImage?.BoardImages[0]?.imageUrl}
                          alt="collection-images"
                          className="w-full h-full resize"
                        />
                      </div>
                    )
                  )}
                </div>
                <span className="text-white text-sm font-medium cursor-pointer">
                  {collection?.collectionName}
                </span>
              </div>
            ))}
            {visibleItems <= collectionData?.count && (
              <div className=" mt-1">
                <span className="cursor-pointer" onClick={() => showMore()}>
                  Show more
                </span>
              </div>
            )}
          </div>
        </div>
      </ul>

      {/*  */}
      <div className="flex m-2 justify-between items-center mb-5 ">
        <p className=" text-[#BFBFBF]  mt-2">
          All Boards / {allBoardData?.length}
        </p>
        <div className="flex space-x-2 ml-auto gap-3 ">
          <img
            className={`cursor-pointer
                  `}
            src={layout === "grid" ? viewBox : viewBox}
            style={{ width: "24px" }}
            alt="viewBox"
            onClick={() => setLayout("grid")}
          />{" "}
          <img
            className={`cursor-pointer pr-3`}
            style={{ width: "36px" }}
            src={layout === "column" ? viewColumns : viewColumns}
            alt="viewColumns"
            onClick={() => setLayout("column")}
          />
        </div>
      </div>

      {/*  */}
      <div className="mb-[60px] rounded-3xl">
        <div className="text-white">
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 gap-2  px-2"
                : "flex flex-col gap-2 px-2"
            }
          >
            <Masonry
              breakpointCols={{
                default: layout === "column" ? 1 : 2,
                700: layout === "column" ? 1 : 2,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {!allBoardData?.length ? (
                <div className="text-white">No boards available.</div>
              ) : (
                Array.isArray(allBoardData) &&
                collectionBoardData?.length < 1 &&
                allBoardData.map((board, boardIndex) => (
                  <div key={boardIndex} className="mb-2">
                    <div
                      className="text-[#747171] bg-[#0c0c0c]  flex flex-col gap-2 relative w-full overflow-hidden"
                      style={{
                        borderRadius: "1.5rem",
                      }}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        {Array.isArray(board.BoardImages) &&
                          board.BoardImages?.length > 0 && (
                            <img
                              className="w-full h-full object-cover cursor-pointer"
                              src={board.BoardImages[0].imageUrl}
                              alt={`image-0`}
                              onClick={() => {
                                console.log(
                                  "Image clicked, board data:",
                                  board.BoardImages[0].id,
                                  board.id,
                                  board.isPublic
                                );
                                displayFullImage(
                                  board.BoardImages[0].imageUrl,
                                  board.BoardImages[0].id,
                                  board.id,
                                  board.isPublic
                                );
                              }}
                            />
                          )}
                      </div>

                      <div className="px-3 z-0">
                        <Swiper
                          spaceBetween={10}
                          slidesPerView="auto"
                          className="overflow-visible"
                        >
                          {board.BoardImages &&
                            board.BoardImages[0] &&
                            board.BoardImages[0].tappable &&
                            board.BoardImages[0].tappable.map(
                              (tappable, index) => (
                                <SwiperSlide
                                  key={tappable.id}
                                  className="!w-auto"
                                >
                                  <div
                                    className={`aspect-w-1 aspect-h-1 ${
                                      layout === "grid"
                                        ? "w-[29px] h-[29px]"
                                        : "w-[50px] h-[50px]"
                                    }`}
                                  >
                                    <img
                                      className="w-full h-full object-cover cursor-pointer rounded-md"
                                      src={tappable.tappableImage}
                                      alt={`Tappable-${index}`}
                                    />
                                  </div>
                                </SwiperSlide>
                              )
                            )}
                        </Swiper>
                      </div>

                      <div className="flex flex-col px-3 pb-3  mb-10">
                        {board.BoardImages &&
                          board.BoardImages[0] &&
                          board.BoardImages[0].title && (
                            <h3 className="text-[#BFBFBF] text-wrap text-[1.125rem] font-bold leading-[130%]">
                              {expandedTitles[boardIndex]
                                ? board.BoardImages[0].title
                                : truncateText(board.BoardImages[0].title, 50)}
                              {board.BoardImages[0].title.length > 50 && (
                                <span
                                  className="text-[#0084FF] cursor-pointer ml-1"
                                  onClick={() =>
                                    toggleExpand("title", boardIndex)
                                  }
                                >
                                  {expandedTitles[boardIndex]
                                    ? "Show Less"
                                    : "...Read More"}
                                </span>
                              )}
                            </h3>
                          )}

                        {board.BoardImages &&
                          board.BoardImages[0] &&
                          board.BoardImages[0].description && (
                            <h3 className="text-xs text-[#959595] text-wrap mb-5 text-[10px] font-semibold">
                              {expandedDescriptions[boardIndex]
                                ? board.BoardImages[0].description
                                : truncateText(
                                    board.BoardImages[0].description,
                                    50
                                  )}
                              {board.BoardImages[0].description.length > 50 && (
                                <span
                                  className="text-[#0084FF] cursor-pointer ml-1"
                                  onClick={() =>
                                    toggleExpand("description", boardIndex)
                                  }
                                >
                                  {expandedDescriptions[boardIndex]
                                    ? "Show Less"
                                    : "...Read More"}
                                </span>
                              )}
                            </h3>
                          )}

                        <h2 className="absolute bottom-2 text-[#959595] text-xs italic  mb-2">
                          {board.BoardImages && board.BoardImages[0]
                            ? new Date(
                                board.BoardImages[0].createdAt
                              ).toDateString()
                            : ""}
                        </h2>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {collectionBoardData &&
                collectionBoardData?.boards?.map((board, boardIndex) => (
                  <div key={boardIndex} className="mb-2">
                    <div
                      className="text-[#747171] bg-[#0c0c0c]  flex flex-col gap-2 relative w-full overflow-hidden"
                      style={{
                        borderRadius: "1.5rem",
                      }}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        <img
                          className="w-full h-full object-cover cursor-pointer"
                          src={board?.images[0]?.imageUrl}
                          alt={`image-0`}
                          onClick={() => {
                            console.log(
                              "Image clicked, board data:",
                              board?.images[0]?.id,
                              board?.id,
                              board?.isPublic
                            );
                            displayFullImage(
                              board?.images[0]?.imageUrl,
                              board?.images[0]?.id,
                              board?.id,
                              board?.isPublic
                            );
                          }}
                        />
                      </div>

                      <div className="px-3 z-0">
                        <Swiper
                          spaceBetween={10}
                          slidesPerView="auto"
                          className="overflow-visible"
                        >
                          {board?.images &&
                            board?.images[0] &&
                            board?.images[0]?.tappables &&
                            board?.images[0]?.tappables?.map(
                              (tappable, index) => (
                                <SwiperSlide
                                  key={tappable.id}
                                  className="!w-auto"
                                >
                                  <div
                                    className={`aspect-w-1 aspect-h-1 ${
                                      layout === "grid"
                                        ? "w-[29px] h-[29px]"
                                        : "w-[50px] h-[50px]"
                                    }`}
                                  >
                                    <img
                                      className="w-full h-full object-cover cursor-pointer rounded-md"
                                      src={tappable?.contentImageLink}
                                      alt={`Tappable-${index}`}
                                    />
                                  </div>
                                </SwiperSlide>
                              )
                            )}
                        </Swiper>
                      </div>

                      <div className="flex flex-col px-3 pb-3  mb-10">
                        {board?.images &&
                          board?.images[0] &&
                          board?.images[0].title && (
                            <h3 className="text-[#BFBFBF] text-wrap text-[1.125rem] font-bold leading-[130%]">
                              {expandedTitles[boardIndex]
                                ? board?.images[0].title
                                : truncateText(board?.images[0].title, 50)}
                              {board?.images[0]?.title.length > 50 && (
                                <span
                                  className="text-[#0084FF] cursor-pointer ml-1"
                                  onClick={() =>
                                    toggleExpand("title", boardIndex)
                                  }
                                >
                                  {expandedTitles[boardIndex]
                                    ? "Show Less"
                                    : "...Read More"}
                                </span>
                              )}
                            </h3>
                          )}

                        {board?.images &&
                          board?.images[0] &&
                          board?.images[0].description && (
                            <h3 className="text-xs text-[#959595] text-wrap mb-5 text-[10px] font-semibold">
                              {expandedDescriptions[boardIndex]
                                ? board?.images[0].description
                                : truncateText(
                                    board?.images[0].description,
                                    50
                                  )}
                              {board?.images[0]?.description?.length > 50 && (
                                <span
                                  className="text-[#0084FF] cursor-pointer ml-1"
                                  onClick={() =>
                                    toggleExpand("description", boardIndex)
                                  }
                                >
                                  {expandedDescriptions[boardIndex]
                                    ? "Show Less"
                                    : "...Read More"}
                                </span>
                              )}
                            </h3>
                          )}

                        <h2 className="absolute bottom-2 text-[#959595] text-xs italic  mb-2">
                          {board?.images && board?.images[0]
                            ? new Date(
                                board?.images[0]?.createdAt
                              ).toDateString()
                            : ""}
                        </h2>
                      </div>
                    </div>
                  </div>
                ))}
            </Masonry>
          </div>
        </div>
      </div>

      {/*  */}
    </div>
  );
}

export default ProfileMenu;
