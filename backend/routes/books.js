const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const {
  getAllBooks,
  getAdminBooks,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// Public or student routes
router.get('/', auth, getAllBooks);

// Library admin routes
router.get('/admin', auth, roleCheck('library_admin'), getAdminBooks);
router.post('/', auth, roleCheck('library_admin'), addBook);
router.put('/:id', auth, roleCheck('library_admin'), updateBook);
router.delete('/:id', auth, roleCheck('library_admin'), deleteBook);

module.exports = router;
