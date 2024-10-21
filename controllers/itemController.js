const Item = require('../models/itemModel')

// Create an Item (Post) 
const createItem = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}


module.exports = { createItem};