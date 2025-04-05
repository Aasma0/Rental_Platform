const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true }, // Base price for renting or selling
    totalPrice: { type: Number }, // Total price for selling properties
    pricingUnit: {
      type: String,
      enum: ["Per Day", "Per Week", "Per Month"],
      required: function () {
        // Only required for Renting and Sharing, not for Selling
        return this.type === "Renting" || this.type === "Sharing";
      },
      // Validate that pricingUnit is undefined/null when type is Selling
      validate: {
        validator: function(v) {
          // If type is Selling, pricingUnit should be undefined/null
          // If type is not Selling, pricingUnit should be defined
          return (this.type === "Selling") ? !v : !!v;
        },
        message: props => `${props.value} is not valid for the selected property type`
      }
    },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag", // Reference to Tag model
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Renting", "Selling", "Sharing"], // Only allow these values
      required: true,
    },
    survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: function() { return this.type === 'Sharing'; }

  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);