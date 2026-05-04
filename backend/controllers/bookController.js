const Book = require('../models/Book');

// @desc    Get all books (for students)
// @route   GET /api/books
// @access  Private (student, admin)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('ownerId', 'name');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin's books
// @route   GET /api/books/admin
// @access  Private (library_admin)
const getAdminBooks = async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new book
// @route   POST /api/books
// @access  Private (library_admin)
const addBook = async (req, res) => {
  const { title, author, category, image, isAvailable, quantity } = req.body;
  
  if (!title || !author || !category) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newBook = new Book({
      title,
      author,
      category,
      image,
      isAvailable,
      quantity,
      ownerId: req.user.id
    });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (library_admin)
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Check if the current user owns this book
    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (library_admin)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllBooks,
  getAdminBooks,
  addBook,
  updateBook,
  deleteBook
};
