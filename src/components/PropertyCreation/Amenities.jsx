import React from 'react';

const Amenities = ({ tags, selectedTags, onTagClick }) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Amenities (max 10)
        <span className="ml-2 text-sm font-normal text-gray-500">
          {selectedTags.length}/10 selected
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag._id}
            type="button"
            onClick={() => onTagClick(tag._id)}
            className={`px-3 py-1 rounded-full border flex items-center ${
              selectedTags.includes(tag._id)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            {selectedTags.includes(tag._id) && (
              <svg
                className="w-4 h-4 mr-1 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Amenities;