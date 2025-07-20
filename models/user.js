const { createHmac, randomBytes } = require("crypto");
const mongo = require("mongoose");
const {createtoken} = require('../services/auth')
const user = new mongo.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    dpurl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      emun: ["ADMIN", "NORMAL"],
      default: "USER",
    },
  },
  { timestamps: true }
);
user.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashpass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashpass;
  next();
});
user.static("matchpassandgen_token", async function (email, password) {
  const user =await this.findOne({ email });
  if(!user) throw new Error('User not found')
  if (!user) return fasle;
  const salt = user.salt;
  const hashpass = user.password;
  const userhash = createHmac("sha256", salt).update(password).digest("hex");
  if(hashpass!== userhash) throw new Error('Password incorrect')
  const token = createtoken(user)
  return token;
});
module.exports = mongo.model("user", user);
