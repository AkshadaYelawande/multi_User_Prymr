import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { useNavigate, useParams } from "react-router";
import { baseURL, privateUser, publicUser, user } from "../../Constants/urls";
import Galary from "../../assets/Galary.png";
import viewColumns from "../../assets/viewColumns.svg";
import viewBox from "../../assets/viewBox.png";
import viewColumnsYellow from "../../assets/viewColumnsYellow.svg";
import yellowViewBox from "../../assets/yellowViewBox.svg";
import leftarrow from "../../assets/leftarrow.svg";
import headerinfo from "../../assets/headerInfo.png";
import Envelope from "../../assets/Envelope.svg";
import headershop from "../../assets/headershop.png";
import Header from "../common/Header";
import Navbar from "../common/Navbar";
import deleteBai from "../../assets/deleteBai.svg";
import DesktopNavbar from "../common/DesktopNavbar";
import Masonry from "react-masonry-css";
import { useToastManager } from "../Context/ToastContext";
import "./home.css";
import { PropagateLoader } from "react-spinners";
import ManageCreatorRequest from "./ManageCreatorRequest";

const FullImageWithTappables = lazy(() => import("./FullImageWithTappables"));
const Contact = lazy(() => import("./Contact"));
const CreatorInfo = lazy(() => import("./CreatorInfo"));
const Art = lazy(() => import("./Art"));
const Shop = lazy(() => import("./Shop"));

