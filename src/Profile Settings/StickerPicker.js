import React, { useState } from "react";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";

const StickerPicker = () => {
  const [searchText, setSearchText] = useState(""); // State for search bar

  const stickers = [
    // Your sticker data here (image URL, category ID, etc.)
  ];

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredStickers = stickers.filter((sticker) =>
    sticker.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container>
      <header className="flex justify-between items-center p-4 bg-gray-200">
        <h1 className="text-xl font-medium">Add Sticker</h1>

        <div className="flex space-x-4">
          <button className="btn btn-sm btn-outline-primary">Emojis</button>
          <button className="btn btn-sm btn-outline-primary">GIFs</button>
          <button className="btn btn-sm btn-outline-primary">Stickers</button>
        </div>
      </header>
      <EmojiPicker />
    </Container>
  );
};

export default StickerPicker;
