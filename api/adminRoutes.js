const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const upload = require('../middleware/multerConfig');

router.get("/admin", adminController.getAllUsers);
router.post("/admin/delete-user/:userId", adminController.deleteUser);
router.post('/admin/update-user-profile-picture', upload.single('profilePicture'), adminController.updateUserProfilePicture);


module.exports = router;
