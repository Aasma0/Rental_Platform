import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tags/view");
      setTags(res.data.tags);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // get your JWT token
  
    if (!token) {
      setError("You must be logged in as an admin.");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:8000/api/tags/create",
        { name: tagName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setTagName("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };
  

  const handleDeleteTag = async (tagId) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("You must be logged in as an admin.");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:8000/api/tags/delete/${tagId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchTags(); // refresh the tag list
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError(err.response?.data?.message || "Failed to delete tag");
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Tags</h1>
      
      <div className="flex gap-6 h-[400px]">
        {/* Form Section */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-semibold mb-4">Create New Tag</h2>
            <form onSubmit={handleCreateTag}>
              <div className="flex flex-col mb-4">
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-fit bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Tag
              </button>
            </form>

            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        </div>

        {/* List Section */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-semibold mb-4">Existing Tags</h2>
            <div className="h-[calc(100%-40px)] overflow-y-auto">
              <ul className="pr-2">
                {tags.map((tag) => (
                  <li
                    key={tag._id}
                    className="flex justify-between items-center p-4 mb-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">{tag.name}</span>
                    <button 
                      onClick={() => handleDeleteTag(tag._id)}
                      className="p-2 hover:bg-red-100 rounded-md text-red-600"
                    >
                      <AiFillDelete className="text-lg" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManagement;