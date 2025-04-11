import React from 'react';

const PriceSection = ({ propertyType, price, onPriceChange, pricingUnit, onPricingUnitChange }) => {
  // Set default pricing unit for Sharing
  React.useEffect(() => {
    if (propertyType === "Sharing" && !pricingUnit) {
      onPricingUnitChange("Per Month");
    }
  }, [propertyType, onPricingUnitChange, pricingUnit]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {propertyType === "Selling" ? "Total Price ($)" : "Price ($)"}
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          placeholder="Enter amount"
          min="0"
          required
        />
      </div>
      
      {(propertyType === "Sharing" || propertyType === "Renting") && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">Billing Period</label>
          <div className="grid grid-cols-3 gap-2">
            {["Per Day", "Per Week", "Per Month"].map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => onPricingUnitChange(unit)}
                className={`p-2 rounded-lg border ${
                  pricingUnit === unit
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceSection;