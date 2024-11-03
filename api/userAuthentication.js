// api/userAuthentication.js
const express = require("express");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const router = express.Router();

// Initialize the router with the auth instance
const userAuthentication = (auth) => {
    // Registration
    router.post("/signup", async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered successfully");
            res.status(201).json({
                message: "User registered successfully",
                uid: userCredential.user.uid,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log("Failed to register");
        }
    });

    // Login endpoint
    router.post("/login", async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            console.log("Login succesful");
            res.status(200).json({
                message: "Login successful",
                token,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log("Incorrect email or password");
        }
    });

    return router;
};

module.exports = userAuthentication;