const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  destination: { type: String, required: true },
  image: { type: String, required: true }, 
});

module.exports = mongoose.model('Tour', tourSchema);