import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAll = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data);
    } catch (error) {
      setError("Error fetching users");
    }
  };

  const handleDisable = async (userId) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/users/disable/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.map(user => user._id === userId ? { ...user, disabled: true } : user));
    } catch (error) {
      setError("Error disabling user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      setError("Error deleting user");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDisable(user._id)} disabled={user.disabled}>Disable</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAll;
