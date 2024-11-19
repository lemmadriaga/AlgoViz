const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/api/get-user-profile", userController.getUserProfile);

router.post(
  "/update-user-profile-picture",
  userController.updateUserProfilePicture
);

router.post("/update-user-progress",
  userController.updateProgress
)

module.exports = router;
