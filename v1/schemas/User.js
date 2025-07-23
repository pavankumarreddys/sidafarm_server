const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: [
      'admin',
      'superadmin',
      'driver',
      'dcmdriver',
      'pointincharge',
      'areaincharge'
    ]
  },
  isActive: { type: Boolean, default: true },
  mobileNumber: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
