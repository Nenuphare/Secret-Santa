// Importing necessary libraries and configuring environment variables
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;

// Middleware for verifying a standard token
exports.verifyToken = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers['authorization'];

        // Check if the token is present
        if (token !== undefined) {
            // Verify the token using the provided secret key
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, jwtKey, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            // Attach user information to the request and proceed to the next middleware
            req.user = payload;
            next();
        } else {
            // Handle case where the token is not found
            res.status(403).json({ message: 'Access denied: token not found' });
        }
    } catch (error) {
        // Handle case where an invalid token is encountered
        console.log(error);
        res.status(403).json({ message: 'Access denied: invalid token' });
    }
};

// Middleware for verifying an invite token specific to a group
exports.verifyTokenInvite = async (req, res, next) => {
    try {
        // Extract invite token from request headers
        const token = req.header('authorization_invite');

        // Check if the invite token is present
        if (token !== undefined) {
            // Verify the invite token using the corresponding secret key
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY_INVITE, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            // Check if the group ID in the payload matches the group ID in the request parameters
            if (payload.id_group === req.params.id_group) {
                // Attach user information to the request and proceed to the next middleware
                req.user = payload;
                next();
            } else {
                // Handle case where the invite token is not valid for the specified group
                res.status(403).json({ message: 'Access denied: invalid token for the invite' });
            }
        } else {
            // Handle case where the invite token is not found
            res.status(403).json({ message: 'Access denied: token not found' });
        }
    } catch (error) {
        // Handle case where an invalid invite token is encountered
        console.log(error);
        res.status(403).json({ message: 'Access denied: invalid token' });
    }
};
