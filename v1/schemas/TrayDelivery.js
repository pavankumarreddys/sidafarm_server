const mongoose = require("mongoose");

const TrayDeliverySchema = new mongoose.Schema({
  trayLoadingId: { type: mongoose.Schema.Types.ObjectId, ref: "TrayLoading", required: true },
  deliveryPointId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPoints", required: true },
  stopNumber: { type: Number, default: 1 },

  traysDelivered: { type: Number, required: true },
  emptyTraysCollected: { type: Number, default: 0 },

  confirmedByPointIncharge: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  confirmedTrays: { type: Number, default: null },
  confirmationTime: { type: Date, default: null },
  shortageReason: { type: String, default: "" },
  remarks: { type: String, default: "" },

  alertSent: { type: Boolean, default: false },
  
   createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TrayDelivery", TrayDeliverySchema);