const Home = () => {
  const params = useParams();
  const [singleTappableId, setSingleTappableId] = useState(null);
  const [allBoards, setAllBoards] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState();
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [isArtOpen, setIsArtOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isFullImage, setIsFullImage] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState("");
  const [fullImageId, setFullImageId] = useState("");
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [tappableAreas, setTappableAreas] = useState([]);
  const [publicPage, setPublicPage] = useState(1);
  const [privatePage, setPrivatePage] = useState(1);
  const [boardsPageSize, setBoardsPageSize] = useState(100);
  const [previousTappablePageSize, setPreviousTappablePageSize] = useState(3);
  const initialPublicFetchMade = useRef(false);
  const initialPrivateFetchMade = useRef(false);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentBoardId, setCurrentBoardId] = useState("");
  const [currentPublicBoardId, setCurrentPublicBoardId] = useState(null);
  const [currentPublicBoardImageId, setCurrentPublicBoardImageId] =
    useState(null);
  const [apiTappableAreas, setApiTappableAreas] = useState([]);
  const [currentPrivateBoardId, setCurrentPrivateBoardId] = useState(null);
  const [currentPrivateBoardImageId, setCurrentPrivateBoardImageId] =
    useState(null);
  const [privateBoardImageId, setPrivateBoardImageId] = useState(null);
  const [publicBoardImageId, setPublicBoardImageId] = useState(null);
  const userRole = localStorage.getItem("userRole");
  const [boardImageId, setBoardImageId] = useState();
  const [reactionId, setReactionId] = useState([]);
  const [singleReactionId, setSingleReactionId] = useState([]);

  const toast = useToastManager();
  const [adjustedReactions, setAdjustedReactions] = useState([]);

  const [collectionData, setCollectionsData] = useState([]);
  const [collectionBoardData, setCollectionsBoardData] = useState([]);
  const [collectionPage, setCollectionPage] = useState(1);
  const [collectionPageSize, setCollectionsPageSize] = useState(10);
  const [visibleItems, setVisibleItems] = useState(3); // Initially show 3 items
  const itemsPerPage = 3; // Number of items to display per click
  //
  const itemsPerChunk = [3, 3, 4]; // Chunks: First 3, next 3, then 4
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0); // Tracks which chunk we're on
  const [manageCreator, setManageCreator] = useState(false); // Tracks which chunk we're on

  const isAdmin = localStorage.getItem("isAdmin");

  console.log("isAdmin :", isAdmin);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayout("column");
      } else {
        setLayout("grid");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPublicBoards = useCallback(async () => {
    try {
      setLoading(true);
      const tappablePageSize = 100;
      const response = await fetch(
        `${baseURL}/board/fetchRecentPublicUserBoard?page=${publicPage}&pageSize=${boardsPageSize}&tappablePageSize=${tappablePageSize}&userName=${params?.name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      const totalCount = data?.data?.count || 0;
      const newBoards = data?.data?.data || [];

      data?.data?.data.forEach((board, i) => {
        const publicBoardId = board.id;

        if (board.BoardImages && board.BoardImages.length > 0) {
          const publicBoardImageId = board.BoardImages[0].id;
        }

        setCurrentPublicBoardId(publicBoardId);
        setCurrentPublicBoardImageId(publicBoardImageId);
      });

      setAllBoards((prevBoards) => {
        const updatedBoards = [...newBoards, ...prevBoards];
        return Array.from(new Set(updatedBoards.map(JSON.stringify))).map(
          JSON.parse
        );
      });

      setBoardsPageSize(totalCount);

      if (totalCount > 40) {
        setUseInfiniteScroll(true);
      }

      setPublicPage((prevPage) => prevPage + 1);

      // Call fetchPublicUserBoardTappable if tappablePageSize is more than 3
      if (tappablePageSize > 3) {
        await fetchPublicUserBoardTappable(newBoards);
      }

      setPreviousTappablePageSize(tappablePageSize);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [publicPage, previousTappablePageSize]);

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const tappablePageSize = 100;
      const response = await fetch(
        `${baseURL}/board/fetchRecentPrivateUserBoard?page=${privatePage}&pageSize=${boardsPageSize}&tappablePageSize=${tappablePageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      const totalCount = data?.data?.count || 0;
      const newBoards = data?.data?.data || [];

      data?.data?.data.forEach((board, i) => {
        const privateBoardId = board.id;
        // console.log(" privateBoardId : 175 : ", privateBoardId);
        // console.log("Data : 175 : ", boardImageId);
        // console.log("Data : 176 : ", data?.data?.board?.BoardImages[0].id);

        setBoardImageId(boardImageId);
        if (board.BoardImages && board.BoardImages.length > 0) {
          const privateBoardImageId = board.BoardImages[0].id;
        }

        setCurrentPrivateBoardId(privateBoardId);
        setCurrentPrivateBoardImageId(privateBoardImageId);
      });

      setAllBoards((prevBoards) => {
        const updatedBoards = [...newBoards, ...prevBoards];
        return Array.from(new Set(updatedBoards.map(JSON.stringify))).map(
          JSON.parse
        );
      });

      setBoardsPageSize(totalCount);

      if (totalCount > 40) {
        setUseInfiniteScroll(true);
      }

      setPrivatePage((prevPage) => prevPage + 1);
      if (tappablePageSize > 3) {
        await fetchPrivateUserBoardTappable(newBoards);
      }

      setPreviousTappablePageSize(tappablePageSize);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [privatePage, previousTappablePageSize]);

  const fetchPublicUserBoardTappable = async (newBoards) => {
    try {
      const boardImageId = newBoards[0]?.BoardImages?.[0]?.id;
      setPublicBoardImageId(boardImageId);
      // console.log("HOme boardImageId " + boardImageId);

      if (boardImageId) {
        const response = await fetch(
          `${baseURL}/board/fetchPublicUserBoardTappable?page=1&pageSize=10&boardImageId=${boardImageId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        const tappableBoards = data?.data;

        setTappableAreas(tappableBoards);

        const boardImageId = data?.data?.board?.BoardImages[0].id;

        setBoardImageId(boardImageId);

        setAllBoards((prevBoards) => {
          const updatedBoards = [...prevBoards, ...tappableBoards];
          return Array.from(new Set(updatedBoards.map(JSON.stringify))).map(
            JSON.parse
          );
        });
      }
    } catch (error) {
      "Error fetching tappable boards 1", error;
    }
  };
  const fetchPrivateUserBoardTappable = async (newBoards) => {
    try {
      const boardImageId = newBoards[0]?.BoardImages?.[0]?.id;

      if (boardImageId) {
        const response = await fetch(
          `${baseURL}/board/fetchPrivateUserBoardTappable?page=1&pageSize=10&boardImageId=${boardImageId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        const tappableBoards = data?.data?.data || [];
        setTappableAreas(tappableBoards);

        const boardImageId = data?.data?.board?.BoardImages[0].id;
        // console.log("boardImageIdboardImageId : ", boardImageId);

        setBoardImageId(boardImageId);

        setAllBoards((prevBoards) => {
          const updatedBoards = [...prevBoards, ...tappableBoards];
          return Array.from(new Set(updatedBoards.map(JSON.stringify))).map(
            JSON.parse
          );
        });
      }
    } catch (error) {
      // toast("Error fetching tappable boards 2 ", error);
    }
  };
  useEffect(() => {
    if (
      isVisible &&
      apiTappableAreas &&
      apiTappableAreas.data &&
      apiTappableAreas.data.tappables
    ) {
      const adjustedCoordinates = apiTappableAreas.data.tappables.map(
        (area) => {
          return {
            id: area.tappableId,
            left: parseInt(area.left),
            top: parseInt(area.top),
            width: 50, // Set a default width if not provided
            height: 50, // Set a default height if not provided
            onTapAction: area.onTapAction,
            type: area.type,
          };
        }
      );

      setAdjustedTappableAreas(adjustedCoordinates);
    } else {
    }
  }, [apiTappableAreas, isVisible]);

  useEffect(() => {
    if (
      isVisible &&
      apiTappableAreas &&
      apiTappableAreas.data &&
      apiTappableAreas.data.reactions
    ) {
      const adjustedReactions = apiTappableAreas.data.reactions.map(
        (reaction) => {
          // console.log("Processing reaction:", reaction);
          return {
            id: reaction.reactionId,
            left: parseInt(reaction.left),
            top: parseInt(reaction.top),
            type: reaction.type,
            // Add any other properties you need
          };
        }
      );

      // console.log("Adjusted useeffect reactions:", adjustedReactions);
      setAdjustedReactions(adjustedReactions);
    } else {
      // console.log("Conditions not met for processing reactions");
    }
  }, [apiTappableAreas, isVisible]);

  const fetchCollections = async (url, token) => {
    const apiUrl = `${baseURL}` + `${url}`;
    // console.log("apiUrl", apiUrl);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
        return response.json();
      })
      .then((data) => {
        setCollectionsData((prevData) => ({
          ...prevData,
          count: data?.data?.count,
          data: [...(prevData?.data || []), ...data?.data?.data], // Assuming newData is the array you want to push
        }));
        // console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    if (params?.name) {
      console.log("called");
      setCollectionsData([]);
      fetchCollections(
        `/board/fetchPublicUserCollectionsOnHomeFeed?page=${collectionPage}&pageSize=${collectionPageSize}&userName=${params?.name}`
      );
    }
  }, [collectionPage, collectionPageSize, params?.name]);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // const userRole = localStorage.getItem("userRole");

    // const fetchData = async () => {
    //   if (
    //     userRole === "publicUser" ||
    //     (userRole === "user" && !initialPublicFetchMade.current)
    //   ) {
    //     initialPublicFetchMade.current = true;
    //     await fetchPublicBoards();
    //   } else if (
    //     token &&
    //     userRole === "privateUser" &&
    //     !initialPrivateFetchMade.current
    //   ) {
    //     initialPrivateFetchMade.current = true;
    //     await fetchBoards();
    //   }
    // };

    setAllBoards([]);
    fetchPublicBoards();

    // fetchData();
  }, [params?.name]);

  const fetchAreas = async (boardId, imageId) => {
    setTappableAreas([]);
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    let url;
    if (userRole === publicUser) {
      url = `${baseURL}/board/fetchPublicUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else if (userRole === privateUser) {
      url = `${baseURL}/board/fetchPrivateUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else if (userRole === user) {
      url = `${baseURL}/board/fetchPublicUserTappableNonPagination?boardId=${boardId}&imageId=${imageId}`;
    } else {
      console.error("Invalid user role");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token && userRole === "privateUser") {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      // Check if the response status is not OK (e.g., 401 Unauthorized)
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const errorData = await response.json();
        console.error("Error details:", errorData);
        return;
      }

      const data = await response.json();
      // console.log("API Response:", data);

      // console.log(data.data.tappables);
      if (data?.data?.tappables?.length > 0) {
        const tappableId = data?.data?.tappables;
        setSingleTappableId(tappableId);

        const adjustedCoordinates = data?.data?.tappables?.map((area) => ({
          id: area.tappableId,
          left: parseFloat(area.left),
          top: parseFloat(area.top),
          width: area.width || 50,
          height: area.height || 50,
          onTapAction: area.onTapAction,
          type: area.type,
          ContentImagesLinks: area.ContentImagesLinks,
          countTappable: area.countTappable,
          tappableImage: area.tappableImage,
          isTappable: area.isTappable,
          width: area.width,
          height: area.height,
        }));

        // console.log("adjustedCoordinates 420: ", adjustedCoordinates);
        // console.log("adjustedCoordinates 420: ", adjustedCoordinates);

        setTappableAreas(adjustedCoordinates);
        const reaction = data?.data;
        // const reaction = data?.data?.tappables[0]?.ContentImagesLinks;
        // console.log("New Reactions 4322 : ", reaction);
        setReactionId(reaction);

        if (data?.data?.reaction?.length > 0) {
          const adjustedReactions = data?.data?.reaction?.map((reaction) => ({
            id: reaction.reactionId,
            left: parseFloat(reaction.left),
            top: parseFloat(reaction.top),
            type: reaction.type,
          }));
        }
      } else {
        // console.log("No tappable areas found.");
      }
    } catch (error) {
      console.error("Error fetching tappable areas: 3 ", error);
    }
  };
  if (loading) {
    return (
      <div className="text-white place-content-center justify-center text-center h-screen ">
        <span className="mb-2"> Loading </span>
        <PropagateLoader color="white" className="mt-3" />
      </div>
    );
  }

  const toggleArt = () => {
    setIsArtOpen(!isArtOpen);
    if (isArtOpen) {
      setCollectionsBoardData([]);
      setActiveItem(null); // Reset the active item to null when Art is closed
    } else {
      setIsContactOpen(false);
      setInfoOpen(false);
      setIsShopOpen(false);
      setManageCreator(false);
      setActiveItem("Art"); // Set Art as the active item when opened
    }
  };

  const handleContact = () => {
    setIsContactOpen(true);
    setIsArtOpen(false);
    setIsShopOpen(false);
    setInfoOpen(false);
    setManageCreator(false);
    setActiveItem("Contact");
  };

  const handleInfo = () => {
    setInfoOpen(true);
    setIsArtOpen(false);
    setIsShopOpen(false);
    setIsContactOpen(false);
    setFullImageId(false);
    setManageCreator(false);
    setActiveItem("Info");
  };

  const shouldShowPlus = () => {
    const publicToken = localStorage.getItem("publicToken");
    const privateToken = localStorage.getItem("token");
    return publicToken || privateToken;
  };

  const displayFullImage = async (
    url,
    imageId,
    boardId,
    isPublic,
    isPrivate
  ) => {
    setTappableAreas([]);
    setReactionId([]);
    setSingleTappableId(null);
    setSingleReactionId([]);

    setFullImageUrl(url);
    setFullImageId(imageId);
    setCurrentBoardId(boardId);

    if (isPublic) {
      setCurrentPublicBoardId(boardId);
      setCurrentPublicBoardImageId(imageId);
      await fetchAreas(boardId, imageId);
    } else {
      setCurrentPrivateBoardId(boardId);
      setCurrentPrivateBoardImageId(imageId);

      await fetchAreas(boardId, imageId);
    }

    if (isPrivate) {
      setCurrentPublicBoardId(boardId);
      setCurrentPublicBoardImageId(imageId);
      await fetchAreas(boardId, imageId);
    } else {
      setCurrentPrivateBoardId(boardId);
      setCurrentPrivateBoardImageId(imageId);

      await fetchAreas(boardId, imageId);
    }
    setIsFullImage(true);
  };

  const closeFullImage = () => {
    setIsFullImage(false);
    setFullImageUrl("");
    setFullImageId("");
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return text?.slice(0, maxLength) + "...";
  };

  const toggleExpand = (type, id) => {
    if (type === "title") {
      setExpandedTitles((prev) => ({ ...prev, [id]: !prev[id] }));
    } else {
      setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleShop = () => {
    setIsShopOpen(true);
    setIsArtOpen(false);
    setIsContactOpen(false);
    setInfoOpen(false);
    setManageCreator(false);
    setActiveItem("Shop");
  };

  const boardCollections = [
    {
      name: "Board Collection #1",
      colors: ["bg-gray-300", "bg-red-600", "bg-blue-600", "bg-gray-400"],
    },
    {
      name: "Board Collection #2",
      colors: ["bg-green-500", "bg-red-500"],
    },
    // {
    //   name: "Board Collection #3",
    //   colors: ["bg-green-500"],
    // },
    {
      name: "Board Collection #4",
      colors: ["bg-green-500", "bg-red-300", "bg-blue-300"],
    },
  ];

  const getImageClass = (colorCount, index) => {
    if (colorCount === 1) return "w-full h-full";
    if (colorCount === 2) return "w-1/2 h-full";
    if (colorCount === 10) return "w-full h-full";
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
      collectionData?.data?.length <= visibleItems &&
      collectionData?.data?.count.length >= 10
    ) {
      // Mock API call to fetch new data (replace with your actual API call)
      setCollectionPage(collectionPage + 1);
    }

    // If we're within the predefined chunk sizes
    if (currentChunkIndex < itemsPerChunk.length - 1) {
      // Add the current chunk size to the visible items count
      setVisibleItems(
        (prevVisible) => prevVisible + itemsPerChunk[currentChunkIndex + 1]
      );
      setCurrentChunkIndex((prevIndex) => prevIndex + 1);
    }
  };

  const fetchCollectionsBoardData = async (url, token) => {
    const apiUrl = `${baseURL}` + `${url}`;
    // console.log("apiUrl", apiUrl);
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
        return response.json();
      })
      .then((data) => {
        setCollectionsBoardData(data?.data?.data[0]);
        // console.log(" collection board data Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getCollectionBoardData = (collectionId) => {
    // console.log("collectionId", collectionId);
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (userRole && token) {
      if (userRole === publicUser || userRole === user) {
        fetchCollectionsBoardData(
          `/board/fetchPublicUserCollectionBoards?collectionId=${collectionId}&page=${1}&pageSize=${10}`,
          token
        );
      }
      if (userRole === privateUser) {
        fetchCollectionsBoardData(
          `/board/fetchPrivateUserCollectionBoards?collectionId=${collectionId}&page=${1}&pageSize=${10}`,
          token
        );
      }
    }
  };

  const handleManageCreator = () => {
    setManageCreator(true);
    setIsShopOpen(false);
    setIsArtOpen(false);
    setIsContactOpen(false);
    setInfoOpen(false);
    setActiveItem("manage-creator");
  };

  console.log("collection data", collectionBoardData);

  return (
    <>
      <div className="lg:w-[30%] ">
        <div className={`${isFullImage ? "hidden lg:block" : "block"}`}>
          <Header />
        </div>

        <nav className="px-4 font-semibold text-[15px] pt-[1vh] bg-[#2D2D2D] text-white">
          <ul className="space-y-4">
            <li
              className={`flex items-center space-x-2 cursor-pointer ${
                isArtOpen || activeItem === "Art" || !activeItem
                  ? "text-white"
                  : "text-gray-500"
              }`}
              onClick={toggleArt}
            >
              <img
                className={`w-6 h-6 ${
                  isArtOpen || activeItem === "Art" || !activeItem
                    ? "brightness-100"
                    : "brightness-50"
                }`}
                src={Galary}
                alt="Gallery"
              />
              <span>Collections</span>
              <img
                className={`w-6 h-6 transform transition-transform ${
                  isArtOpen ? "rotate-180" : "rotate-0"
                } ${
                  isArtOpen || activeItem === "Art" || !activeItem
                    ? "brightness-100"
                    : "brightness-50"
                }`}
                src={leftarrow}
                alt="leftarrow"
              />
            </li>
            <div
              className={` custom-scrollbar transition-max-height mt-0 duration-500 ease-in-out overflow-y-scroll ${
                isArtOpen ? "max-h-40" : "max-h-0"
              }`}
              style={{
                marginTop: isArtOpen ? "10px" : "0px",
              }}
            >
              <div className="space-y-3 px-5 ">
                {/* <div className="flex items-center space-x-2 cursor-pointer"> */}
                {collectionData?.data
                  ?.slice(0, visibleItems)
                  .map((collection, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 "
                      onClick={() => getCollectionBoardData(collection?.id)}
                    >
                      <div className="w-12 h-12 flex flex-wrap rounded overflow-hidden cursor-pointer">
                        {collection?.Board?.length > 0 ? (
                          collection?.Board?.slice(0, 4).map(
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
                          )
                        ) : (
                          <div className={` ${getImageClass(10, 10)} `}>
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                              <span className="text-black">Empty</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-white text-sm font-medium cursor-pointer">
                        {collection?.collectionName}
                      </span>
                    </div>
                  ))}
                {visibleItems <= collectionData?.count && (
                  <div className=" mt-1">
                    <span
                      className="cursor-pointer  underline text-blue-500"
                      onClick={() => showMore()}
                      onTouchStart={() => showMore()}
                    >
                      Show more
                    </span>
                  </div>
                )}
              </div>
              {/* <div className="flex items-center cursor-pointer space-x-2">
                  <span>Digital</span>
                </div> */}
            </div>
            {/* </div> */}

            <li
              className={`flex items-center space-x-2 cursor-pointer ${
                activeItem === "Shop" || !activeItem
                  ? "text-white"
                  : "text-gray-500"
              }`}
              onClick={handleShop}
            >
              <img
                className={`w-6 h-6 ${
                  activeItem === "Shop" || !activeItem
                    ? "brightness-100"
                    : "brightness-50"
                }`}
                src={headershop}
                alt="headershop"
              />
              <span>Shop</span>
            </li>
            <li
              className={`flex items-center space-x-2 cursor-pointer ${
                activeItem === "Info" || !activeItem
                  ? "text-white"
                  : "text-gray-500"
              }`}
              onClick={handleInfo}
            >
              <img
                className={`w-6 h-6 ${
                  activeItem === "Info" || !activeItem
                    ? "brightness-100"
                    : "brightness-50"
                }`}
                src={headerinfo}
                alt="headerinfo"
              />
              <span>Info</span>
            </li>
            <li
              className={`flex items-center space-x-2 cursor-pointer ${
                activeItem === "Contact" || !activeItem
                  ? "text-white"
                  : "text-gray-500"
              }`}
              onClick={handleContact}
            >
              <img
                className={`w-6 h-6 ${
                  activeItem === "Contact" || !activeItem
                    ? "brightness-100"
                    : "brightness-50"
                }`}
                src={Envelope}
                alt="headerinfo"
              />
              <span>Contact</span>
            </li>
            {isAdmin === "admin" && (
              <li
                className={`flex items-center space-x-2 cursor-pointer ${
                  activeItem === "manage-creator" || !activeItem
                    ? "text-white"
                    : "text-gray-500"
                }`}
                onClick={handleManageCreator}
              >
                <img
                  className={`w-6 h-6 ${
                    activeItem === "manage-creator" || !activeItem
                      ? "brightness-100"
                      : "brightness-50"
                  }`}
                  src={Envelope}
                  alt="headerinfo"
                />
                <span>Manage Creator</span>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[30%] bg-[#2D2D2D]">
          <div className="flex m-2 justify-between bg-[#2D2D2D] items-center">
            <p className=" text-[#696969] pl-2">Recent Projects</p>
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
                  {!allBoards?.length ? (
                    <div className="text-white">No boards available.</div>
                  ) : (
                    Array.isArray(allBoards) &&
                    collectionBoardData?.length < 1 &&
                    allBoards.map((board, boardIndex) => (
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
                                    // console.log(
                                    //   "Image clicked, board data:",
                                    //   board.BoardImages[0].id,
                                    //   board.id,
                                    //   board.isPublic
                                    // );
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
                                  (tappable, index) =>
                                    tappable.isTappable && (
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
                            {/* Render Title Only If It Exists */}
                            {board.BoardImages &&
                              board.BoardImages[0] &&
                              board.BoardImages[0].title && (
                                <h3 className="text-[#BFBFBF] text-wrap text-[1.125rem] font-bold leading-[130%]">
                                  {expandedTitles[boardIndex]
                                    ? board.BoardImages[0].title
                                    : truncateText(
                                        board.BoardImages[0].title,
                                        50
                                      )}
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

                            {/* Render Description Only If It Exists */}
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
                                  {board.BoardImages[0].description.length >
                                    50 && (
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
                                // console.log(
                                //   "Image clicked, board data:",
                                //   board?.images[0]?.id,
                                //   board?.id,
                                //   board?.isPublic
                                // );
                                displayFullImage(
                                  board?.images[0]?.imageUrl,
                                  board?.images[0]?.id,
                                  board?.id,
                                  board?.isPublic
                                );
                              }}
                            />
                            {/* )} */}
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
                            {/* Render Title Only If It Exists */}
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

                            {/* Render Description Only If It Exists */}
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
                                  {board?.images[0]?.description?.length >
                                    50 && (
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

                  {collectionBoardData &&
                    collectionBoardData?.boards?.length < 1 && (
                      <div className="text-white">No boards available.</div>
                    )}
                </Masonry>
              </div>
            </div>
          </div>

          <Navbar />
        </div>
        <div
          className={`${
            isInfoOpen || isContactOpen || isFullImage || manageCreator
              ? "block"
              : "hidden"
          } block w-full lg:w-[70%] fixed right-0 top-0 h-full  `}
        >
          <div className=" text-white h-full bg-[#2D2D2D]">
            {isInfoOpen && (
              <Suspense fallback={<div>Loading info...</div>}>
                <div className="flex justify-between  h-full bg-[#191919]">
                  <CreatorInfo closeInfo={() => setInfoOpen(false)} />
                </div>
              </Suspense>
            )}
            {isContactOpen && (
              <Suspense fallback={<div>Loading info...</div>}>
                <div className="flex justify-center h-full bg-[#2A2A2A]">
                  <Contact closeInfo={() => setIsContactOpen(false)} />
                </div>
              </Suspense>
            )}
            {/* {console.log("Rendering Home component 861 ", reactionId)} */}
            {isFullImage && (
              <Suspense fallback={<div>Loading full image...</div>}>
                <div className="w-full h-full">
                  {(currentPublicBoardId && currentPublicBoardImageId) ||
                  (currentPrivateBoardId && currentPrivateBoardImageId) ? (
                    <FullImageWithTappables
                      closeInfo={() => setIsContactOpen(false)}
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
            {isShopOpen && (
              <Suspense fallback={<div>Loading shop...</div>}>
                <div className="flex justify-center h-full bg-[#2A2A2A]">
                  <Shop closeShop={() => setIsShopOpen(false)} />
                </div>
              </Suspense>
            )}
            {isArtOpen && (
              <Suspense fallback={<div>Loading shop...</div>}>
                <div className="flex justify-center h-full bg-[#2A2A2A]">
                  <Art closeArt={() => setIsArtOpen(false)} />
                </div>
              </Suspense>
            )}
            {manageCreator && (
              <Suspense fallback={<div>Loading Manage Creator...</div>}>
                <div className="flex justify-center w-full h-full bg-[#2A2A2A]">
                  <ManageCreatorRequest />
                </div>
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
