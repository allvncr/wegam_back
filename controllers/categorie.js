const Categorie = require("../models/categorie");
const Projet = require("../models/projet");
const slugify = require("slugify");

// Controller function to get all categories
const getAllCategories = async (req, res) => {
  try {
    // Recherchez toutes les catégories
    const categories = await Categorie.findAll();

    // Filtrer les catégories qui ont au moins un projet
    const categoriesWithProjects = await Promise.all(
      categories.map(async (categorie) => {
        const count = await Projet.count({
          where: { categorieId: categorie.id },
        });
        if (!req.query.filter) {
          return categorie;
        } else {
          if (count > 0) {
            return categorie;
          }
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

// Controller function to get category by slug
const getCategorieBySlug = async (req, res) => {
  try {
    const categorie = await Categorie.findOne({
      where: { slug: req.params.slug },
    });
    if (!categorie) {
      return res.status(404).json({ message: "Categorie not found" });
    }
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a new category
const createCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.create(req.body);
    res.status(201).json(categorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true });

    const [updatedRowsCount, [updatedCategorie]] = await Categorie.update(
      { name, slug }, // Utilisez le slug ici
      { where: { id }, returning: true }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: `No category with id : ${id}` });
    }
    res.status(200).json(updatedCategorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete category by ID
const deleteCategorieById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await Categorie.destroy({ where: { id } });

    if (deletedRowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
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
