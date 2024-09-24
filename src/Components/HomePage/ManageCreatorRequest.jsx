import React, { useEffect, useState } from "react";
import { baseURL } from "../../Constants/urls";

const mockCreators = [
  {
    id: 1,
    name: "John Doe 1",
    email: "john@example.com",
    requestDate: "2023-09-20",
    status: "pending",
  },
  {
    id: 2,
    name: "Jane Smith 2",
    email: "jane@example.com",
    requestDate: "2023-09-21",
    status: "pending",
  },
  {
    id: 3,
    name: "Alice Johnson 3",
    email: "alice@example.com",
    requestDate: "2023-09-22",
    status: "pending",
  },
  {
    id: 4,
    name: "Alice Johnson 4",
    email: "alice@example.com",
    requestDate: "2023-09-22",
    status: "pending",
  },
  {
    id: 5,
    name: "Alice Johnson 5",
    email: "alice@example.com",
    requestDate: "2023-09-22",
    status: "pending",
  },
  {
    id: 6,
    name: "Alice Johnson 6",
    email: "alice@example.com",
    requestDate: "2023-09-22",
    status: "pending",
  },
  // Add more mock data as needed
];

const ManageCreatorRequest = () => {
  const [creators, setCreators] = useState(mockCreators);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleAccept = (id) => {
    setCreators(
      creators.map((creator) =>
        creator.id === id ? { ...creator, status: "accepted" } : creator
      )
    );
  };

  const handleReject = (id) => {
    setCreators(
      creators.map((creator) =>
        creator.id === id ? { ...creator, status: "rejected" } : creator
      )
    );
  };

  const filteredCreators = creators.filter(
    (creator) =>
      creator.status === activeTab &&
      (creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRequestData = async (url) => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const apiUrl =
      `${baseURL}` +
      `/admin/fetchSuggestionsOfRequestedUser?page=${page}&pageSize=${pageSize}&userName=${userName}`;
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
        if (!response.status) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && typeof data.data !== "string") {
          console.log("data", data);
          //   setCreatorRequestData(data)
        }
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getRequestData();
  }, []);

  return (
    <div className="w-full text-white min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-2">Creator Requests</h1>

      <div className="mb-1">
        <input
          type="text"
          placeholder="Search creators..."
          className="w-full bg-gray-800 text-white border-none rounded-md py-2 px-4"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-1">
        <nav className="flex space-x-4">
          {["pending", "accepted", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } px-4 py-2 rounded-md capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="overflow-scroll h-[60%]">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Request Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="w-full h-full overflow-scroll">
            {filteredCreators.map((creator) => (
              <tr key={creator.id} className="border-b border-gray-800">
                <td className="py-2 px-2">{creator.name}</td>
                <td className="py-2 px-2">{creator.email}</td>
                <td className="py-2 px-2">{creator.requestDate}</td>
                <td className="py-2 px-2">
                  <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-sm">
                    {creator.status}
                  </span>
                </td>
                <td className="py-2 px-2 flex ">
                  <button
                    onClick={() => handleAccept(creator.id)}
                    className="bg-green-500 text-white p-2 rounded mr-2"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleReject(creator.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {filteredCreators?.length < 1 && (
              <div className="flex justify-center items-center h-full">
                No Data found!
              </div>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-2 flex justify-between items-center">
        <div>
          {/* Showing {(currentPage - 1) * itemsPerPage + 1} to{" "} */}
          {/* {Math.min(currentPage * itemsPerPage, filteredCreators.length)} of{" "} */}
          {filteredCreators.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            // onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            // disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            // onClick={() =>
            // //   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            // }
            // disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCreatorRequest;
