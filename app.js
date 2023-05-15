const express = require("express");
const mongoose = require("mongoose");
const { mongoDB } = require("./config/keys");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/auth-middleware");
const passportSetup = require("./services/passport-setup");
const cookieSession = require("cookie-session");
const { secretKey } = require("./config/keys").jwt;
const passport = require("passport");

const app = express();
const port = 3000;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [secretKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = mongoDB.URL;
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to database successfully");
    app.listen(port);
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
