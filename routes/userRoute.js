const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router
    .route('/register')
    .post(userController.userRegister);

router
    .route('/login')
    .post(userController.userLogin);

router
    .route('/:user_id')
    .all(jwtMiddleware.verifyToken)
    .delete(userController.userDelete)
    .put(userController.userUpdate)
    .get(userController.userGet)

module.exports = router;