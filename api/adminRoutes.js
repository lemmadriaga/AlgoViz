const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
router.use(express.json());

router.get("/admin", adminController.getAllUsers);
router.post("/admin/delete-user/:userId", adminController.deleteUser);
router.post('/admin/update-user-profile-picture', adminController.updateUserProfilePicture);

module.exports = router;