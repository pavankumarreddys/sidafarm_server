const mongoose = require("mongoose");

const TrayLoadingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },

  //from 7pm to 11:59 pm take tomorrow date. after take current date 
  date: { type: String, required: true }, // Format: "yyyy-mm-dd"

  totalTraysLoaded: { type: Number, required: true },
  totalEmptyTrays: { type: Number, default: 0 },
  
  confirmedByAreaIncharge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: Boolean, default: false }, // false = pending, true = confirmed
  
  reason: { type: String, default: "" },
  remarks: { type: String, default: "" },
  
  //return empty trays conform by dcm driver
  emptyTraysCount: { type: Number, default: 0 }, // <-- Added field
  emptyTraysVerifiedByDriver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  emptyTraysVerifiedAt: { type: Date, default: null }, // <-- Already exists

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TrayLoading", TrayLoadingSchema);

