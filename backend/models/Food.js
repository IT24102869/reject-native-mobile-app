const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // URL string
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
