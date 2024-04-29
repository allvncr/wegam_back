const { DataTypes } = require("sequelize");
const slugify = require("slugify");
const sequelize = require("../db/sequelize");
const Categorie = require("./categorie");

const Projet = sequelize.define("Projet", {
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  description_eng: {
    type: DataTypes.STRING,
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  video: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#3f3f3f",
  },
  aLaUne: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Association entre Projet et Categorie
Projet.belongsTo(Categorie, { foreignKey: "categorieId" });

// Middleware pour générer le slug avant la création du projet
Projet.beforeCreate((projet, options) => {
  if (projet.titre) {
    projet.slug = slugify(projet.titre, { lower: true });
  }
});

// Middleware pour mettre à jour le slug avant chaque mise à jour du projet
Projet.beforeUpdate((projet, options) => {
  if (projet.titre) {
    projet.slug = slugify(projet.titre, { lower: true });
  }
});

module.exports = Projet;
