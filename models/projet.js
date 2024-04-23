const mongoose = require("mongoose");
const slugify = require("slugify");

const ProjetSchema = new mongoose.Schema({
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
    },
  ],
  titre: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  cover: {
    type: String,
    required: true,
  },
  video: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  color: {
    type: String,
    default: "#3f3f3f",
  },
  dateAjout: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
});

ProjetSchema.pre("save", async function (next) {
  this.slug = slugify(this.titre, { lower: true });
  next();
});

ProjetSchema.pre("findOneAndUpdate", async function (next) {
  if (typeof this._update.name === "string") {
    this._update.slug = slugify(this._update.name, { lower: true });
  }

  const update = this.getUpdate();
  if (update) {
    this.set({ dateModification: Date.now() });
  }
  next();
});

module.exports = mongoose.model("Projet", ProjetSchema);
