import React, { useState } from 'react';
import axios from 'axios';

const CreateTag = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.post(
        '/api/create-tag', 
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Tag created successfully');
      setName(''); // Reset the input after successful creation
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Failed to create tag');
    }
  };

  return (
    <div>
      <h2>Create a New Tag</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tag Name:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </label>
        <button type="submit">Create Tag</button>
      </form>
    </div>
  );
};

export default CreateTag;
