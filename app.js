const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const sequelize = require("./db/sequelize");
const notFound = require("./middleware/not-found");
const auth = require("./routes/auth");
const categorie = require("./routes/categorie");
const projet = require("./routes/projet");
const blog = require("./routes/blog");
const form = require("./routes/form");
const upload = require("./routes/upload");

sequelize
  .sync({ force: false }) // Utilisez force: true pour supprimer et recréer les tables à chaque synchronisation
  .then(() => {
    console.log("Database synchronized successfully");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

// middleware
app.use(express.json());

app.use(cors());

// routes
app.use("/api/categories", categorie);
app.use("/api/projets", projet);
app.use("/api/blogs", blog);
app.use("/api/form", form);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use("/api", auth);
app.use("/uploads", upload);
app.use(notFound);

const port = 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
