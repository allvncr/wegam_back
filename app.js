const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const auth = require("./routes/auth");
const categorie = require("./routes/categorie");
const projet = require("./routes/projet");

// middleware
app.use(express.json());

app.use(cors());

// routes
app.use("/api", auth);
app.use("/api/categories", categorie);
app.use("/api/projets", projet);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(notFound);

const port = 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
