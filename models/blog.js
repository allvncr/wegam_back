// Importer Sequelize, DataTypes et slugify
const { DataTypes } = require("sequelize");
const slugify = require("slugify");
// Importer la connexion à la base de données
const sequelize = require("../db/sequelize");

// Définir le modèle de l'article de blog
const Article = sequelize.define("Article", {
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [0, 1000], // Limiter la longueur de l'auteur à 1000 caractères
    },
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  categorie: {
    type: DataTypes.STRING,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  auteur: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [0, 1000], // Limiter la longueur de l'auteur à 1000 caractères
    },
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Middleware pour générer le slug avant la création de l'article
Article.beforeCreate((article, options) => {
  if (article.titre) {
    article.slug = slugify(article.titre, { lower: true });
  }
});

// Middleware pour mettre à jour le slug avant chaque mise à jour de l'article
Article.beforeUpdate((article, options) => {
  if (article.titre) {
    article.slug = slugify(article.titre, { lower: true });
  }
});

// Exporter le modèle de l'article de blog
module.exports = Article;
