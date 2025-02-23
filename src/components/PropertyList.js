import { useEffect, useState } from "react";

const PropertyList = () => {
  const [properties, setProperties] = useState([]); // Default empty array
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/property/all");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Available Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property._id}>
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Location: {property.location}</p>
              <p>Price: ${property.price}</p>
              {property.images.length > 0 && (
                <div>
                  {property.images.map((image, index) => (
                    <img key={index} src={image} alt={property.title} style={{ width: '100px', height: 'auto', margin: '5px' }} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyList;