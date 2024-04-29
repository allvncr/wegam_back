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

    const projets = await Projet.findAll({
      where: filter,
      include: Categorie, // Utilisez simplement le modèle Categorie ici
      order: [["createdAt", "DESC"]],
    });

    res.json(projets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get projet by slug
const getProjetBySlug = async (req, res) => {
  try {
    const projet = await Projet.findOne({ where: { slug: req.params.slug } });
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
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json("No images in the request");
    }

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let cover = "";
    if (files["cover"] && files["cover"].length > 0) {
      cover = files["cover"][0].filename;
    }

    let video = "";
    if (files["video"] && files["video"].length > 0) {
      video = files["video"][0].filename;
    }

    let images = [];
    if (files["images"] && files["images"].length > 0) {
      images = files["images"].map((file) => file.filename);
    }

    const projet = await Projet.create({
      cover: `${basePath}${cover}`,
      video: `${basePath}${video}`,
      images: images.map((image) => `${basePath}${image}`),
      ...req.body,
    });

    res.status(201).json(projet);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    // Si un fichier est envoyé pour la vidéo, mettre à jour la vidéo
    if (files["video"]) {
      updateData.video = `${req.protocol}://${req.get("host")}/public/uploads/${
        files["video"][0].filename
      }`;
    }

    // Si des fichiers sont envoyés pour les images, mettre à jour les images
    if (files["images"]) {
      updateData.images = files["images"].map(
        (file) =>
          `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`
      );
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
};
