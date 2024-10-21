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

// Get Items 

const getItems = async (req, res, next) => {
    try {
        const Items = await Item.find();
        res.status(200).json({ success: true, data: Items });
    } catch (error) {
        next(error);
    }
}

// Update and Item
const updateItem = async (req, res, next) => {
    try {
        const { name, price, description } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {name, price, description},
            {new: true}
        );
        if(!updatedItem){
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
}

// Delete An Item

const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const Items = await Item.findByIdAndDelete(id);

        if (!Items) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ success: true, message: "Item has been deleted" });
    } catch (error) {
        next(error);
    }
}


module.exports = { createItem, getItems, updateItem, deleteItem };