const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware'); 
const membershipController = require('../controllers/membershipController');

// Routes for creating and getting group information
router
    .route('/:user_id/groups/')
    .all(jwtMiddleware.verifyToken)
    .post(membershipController.addInvitation); 

router
    .route('/:user_id/groups/:group_id')
    .all(jwtMiddleware.verifyToken)
    .get(membershipController.acceptInvit) 
    .delete(membershipController.declineInvit);
    
router
    .route('/:user_id/groups/:group_id/invitation/accept')
    .all(jwtMiddleware.verifyToken, jwtMiddleware.verifyTokenInvite)
    .post(membershipController.acceptInvit)

router
    .route('/:user_id/groups/:group_id/invitation/decline')
    .all(jwtMiddleware.verifyToken, jwtMiddleware.verifyTokenInvite)
    .post(membershipController.declineInvit);

module.exports = router;
