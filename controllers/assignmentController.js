// controllers/MatchingController.js

const Assignment = require('../models/assignmentModel');
const Membership = require('../models/membershipModel');

exports.matchingUsers = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // Retrieve all memberships for the specified group
        const memberships = await Membership.find({ id_group: groupId, invite: true })
            .populate('id_user', '_id role') // Populate the 'id_user' field with user details
            .exec();

        // Extract users who are both gifters and receivers from the memberships
        const users = memberships.filter(member => member.id_user && ['gifter', 'receiver'].includes(member.id_user.role));

        // If there are not enough users in the group, return an error
        if (users.length < 2) {
            return res.status(400).json({ message: 'Not enough users in the group to create assignments.' });
        }

        // Shuffle the list of users randomly
        const shuffledUsers = shuffleArray(users);

        // Create assignments by pairing gifters with receivers
        const assignments = [];
        for (let i = 0; i < shuffledUsers.length; i += 2) {
            const gifter = shuffledUsers[i];
            const receiver = shuffledUsers[i + 1];

            // Create an assignment
            const assignment = new Assignment({
                id_giver: gifter.id_user._id,
                id_receiver: receiver.id_user._id,
            });

            assignments.push(assignment);
        }

        // Save the assignments in the database
        await Assignment.insertMany(assignments);

        console.log('Assignments created successfully.');

        return res.status(200).json({ message: 'Assignments created successfully.' });
    } catch (error) {
        console.error('Error creating assignments:', error);
        return res.status(500).json({ message: 'Error creating assignments' });
    }
};

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
