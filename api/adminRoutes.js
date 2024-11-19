const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin", adminController.getAllUsers);
router.post("/admin/delete-user/:userId", adminController.deleteUser);

module.exports = router;
