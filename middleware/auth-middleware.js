const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/keys").jwt;
const User = require("../modal/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const googleUser = req.user;

  // check json web token exist & verified
  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else if (googleUser) {
    console.log("google user authenticated" + googleUser);
    next();
  } else {
    res.redirect("/login");
  }
};

// check current users
const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  const googleUser = req.user;

  if (token) {
    jwt.verify(token, secretKey, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else if (googleUser) {
    console.log("google user", googleUser);
    res.locals.user = googleUser;
    next();
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
