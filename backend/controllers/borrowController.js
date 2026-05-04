const BorrowRequest = require('../models/BorrowRequest');
const Book = require('../models/Book');

// @desc    Create borrow request
// @route   POST /api/borrows
// @access  Private (student)
const createRequest = async (req, res) => {
  const { bookId, startDate, endDate } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is currently not available' });
    }

    const request = new BorrowRequest({
      studentId: req.user.id,
      bookId,
      adminId: book.ownerId,
      startDate,
      endDate
    });

    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student's borrow requests
// @route   GET /api/borrows/student
// @access  Private (student)
const getStudentRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ studentId: req.user.id })
      .populate('bookId')
      .populate('adminId', 'name')
      .sort('-createdAt');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin's incoming requests
// @route   GET /api/borrows/admin
// @access  Private (library_admin)
const getAdminRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ adminId: req.user.id })
      .populate('bookId')
      .populate('studentId', 'name email')
      .sort('-createdAt');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update request status/dates
// @route   PUT /api/borrows/:id
// @access  Private (library_admin)
const updateRequestStatus = async (req, res) => {
  const { status, startDate, endDate } = req.body;
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) request.status = status;
    if (startDate) request.startDate = startDate;
    if (endDate) request.endDate = endDate;

    const updatedRequest = await request.save();

    // Optionally update book availability if Approved
    if (status === 'Approved') {
      const book = await Book.findById(request.bookId);
      if (book) {
        book.isAvailable = false;
        await book.save();
      }
    } else if (status === 'Rejected' || status === 'Returned') { // If you add Returned state later
      const book = await Book.findById(request.bookId);
      if (book && !book.isAvailable) {
        book.isAvailable = true;
        await book.save();
      }
    }

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRequest,
  getStudentRequests,
  getAdminRequests,
  updateRequestStatus
};
