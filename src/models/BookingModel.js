const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value < this.endDate;
      },
      message: "Start date must be before end date"
    }
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "partially_paid", "paid"], // Fixed enum values
    default: "pending"
  },
  paymentType: {
    type: String,
    enum: ["pay_full", "pay_deposit", "pay_later"],
    required: true
  },
  paymentIntentId: {
    type: String,
    unique: true,
    sparse: true
  },
  depositAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  refunds: [{
    amount: Number,
    reason: String,
    created: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes
BookingSchema.index({ property: 1, startDate: 1 });
BookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", BookingSchema);