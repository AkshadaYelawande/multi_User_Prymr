import React, { useEffect, useState } from "react";
// import { baseURL } from "../Constants/urls";
import { useNavigate } from "react-router";
import "./board.css";

const SaveBoard = () => {
  const [savedBoards, setSavedBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const page = 1;
  const pageSize = 10;

  const fetchSaveBoards = async () => {
    setLoading(true);
    setError(null);
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      // alert("No token found. Please sign in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${baseURL}/board/fetchBoards?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Error fetching data from the API");
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      if (data && data.status) {
        setSavedBoards(data.data.sanitizedBoards || []);
        console.log("Boards:", data.data.sanitizedBoards);
      } else {
        setError("Failed to fetch boards");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaveBoards();
  }, []);

  return (
    <div className="flex flex-col items-center mt-4">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-scroll custom-scrollbar">
          {Array.isArray(savedBoards) && savedBoards.length === 0 ? (
            <span>No Saved Boards Found</span>
          ) : (
            savedBoards.map((board) => (
              <div
                key={board.id}
                className="board-item p-4 m-2 border rounded shadow-lg"
              >
                <img
                  src={board.url}
                  alt="Board"
                  className="board-image w-full h-48 object-cover rounded-md"
                />
                <p className="mt-2 text-sm font-semibold">
                  Status: {board.status}
                </p>
                <p className="text-sm">
                  Title: {board.title ? board.title : "No Title"}
                </p>
                <p className="text-sm">
                  Locked: {board.isLocked ? "Yes" : "No"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SaveBoard;
