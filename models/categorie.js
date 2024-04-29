// categorie.js

const { DataTypes } = require("sequelize");
const slugify = require("slugify");
const sequelize = require("../db/sequelize");

const Categorie = sequelize.define(
  "Categorie",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100], // Longueur minimale: 1, Longueur maximale: 100
      },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false, // Désactive la gestion automatique des timestamps (created_at et updated_at)
  }
);

// Middleware pour générer le slug avant la création de la catégorie
Categorie.beforeCreate((categorie, options) => {
  if (categorie.name) {
    categorie.slug = slugify(categorie.name, { lower: true });
  }
});

// Middleware pour mettre à jour le slug avant chaque mise à jour de la catégorie
Categorie.beforeUpdate((categorie, options) => {
  if (categorie.name) {
    categorie.slug = slugify(categorie.name, { lower: true });
  }
});

module.exports = Categorie;
