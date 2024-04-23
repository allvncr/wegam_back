const mongoose = require("mongoose");
const slugify = require("slugify");

const categorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name est obligatoire"],
    trim: true,
    maxlength: [100, "name can not be more than 100 characters"],
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

categorieSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Middleware pre pour mettre à jour le slug avant chaque mise à jour
categorieSchema.pre("findOneAndUpdate", function (next) {
  this._update.slug = slugify(this._update.name, { lower: true });
  next();
});

module.exports = mongoose.model("Categorie", categorieSchema);
