// Importing necessary models, libraries, and configuration
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Membership = require('../models/membershipModel');
const Assignment = require('../models/assignmentModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Controller method to send invitations to a group
exports.addInvitation = async (req, res) => {
    try {
        // Extract user and group IDs from request parameters
        const userId = req.params.id_group;
        const groupId = req.params.id_group;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // Verify that the user making the request is the admin of the group
        if (userId !== group.admin.toString()) {
            return res.status(403).json({ message: 'Access denied. You do not have the necessary permissions.' });
        }

        // Generate an invite token with a 1-hour expiration
        const inviteToken = await jwt.sign({ groupId, userId }, process.env.JWT_KEY_INVIT, { expiresIn: '1h' });

        // Send invitations to all users in the database (add your logic here if necessary)

        res.status(200).json({ message: 'Invitation sent successfully.', inviteToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller method to accept an invitation
exports.acceptInvit = async (req, res) => {
    try {
        // Extract user and group IDs from request parameters
        const userId = req.params.id_group;
        const groupId = req.params.id_group;

        // Check if the user exists
        const user = await User.findById(userId);
        const groupExists = await Group.findById(groupId);

        if (!user || !groupExists) {
            return res.status(404).json({ message: 'User or group not found.' });
        }

        // Check if the user is already in the group
        const userInGroup = await Group.findOne({ _id: groupId, 'users.user_id': userId });

        if (userInGroup) {
            return res.status(400).json({ message: 'User is already in the group.' });
        }

        // Check if the user has refused the invitation
        const userRefusedInvitation = user.refuseInvit;

        if (userRefusedInvitation) {
            return res.status(400).json({ message: 'You cannot accept an invitation you have previously refused.' });
        }

        // Use findOneAndUpdate for atomic operation
        await Group.findOneAndUpdate(
            { _id: groupId },
            { $addToSet: { users: { user_id: userId, role: 'user' } } }
        );

        res.status(200).json({ message: 'Invitation accepted successfully. You have been added to the group.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller method to decline an invitation
exports.declineInvit = async (req, res) => {
    try {
        // Extract user and group IDs from request parameters
        const userId = req.params.id_group;
        const groupId = req.params.id_group;

        // Check if the user exists
        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if (!user || !group) {
            return res.status(404).json({ message: 'User or group not found.' });
        }

        // Check if the user is already in the group
        const userInGroup = group.users.some(u => u.user_id === userId);

        if (userInGroup) {
            return res.status(400).json({ message: 'User is already in the group.' });
        }

        // Update the refuseInvit property to true in the user schema
        user.refuseInvit = true;
        await user.save();

        res.status(200).json({ message: 'Invitation declined successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
