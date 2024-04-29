// user.js

const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../db/sequelize");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Utilisation de la validation de Sequelize pour l'email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 255], // Longueur minimale: 4, Longueur maximale: 255
    },
  },
});

// Middleware pour hasher le mot de passe avant la création de l'utilisateur
User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Méthode pour créer un token JWT pour l'utilisateur
User.prototype.createJWT = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// Generating JWT token
User.prototype.generateJWT = function () {
  return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Méthode pour comparer le mot de passe fourni avec le mot de passe haché de l'utilisateur
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
