import React from 'react';

const ImageUpload = ({ images, onImageChange, error }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      onImageChange(files.slice(0, 10));
      return;
    }
    onImageChange(files);
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Property Images</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="images" className="cursor-pointer flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">
            {images.length > 0
              ? `${images.length} file${images.length > 1 ? "s" : ""} selected`
              : "Click to upload images (max 10)"}
          </p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;