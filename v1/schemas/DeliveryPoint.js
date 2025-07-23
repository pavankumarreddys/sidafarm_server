const mongoose = require('mongoose');

const deliveryPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Name of the delivery point (e.g., "Madhapur")
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // This will refer to the in-charge user's ID
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPoint', deliveryPointSchema);
