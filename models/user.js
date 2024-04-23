const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        // Utilisez une expression régulière simple pour valider l'email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 4,
  },
  dateAjout: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update) {
    this.set({ dateModification: Date.now() });
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
