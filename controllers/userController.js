const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

// User registration with password hashing
exports.userRegister = async (req, res) => {
    try {
        // Create a new user with the provided data
        let newUser = new User(req.body);
        let plainTextPassword = req.body.password;

        // Generate a salt
        bcrypt.genSalt(10, async function (err, salt) {
            if (err) {
                throw err;
            }
            // Hash the password using the generated salt
            bcrypt.hash(plainTextPassword, salt, async function (err, hash) {
                if (err) {
                    throw err;
                }
                // Update the user's password with the hashed password
                newUser.password = hash;

                // Save the user to the database
                let user = await newUser.save();
                res.status(201).json({ message: `User created: ${user.email}` });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid request' });
    }
};

// User login with password verification
exports.userLogin = async (req, res) => {
    try {
        // Find the user based on the provided email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(500).json({ message: 'User not found' });
            return;
        }
        // Compare the provided password with the hashed password stored in the database
        bcrypt.compare(req.body.password, user.password, async function (err, result) {
            if (result) {
                // If the password is valid, generate a JWT token for authentication
                let userData = {
                    id: user._id,
                    email: user.email,
                    role: 'admin'
                };
                const token = await jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "10h" });
                res.status(200).json({ token });
            } else {
                // If the password is invalid, return an authentication error
                res.status(401).json({ message: "Email or password invalid" });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occurred while processing" });
    }
};

// User deletion
exports.userDelete = async (req, res) => {
    try {
        // Find and delete the user based on the provided user ID
        const user = await User.findByIdAndDelete(req.params.id_user);
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: 'Server error while deleting user' });
    }
};

// User update
exports.userUpdate = async (req, res) => {
    try {
        // Find and update the user based on the provided user ID
        const user = await User.findByIdAndUpdate(req.params.id_user, req.body, { new: true });
        res.status(200).json({ message: "User updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
};

// Retrieve user information
exports.userGet = async (req, res) => {
    try {
        // Find the user based on the provided user ID
        const user = await User.findById(req.params.id_user);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while retrieving user" });
    }
};
