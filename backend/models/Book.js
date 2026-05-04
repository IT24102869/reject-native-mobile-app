const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, enum: ['Textbook', 'New Book', 'General'], required: true },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  quantity: { type: Number, default: 1 },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
