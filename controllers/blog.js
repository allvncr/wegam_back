const Article = require("../models/blog");
const slugify = require("slugify");
const sequelize = require("../db/sequelize");

// Controller function to get all articles
const getAllArticles = async (req, res) => {
  try {
    let filter = {};

    if (req.query.categorie) {
      // Utilise une opération de comparaison insensible à la casse pour la catégorie
      filter.categorie = sequelize.where(
        sequelize.fn("LOWER", sequelize.col("categorie")),
        req.query.categorie.toLowerCase()
      );
    }

    if (req.query.actif) {
      filter.actif = req.query.actif;
    }

    // Recherche tous les articles ayant la catégorie spécifiée
    const articles = await Article.findAll({
      where: filter,
      order: [["updatedAt", "DESC"]],
    });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get category by slug
const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
    });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new category
const createArticle = async (req, res) => {
  try {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json("No images in the request");
    }

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let cover = "";
    if (files["cover"] && files["cover"].length > 0) {
      cover = files["cover"][0].filename;
    }

    const article = await Article.create({
      cover: `${basePath}${cover}`,
      ...req.body,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre } = req.body;
    const files = req.files;

    // Vérifier si le article existe
    const article = await Article.findByPk(id);
    if (!article) {
      return res
        .status(404)
        .json({ msg: `article avec l'ID : ${id} non trouvé` });
    }

    // Préparer les données de mise à jour
    let updateData = { ...req.body };

    // Si un fichier est envoyé pour la couverture, mettre à jour la couverture
    if (files["cover"]) {
      updateData.cover = `${req.protocol}://${req.get("host")}/public/uploads/${
        files["cover"][0].filename
      }`;
    }
    // Mettre à jour l'objet Article
    await article.update(updateData);

    // Recharger le article mis à jour pour obtenir les dernières modifications
    await article.reload();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete category by ID
const deleteArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await Article.destroy({ where: { id } });

    if (deletedRowCount === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticleById,
};
