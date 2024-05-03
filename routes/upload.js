const express = require("express");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/webp": "webp",
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

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Aucun fichier n'a été téléchargé" });
  }

  const url = req.file.filename;

  res.status(200).json({
    location: `/${url}`,
    class: "uploadImg",
  });
});

module.exports = router;
