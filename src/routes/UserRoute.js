const express = require('express');
const { registerUser, loginUser, updateProfile } = require('../controllers/UserControllers');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch("/profile", auth, updateProfile); // Add the new route

module.exports = router;
