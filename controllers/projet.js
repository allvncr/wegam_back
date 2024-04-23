const Projet = require("../models/projet");
const Categorie = require("../models/categorie");
const fs = require("fs");
const path = require("path");

// Controller function to get all phone brands
const getAllProjets = async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      const categories = req.query.categories.split(","); // Séparez les catégories en un tableau
      filter.categories = { $in: categories }; // Utilisez l'opérateur $in pour rechercher les projets avec au moins une des catégories spécifiées
    }

    const projets = await Projet.find(filter)
      .sort({ dateAjout: 1 })
      .select("categories titre slug cover video")
      .populate("categories");
    res.json(projets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjetByCategorie = async (req, res) => {
  try {
    // Trouvez toutes les catégories existantes
    const categories = await Categorie.find();

    // Stockez les projets correspondants pour chaque catégorie
    const projetsParCategorie = [];

    // Pour chaque catégorie, trouvez un projet associé et stockez-le
    for (const categorie of categories) {
      const projet = await Projet.findOne({ categories: categorie._id })
        .select("categories titre slug cover")
        .populate("categories");
      if (projet) {
        projetsParCategorie.push(projet);
      }
    }

    res.json(projetsParCategorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get phone brand by slug
const getProjetBySlug = async (req, res) => {
  try {
    const projet = await Projet.findOne({ slug: req.params.slug });
    if (!projet) {
      return res.status(404).json({ message: "Projet introuvable" });
    }
    res.json(projet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new phone brand
const createProjet = async (req, res) => {
  try {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json("No images in the request");
    }

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const cover = files["cover"][0].filename; // Récupérer le nom du fichier de la couverture téléchargée
    const images = files["images"].map((file) => file.filename); // Récupérer les noms des fichiers des images téléchargées

    const projet = new Projet({
      cover: `${basePath}${cover}`,
      images: images.map((image) => `${basePath}${image}`), // Construire les chemins complets des images téléchargées
      ...req.body,
    });
    await projet.save();
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
    const projet = await Projet.findById(id);
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

    // Si des fichiers sont envoyés pour les images, mettre à jour les images
    if (files["images"]) {
      updateData.images = files["images"].map(
        (file) =>
          `${req.protocol}://${req.get("host")}/public/uploads/${file.filename}`
      );
    }

    // Mettre à jour l'objet Projet
    const updatedProjet = await Projet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProjet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete phone brand by ID
const deleteProjetById = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: "Projet not found" });
    }
    res.json({ message: "Projet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProjets,
  getProjetByCategorie,
  getProjetBySlug,
  createProjet,
  updateProjet,
  deleteProjetById,
};
