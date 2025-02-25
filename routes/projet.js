const express = require("express");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
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
  getProjetBySlug,
  createProjet,
  updateProjet,
  deleteProjetById,
  addImageLink,
  uploadImage,
  clearImages,
} = require("../controllers/projet");

router.route("/").get(getAllProjets);

router.post("/", upload.fields([{ name: "cover", maxCount: 1 }]), createProjet);

router.route("/categories");

router.route("/:slug").get(getProjetBySlug);

router.route("/:id").delete(deleteProjetById);

router.post("/:id/add-link", addImageLink);
router.post(
  "/:id/upload",
  upload.fields([{ name: "images", maxCount: 50 }]),
  uploadImage
);

router.delete("/:id/images", clearImages);

router.patch(
  "/:id",
  upload.fields([{ name: "cover", maxCount: 1 }]),
  updateProjet
);

module.exports = router;
