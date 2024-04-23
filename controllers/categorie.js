const Categorie = require("../models/categorie");
const Projet = require("../models/projet");

// Controller function to get all phone brands
const getAllCategories = async (req, res) => {
  try {
    // Recherchez toutes les catégories
    const categories = await Categorie.find();

    // Filtrer les catégories qui ont au moins un projet
    const categoriesWithProjects = await Promise.all(
      categories.map(async (categorie) => {
        const count = await Projet.countDocuments({
          categories: categorie._id,
        });
        if (count > 0) {
          return categorie;
        }
      })
    );

    // Retirez les catégories nulles (sans projet associé) du tableau résultant
    const filteredCategories = categoriesWithProjects.filter(
      (categorie) => categorie
    );

    res.json(filteredCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get phone brand by slug
const getCategorieBySlug = async (req, res) => {
  try {
    const categorie = await Categorie.findOne({ slug: req.params.slug });
    if (!categorie) {
      return res.status(404).json({ message: "Categorie introuvable" });
    }
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new phone brand
const createCategorie = async (req, res) => {
  try {
    const categorie = new Categorie(req.body);
    await categorie.save();
    res.status(201).json(categorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategorie = async (req, res) => {
  try {
    const { id: categorieID } = req.params;
    const categorie = await Categorie.findOneAndUpdate(
      { _id: categorieID },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!categorie) {
      return res
        .status(404)
        .json({ msg: `No categorie with id : ${categorieID}` });
    }
    res.status(200).json({ categorie });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// Controller function to delete phone brand by ID
const deleteCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!categorie) {
      return res.status(404).json({ message: "Categorie not found" });
    }
    res.json({ message: "Categorie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategorieBySlug,
  createCategorie,
  updateCategorie,
  deleteCategorieById,
};
