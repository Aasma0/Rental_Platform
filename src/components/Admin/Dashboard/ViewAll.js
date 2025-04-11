import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const ViewAll = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching users");
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await axios.delete(
          `http://localhost:8000/api/admin/users/${userId}`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            },
          }
        );
        setUsers(users.filter(user => user._id !== userId));
        setSuccess("User deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error deleting user";
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const handleSelectUser = (user) => {
    console.log("Selected User:", user); // Log selected user for debugging
    setSelectedUser(user);
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management-container">
      <h1 className="header">User Management</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {users
    .filter(user => user.role === 'user') // Only include users with role 'user'
    .map(user => (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <span className={`status ${user.disabled ? 'disabled' : 'active'}`}>
            {user.disabled ? 'Disabled' : 'Active'}
          </span>
        </td>
        <td>
          {new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </td>
        <td>
          <button
            className="btn view"
            onClick={() => handleSelectUser(user)}
          >
            View
          </button>
          <button
            className="btn delete"
            onClick={() => handleDelete(user._id)}
          >
            Delete
          </button>
        </td>
      </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="user-info">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                <p><strong>Location:</strong> {selectedUser.location || 'N/A'}</p>
              </div>
              <div className="bio-section">
                <p><strong>Bio:</strong></p>
                <p>{selectedUser.bio || 'No bio provided'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAll;
