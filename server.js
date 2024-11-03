require('dotenv').config();
const express = require("express");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const userAuthentication = require('./api/userAuthentication');

// Firebase Setup
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Get the auth instance

// Setup Express.js
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('static'));

// Home Page
app.get("/", (req, res) => {
    res.render('home');
});

// Login
app.get("/login", (req, res) => {
    res.render('userAuth/login');
});

// Signup
app.get("/signup", (req, res) => {
    res.render('userAuth/signup');
});

// userAuthentication Routes
app.use("/api", userAuthentication(auth));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});