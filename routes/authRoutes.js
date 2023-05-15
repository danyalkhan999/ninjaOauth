const router = require("express").Router();
const passport = require("passport");
const authController = require("../controller/auth-controler");
const { login_get, login_post, logout_get, signup_get, signup_post } =
  authController;

const { requireAuth } = require("../middleware/auth-middleware");

router.get("/signup", signup_get);
router.post("/signup", signup_post);
router.get("/login", login_get);
router.post("/login", login_post);
router.get("/logout", logout_get);

// o auth routes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// callback route for google to redirect
router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
