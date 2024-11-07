require("dotenv").config();
const express = require("express");
const path = require("path");
const userAuthenticationRoutes = require("./api/userAuthentication");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("static"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/api", userAuthenticationRoutes);

app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("userAuth/login"));
app.get("/signup", (req, res) => res.render("userAuth/signup"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
