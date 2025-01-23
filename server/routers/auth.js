const express = require ('express');
const app = express();
const router = express.Router();
const userController = require('../controller/userscontroller')

router.post('/register',userController.register);
router.post('/login',userController.loginUser);
router.get('/logout',userController.logoutUser);


module.exports = router;