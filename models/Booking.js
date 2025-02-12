const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true }, 
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  tourDate: { type: Date, required: true },
  
});

module.exports = mongoose.model("Booking", bookingSchema);
