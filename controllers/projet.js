const Projet = require("../models/projet");
const Categorie = require("../models/categorie");
const fs = require("fs");
const path = require("path");

// Controller function to get all projets
const getAllProjets = async (req, res) => {
  try {
    let filter = {};
    if (req.query.categorie) {
      filter.categorieId = req.query.categorie;
    }
    if (req.query.aLaUne) {
      filter.aLaUne = req.query.aLaUne;
    }
    if (req.query.actif) {
      filter.actif = req.query.actif;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    const { count, rows: projets } = await Projet.findAndCountAll({
      where: filter,
      include: Categorie,
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      projets: projets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get projet by slug
const getProjetBySlug = async (req, res) => {
  try {
    const projet = await Projet.findOne({
      where: { slug: req.params.slug },
      include: Categorie,
    });
    if (!projet) {
      return res.status(404).json({ message: "Projet introuvable" });
    }
    res.json(projet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new projet
const createProjet = async (req, res) => {
  try {
    const files = req.files || {};
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let cover = "";
    if (files["cover"] && files["cover"].length > 0) {
      cover = `${basePath}${files["cover"][0].filename}`;
    }

    const projet = await Projet.create({
      cover: cover,
      images: [], // Laisser le champ images vide par défaut
      ...req.body,
    });

    res.status(201).json(projet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addImageLink = async (req, res) => {
  const id = req.params.id;
  const { images } = req.body;

  try {
    const projet = await Projet.findByPk(id);

    if (!projet) {
      return res.status(404).json({ message: "Projet not found" });
    }

    // Ajouter les nouvelles images à la liste existante
    projet.images = [...projet.images, ...images];

    await projet.save();

    res.status(200).json(projet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const uploadImage = async (req, res) => {
  const id = req.params.id;
  const { files } = req; // Assurez-vous d'avoir configuré Multer correctement pour gérer les fichiers

  try {
    const projet = await Projet.findByPk(id);

    if (!projet) {
      return res.status(404).json({ message: "Projet not found" });
    }

    // Convertir les fichiers en liens URL et les ajouter à la liste existante
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const imageLinks = files.images.map(
      (file) => `${basePath}${file.filename}`
    ); // Assurez-vous que 'images' est correctement défini dans votre configuration Multer

    projet.images = [...projet.images, ...imageLinks];

    await projet.save();

    res.status(200).json(projet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const clearImages = async (req, res) => {
  const id = req.params.id;

  try {
    const projet = await Projet.findByPk(id);

    if (!projet) {
      return res.status(404).json({ message: "Projet not found" });
    }

    // Vider la liste d'images
    projet.images = [];

    await projet.save();

    res.status(200).json({ message: "Images cleared successfully", projet });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProjet = async (req, res) => {
  try {
    const { id } = req.params;
    const { files, body } = req;

    // Vérifier si le projet existe
    const projet = await Projet.findByPk(id);
    if (!projet) {
      return res
        .status(404)
        .json({ msg: `Projet avec l'ID : ${id} non trouvé` });
    }

    // Préparer les données de mise à jour
    let updateData = { ...body };

    // Si un fichier est envoyé pour la couverture, mettre à jour la couverture
    if (files["cover"]) {
      updateData.cover = `${req.protocol}://${req.get("host")}/public/uploads/${
        files["cover"][0].filename
      }`;
    }

    // Mettre à jour l'objet Projet
    await projet.update(updateData);

    // Recharger le projet mis à jour pour obtenir les dernières modifications
    await projet.reload();

    res.json(projet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete projet by ID
const deleteProjetById = async (req, res) => {
  try {
    const projet = await Projet.findByPk(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: "Projet not found" });
    }

    await projet.destroy();

    res.json({ message: "Projet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProjets,
  getProjetBySlug,
  createProjet,
  updateProjet,
  deleteProjetById,
  addImageLink,
  uploadImage,
  clearImages,
};
