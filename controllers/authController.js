const Item = require('../models/authModel')


// SignUp Controlller 
const signUp = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// EmailVerfication Controlller 
const emailVerfication = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// OTP Controlller 
const OTP = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// SignIn Controlller 
const signIn = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// Forgot Controlller 
const forgot = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// New Password Controlller 
const newPassword = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}


module.exports = { signUp, emailVerfication, OTP, signIn, forgot, newPassword  };