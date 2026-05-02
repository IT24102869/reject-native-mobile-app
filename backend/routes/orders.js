const express = require('express');
const router = express.Router();
const { createOrder, getStudentOrders, getOwnerOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, roleCheck } = require('../middleware/auth');

router.post('/', auth, roleCheck('student'), createOrder);
router.get('/myorders', auth, roleCheck('student'), getStudentOrders);
router.get('/all', auth, roleCheck('owner'), getOwnerOrders);
router.put('/:id/status', auth, roleCheck('owner'), updateOrderStatus);

module.exports = router;
