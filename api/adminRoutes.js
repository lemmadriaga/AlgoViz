const express = require("express");
const router = express.Router();
const userController = require("../controllers/adminController");

router.get("/api/get-admin-profile", adminController.getAdminProfile);

module.exports = router;
