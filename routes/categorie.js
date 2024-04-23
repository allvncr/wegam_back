const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getCategorieBySlug,
  createCategorie,
  updateCategorie,
  deleteCategorieById,
} = require("../controllers/categorie");

router.route("/").get(getAllCategories).post(createCategorie);

router.route("/:slug").get(getCategorieBySlug);

router.route("/:id").delete(deleteCategorieById).patch(updateCategorie);

module.exports = router;
