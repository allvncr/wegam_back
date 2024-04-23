const express = require("express");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(" ").join("-");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = FILE_TYPE_MAP[file.mimetype];

    cb(null, `${filename}-${uniqueSuffix}.${extension}`);
  },
});

const upload = multer({ storage: storage });

const {
  getAllProjets,
  getProjetByCategorie,
  getProjetBySlug,
  createProjet,
  updateProjet,
  deleteProjetById,
} = require("../controllers/projet");

router.route("/").get(getAllProjets);

router.post(
  "/",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProjet
);

router.route("/categories").get(getProjetByCategorie);

router.route("/:slug").get(getProjetBySlug);

router.route("/:id").delete(deleteProjetById);

router.patch(
  "/:id",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  updateProjet
);

module.exports = router;
