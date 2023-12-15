// Importing the Group and User models
const Group = require('../models/groupModel');
const User = require('../models/userModel');

// Get information about a group
exports.getGroup = async (req, res) => {
    try {
        // Extract user and group IDs from request parameters
        const userId = req.params.id_user;
        const groupId = req.params.id_group;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Verify if the user has the role "admin" in the specified group
        if (userId != req.body.admin) {
            return res.status(403).json({ message: 'Access denied, you are not authorized' });
        }

        // If the user is an admin in the group, send the group information
        res.status(200).json(group);
    } catch (error) {
        // Handle server error
        res.status(500).json({ message: 'Server error.' });
    }
}

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id_user;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if a group with the same name already exists
        const existingGroup = await Group.findOne({ name: req.body.name });
        if (existingGroup) {
            return res.status(400).json({ message: 'Group with the same name already exists' });
        }

        // Create the group with the user as admin
        const newGroup = new Group({
            name: req.body.name,
            admin: userId,
        });

        const group = await newGroup.save();

        // Send success response
        res.status(201).json({ message: 'Group created' });
    } catch (error) {
        // Handle server error and log details
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Delete a group
exports.deleteGroup = async (req, res) => {
    try {
        // Extract user and group IDs from request parameters
        const userId = req.params.id_user;
        const groupId = req.params.id_group;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the user is the admin of the group
        if (user._id.toString() !== group.admin.toString()) {
            return res.status(403).json({ message: 'Access denied. You are not the group admin.' });
        }

        // Delete the group
        await group.remove();

        // Send success response
        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        // Handle server error and log details
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Update a group
exports.updateGroup = async (req, res) => {
    try {
        // Extract user and group IDs from request parameters
        const userId = req.params.id_user;
        const groupId = req.params.id_group;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the user is the admin of the group
        if (user._id.toString() !== group.admin.toString()) {
            return res.status(403).json({ message: 'Access denied. You are not the group admin.' });
        }

        // Update the group
        Object.assign(group, req.body);
        await group.save();

        // Send success response
        res.status(200).json({ message: 'Group updated' });
    } catch (error) {
        // Handle server error and log details
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
