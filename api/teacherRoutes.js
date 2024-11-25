const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
router.use(express.json());

router.get("/teacher", teacherController.getStudentsInClass);
router.post("/teacher/delete-user/:userId", teacherController.deleteUser);
router.post('/teacher/update-user-profile-picture', teacherController.updateUserProfilePicture);

module.exports = router;