const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route for getting user profile
router.get("/api/get-user-profile", userController.getUserProfile);

// Route for updating profile picture
router.post(
  "/update-user-profile-picture",
  userController.updateUserProfilePicture
);

module.exports = router;
