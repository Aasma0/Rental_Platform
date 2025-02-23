import React, { useState } from 'react';

const PropertyCard = ({ property }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleViewClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <img className="w-full" src={property.images[0]} alt={property.title} />
            <div className="px-6 py-4">
                <h3 className="font-bold text-xl mb-2">{property.title}</h3>
                <p className="text-gray-700 text-base">{property.location}</p>
                <p className="text-gray-700 text-base">${property.price}</p>
                <p className="text-gray-700 text-base">Owner: {property.owner.name}</p>
                <button 
                    onClick={handleViewClick} 
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    View
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg relative">
                        <span 
                            className="absolute top-2 right-2 cursor-pointer text-gray-500" 
                            onClick={handleClose}
                        >
                            &times;
                        </span>
                        <div className="grid grid-cols-5 gap-2">
                            {property.images.map((img, index) => (
                                <div key={index} className="p-1">
                                    <img className="w-full h-auto" src={img} alt={`Property ${index}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyCard;