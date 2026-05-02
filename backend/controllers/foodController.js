const Food = require('../models/Food');

const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ available: true }).populate('ownerId', 'name');
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOwnerFoods = async (req, res) => {
  try {
    const foods = await Food.find({ ownerId: req.user.id });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createFood = async (req, res) => {
  try {
    const { name, description, price, image, available } = req.body;
    const food = new Food({ 
      name, 
      description, 
      price, 
      image, 
      available,
      ownerId: req.user.id 
    });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFood = async (req, res) => {
  try {
    const food = await Food.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!food) return res.status(404).json({ message: 'Food not found or unauthorized' });
    
    Object.assign(food, req.body);
    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!food) return res.status(404).json({ message: 'Food not found or unauthorized' });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllFoods, getOwnerFoods, createFood, updateFood, deleteFood };
