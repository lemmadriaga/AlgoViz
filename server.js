require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const userAuthenticationRoutes = require("./api/userAuthentication");
const userRoutes = require("./api/userRoutes");
const adminRoutes = require("./api/adminRoutes"); // Import admin routes
const { getUserProfile } = require("./controllers/userController");

const app = express();

// Configure session
const configureSession = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    })
  );
};
configureSession(app);

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("static"));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Define routes
app.use("/api", userAuthenticationRoutes);
app.use(userRoutes);
app.use(adminRoutes); // Use admin routes

const requireSession = (req, res, view, params = {}) => {
  if (req.session.userId) {
    res.render(view, params);
  } else {
    res.render("userAuth/login");
  }
};

app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => requireSession(req, res, "userAuth/login"));
app.get("/signup", (req, res) => res.render("userAuth/signup"));

app.get("/dashboard", getUserProfile);

app.get("/dashboard/linearsearch", (req, res) =>
  requireSession(req, res, "userDashboard/search/linearSearch")
);
app.get("/dashboard/binarysearch", (req, res) =>
  requireSession(req, res, "userDashboard/search/binarySearch")
);
app.get("/dashboard/twopointers", (req, res) =>
  requireSession(req, res, "userDashboard/search/twoPointers")
);

app.get("/dashboard/bubblesort", (req, res) =>
  requireSession(req, res, "userDashboard/sort/bubbleSort")
);
app.get("/dashboard/insertionsort", (req, res) =>
  requireSession(req, res, "userDashboard/sort/insertionSort")
);
app.get("/dashboard/heapsort", (req, res) =>
  requireSession(req, res, "userDashboard/sort/heapSort")
);
app.get("/dashboard/quicksort", (req, res) =>
  requireSession(req, res, "userDashboard/sort/quickSort")
);
app.get("/dashboard/mergesort", (req, res) =>
  requireSession(req, res, "userDashboard/sort/mergeSort")
);
app.get("/dashboard/selectionsort", (req, res) =>
  requireSession(req, res, "userDashboard/sort/selectionSort")
);

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.redirect("/login");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
