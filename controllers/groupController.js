const Group = require('../models/groupModel');
const User = require('../models/userModel');

//Group CRUD
exports.getGroup = async (req, res) => {
    try {
        const userId = req.params.id_user;
        const groupId = req.params.id_user;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Vérifie si l'utilisateur a le rôle "admin" dans le groupe spécifié verify
        if (userId != req.body.admin) {
            return res.status(403).json({ message: 'Access denied, you are not authorized' });
        }

        // Si l'utilisateur est admin dans le groupe, renvoyer les informations du groupe
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
}

exports.createGroup = async (req, res) => {
    try {
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

        res.status(201).json({ message: 'Group created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
}

exports.deleteGroup = async (req, res) => {
    try {
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

        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateGroup = async (req, res) => {
    try {
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

        res.status(200).json({ message: 'Group updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

