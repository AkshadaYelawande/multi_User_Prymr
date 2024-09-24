import search from "../../src/assets/search.svg";
import leftarrow from "../../src/assets/leftarrow.svg";
import avatar from "../../src/assets/Avatar.svg";
import logo from "../../src/assets/logo.png";
import ShoppingCart from "../../src/assets/ShoppingCart.svg";
import Collections from "../../src/assets/Collections.svg";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setBoards } from "../../src/redux/slice";

const Header = () => {
  const dispatch = useDispatch();

  const [isSearching, setIsSearching] = useState(false);

  const page = 1;
  const pageSize = 10;

  const handleCloseSearch = () => {
    setIsSearching(false);
  };

  const handleOpenSearch = () => {
    setIsSearching(true);
  };

  const handleInputChange = async (e) => {
    try {
      const response = await fetch(
        `https://prymr-dev-backend.vercel.app/api/board/fetchPublicBoards?page=${page}&pageSize=${pageSize}&searchText=${e.target.value}`
      );

      const data = await response.json();

      console.log(data);
      //data from search api
      dispatch(setBoards(data.data.boards));
    } catch (error) {
      console.log("Error fetching boards", error);
    }
  };

  return (
    <div className="flex fixed top-0 py-4 justify-between items-start bg-gradient-to-t from-[#262626] to-black  w-full z-10">
      <div className="flex items-center justify-around gap-5">
        <img src={logo} alt="logo" className="px-2" />
        <div className=" flex">
          <div className="relative -left-5">
            <img src={leftarrow} alt="notification" />
            <div className="absolute  top-2 left-6 w-4 h-4 bg-[#FFF550] rounded-full flex items-center justify-center">
              <span className="text-sm">1</span>
            </div>
          </div>
          <div className="flex place-items-end gap-10">
            {/* <div className="flex gap-1">
              <img onClick={handleOpenSearch} src={search} alt="search" />
              {isSearching && (
                <>
                  <input
                    type="text"
                    placeholder="Search"
                    className={`${
                      isSearching ? "block" : "hidden"
                    } bg-transparent border-b-2 border-[#FFF550] text-white focus:outline-none `}
                    onChange={handleInputChange}
                  />
                  <img src={close} alt="close" onClick={handleCloseSearch} />
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex justify-end  text-white items-end gap-4 px-14">
        <span>
          <img src={Collections} className="px-5" />
          Collection
        </span>

        <span>
          <img src={ShoppingCart} /> Cart
        </span>
      </div>
    </div>
  );
};

export default Header;
