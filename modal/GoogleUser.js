const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
  name: String,
  googleId: String,
});

const GoogleUser = mongoose.model("googleUser", googleUserSchema);

module.exports = GoogleUser;
