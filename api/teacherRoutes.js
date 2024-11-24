const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const upload = require('../middleware/multerConfig');

router.get("/teacher", teacherController.getStudentsInClass);
router.post("/teacher/delete-user/:userId", teacherController.deleteUser);
router.post('/teacher/update-user-profile-picture', upload.single('profilePicture'), teacherController.updateUserProfilePicture);

module.exports = router;