const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const {
  createRequest,
  getStudentRequests,
  getAdminRequests,
  updateRequestStatus
} = require('../controllers/borrowController');

// Student routes
router.post('/', auth, roleCheck('student'), createRequest);
router.get('/student', auth, roleCheck('student'), getStudentRequests);

// Library admin routes
router.get('/admin', auth, roleCheck('library_admin'), getAdminRequests);
router.put('/:id', auth, roleCheck('library_admin'), updateRequestStatus);

module.exports = router;
