const express = require('express');
const router = express.Router();
const { getAllFoods, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { auth, roleCheck } = require('../middleware/auth');

router.get('/', getAllFoods);
router.post('/', auth, roleCheck('owner'), createFood);
router.put('/:id', auth, roleCheck('owner'), updateFood);
router.delete('/:id', auth, roleCheck('owner'), deleteFood);

module.exports = router;
