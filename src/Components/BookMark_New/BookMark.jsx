import React, { useState } from "react";
import "./BookMark.css";
import bmImg1 from "../../assets/bookmarkImages/bmImg1.png";
import bmImg2 from "../../assets/bookmarkImages/bmImg2.png";
import bmImg3 from "../../assets/bookmarkImages/bmImg3.png";
import bmImg4 from "../../assets/bookmarkImages/bmImg4.png";
import bmImg5 from "../../assets/bookmarkImages/bmImg5.png";

const BookMark = () => {
  const [selectedIcon, setSelectedIcon] = useState("Folders");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");

  const bookmarks = [
    {
      title: "Oil Painting and Studies",
      boards: 3,
      assets: 4,
      locked: true,
      images: [bmImg1, bmImg2, bmImg3, bmImg4, bmImg1, bmImg2, bmImg3, bmImg4, bmImg1, bmImg2, bmImg3, bmImg4, bmImg1, bmImg2,],
    },
    {
      title: "Old World Images",
      boards: 3,
      assets: 4,
      images: [bmImg2, bmImg5, bmImg3, bmImg1],
    },
    {
      title: "Quick Marks",
      boards: 3,
      assets: 4,
      locked: true,
      images: [bmImg2, bmImg5, bmImg3, bmImg1],
    },
    {
      title: "Oil Painting and Studies",
      boards: 3,
      assets: 4,
      images: [bmImg1, bmImg3, bmImg2, bmImg5],
    },
    {
      title: "Dummy folder 1",
      boards: 2,
      assets: 6,
      images: [bmImg3, bmImg5, bmImg4, bmImg1],
    },
    {
      title: "Dummy folder 2",
      boards: 4,
      assets: 5,
      images: [bmImg1, bmImg4, bmImg1, bmImg2],
    },
  ];

  const handleFolderClick = () => {
    setSelectedIcon("Folders");
    setShowAddPopup(false);
  };

  const handleAllClick = () => {
    setSelectedIcon("All");
  };

  const handleAddClick = () => {
    setSelectedIcon("Add");
    setShowAddPopup(true);
  };

  const handlePopupClose = () => {
    setShowAddPopup(false);
    setSelectedIcon("Folders");
    setFolderTitle(""); // Reset folder title input
  };

  const handleFolderTitleChange = (event) => {
    setFolderTitle(event.target.value);
  };

  return (
    <div className="bookmark-container">
      <header className="bookmark-header">
        <div className="header-left">
          <button className="back-button">&lt;</button>
          <span className="prymr-logo">prymr</span>
        </div>
        <div className="header-right">
          <div className="header-icons">
            <span className="icon">Icon1</span>
            <span className="icon">Icon2</span>
          </div>
        </div>
      </header>

      <div className="collections-container">
        <div className="collections-left">
          <h2>Collections</h2>
          <p>{bookmarks.length} Folders</p>
        </div>
        <div className="collections-right">
          <span
            onClick={handleFolderClick}
            className={selectedIcon === "Folders" ? "selected-icon" : ""}
          >
            Folders
          </span>
          <span
            onClick={handleAllClick}
            className={selectedIcon === "All" ? "selected-icon" : ""}
          >
            All
          </span>
          <span
            onClick={handleAddClick}
            className={selectedIcon === "Add" ? "selected-icon" : ""}
          >
            Add
          </span>
        </div>
      </div>

      <div
        className={`content-container ${showAddPopup ? "popup-visible" : ""}`}
      >
        <div className="bookmarks-list">
          {bookmarks.map((bookmark, index) => (
            <div className="bookmark" key={index}>
              <div className="bookmark-header">
                <h3>{bookmark.title}</h3>
                <div className="bookmark-actions">
                  {bookmark.locked && <span className="lock-icon">🔒</span>}
                  <span className="more-icon">⋮</span>{" "}
                </div>
              </div>
              <p>
                {bookmark.boards} Boards, {bookmark.assets} Assets
              </p>
              <div className="bookmark-images">
                {bookmark.images.map((image, idx) => (
                  <img src={image} alt={`Asset ${idx + 1}`} key={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddPopup && (
        <div className="addFolder-popup">
          <div className="folder-popup-header">
            <span className="close-icon" onClick={handlePopupClose}>
              ×
            </span>
            <button>Folder</button>
          </div>
          <div className="folder-container">
            <input
              type="text"
              value={folderTitle}
              onChange={handleFolderTitleChange}
              placeholder="Title New Folder |"
            />
            <p>Move Bookmarks from different folders to new folder</p>
          </div>
        </div>
      )}

      {!showAddPopup && (
        <div className="new-folder" onClick={handleAddClick}>
          <span>New Folder</span>
        </div>
      )}
    </div>
  );
};

export default BookMark;
