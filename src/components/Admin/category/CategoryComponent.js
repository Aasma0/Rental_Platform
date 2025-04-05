import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/category/all');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await axiosInstance.patch(
          `/category/update/${editingCategory._id}`,
          newCategory
        );
        toast.success(response.data.msg);
        setEditingCategory(null);
      } else {
        const response = await axiosInstance.post('/category/create', newCategory);
        toast.success(response.data.msg);
      }
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.msg);
    }
  };

  const handleEdit = (category) => {
    setNewCategory({ name: category.name, description: category.description });
    setEditingCategory(category);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/category/delete/${id}`);
      toast.success(response.data.msg);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      <div className="flex gap-6 h-[400px]">
        {/* Form Section */}
        <div className="w-1/2 flex flex-col">
          <form 
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full"
          >
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="text-sm font-medium mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex flex-col mb-6">
              <label htmlFor="description" className="text-sm font-medium mb-2">
                Category Description
              </label>
              <textarea
                name="description"
                id="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-fit bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-semibold mb-4">Category List</h2>
            <div className="h-[calc(100%-40px)] overflow-y-auto">
              <ul className="pr-2">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="flex justify-between items-center p-4 mb-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-2 hover:bg-blue-100 rounded-md text-blue-600"
                      >
                        <AiFillEdit className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-2 hover:bg-red-100 rounded-md text-red-600"
                      >
                        <AiFillDelete className="text-lg" />
                      </button>
                    </div>
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

export default CategoryComponent;
