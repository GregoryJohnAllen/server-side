const Sequelize = require("sequelize");
const sequelize = new Sequelize("workoutlog", "postgres", "password", {
  host: "localhost",
  dialect: "postgres"
});
//Sequelize allows for communication between the server and the database

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  module.exports = sequelize
