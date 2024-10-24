const express = require('express');

const {
    createItem,
    getItems,
    updateItem,
    deleteItem
} = require ("../controllers/itemController")


const router = express.Router();

// Item Routes 

router.post('/', createItem);
router.get('/', getItems);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;