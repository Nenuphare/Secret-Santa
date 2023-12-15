const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router 
    .route('/:user_id/groups/')
    .all(jwtMiddleware.verifyToken)
    .post(groupController.createGroup)

router 
    .route('/:user_id/groups/:group_id')
    .all(jwtMiddleware.verifyToken)
    .get(groupController.getGroup)
    .delete(groupController.deleteGroup)
    .put(groupController.updateGroup)

module.exports = router;