const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "cp1962158p22_wegamstudio",
//   "cp1962158p22_admin",
//   "1croy@bleStudio",
//   {
//     host: "localhost",
//     dialect: "postgres",
//   }
// );

const sequelize = new Sequelize("wegam", "postgres", "0000", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
