import React, { useState } from 'react';

const Bookmarks = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);
  const [folders, setFolders] = useState([
    {
      name: 'Old World Images and Videos',
      boards: 13,
      assets: 44,
    },
    {
      name: 'Old World Images and Videos',
      boards: 13,
      assets: 44,
    },
  ]);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const handleNewFolder = () => {
    setFolders([
      ...folders,
      {
        name: 'New Folder',
        boards: 0,
        assets: 0,
      },
    ]);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookmark</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Bookmark
        </button>
      </div>

      <div className="mt-4">
        <img
          src="https://i.imgur.com/7n8586N.jpg"
          alt="Image"
          className="w-full h-auto"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Select Folder to Bookmark</h2>
        <div className="grid grid-cols-1 gap-4 mt-2">
          {folders.map((folder) => (
            <div
              key={folder.name}
              className={`bg-gray-800 rounded-lg p-4 cursor-pointer ${
                selectedFolder === folder ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => handleFolderClick(folder)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{folder.name}</h3>
                <div className="text-sm">
                  {folder.boards} Boards, {folder.assets} Assets
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleNewFolder}
          >
            <span className="flex items-center space-x-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Folder
            </span>
          </button>
        </div>
      </div>
    </div>
  );
    
}

export default Bookmarks;
