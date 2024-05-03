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
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticleById,
} = require("../controllers/blog");

router.route("/").get(getAllArticles);

router.post(
  "/",
  upload.fields([{ name: "cover", maxCount: 1 }]),
  createArticle
);

router.route("/:slug").get(getArticleBySlug);

router.route("/:id").delete(deleteArticleById);

router.patch(
  "/:id",
  upload.fields([{ name: "cover", maxCount: 1 }]),
  updateArticle
);

module.exports = router;
