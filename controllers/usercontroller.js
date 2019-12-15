var express = require('express');
var router = express.Router()
var sequelize = require("../db");
var User = sequelize.import("../models/user")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")


//creating a user endpoint
router.post('/createuser', function(req, res){
  // var userName = "fake.com"
  // var password = "ThisIsPassword"

// going deeper into the object by using dot notation, req.body is mandatory bc the json is in the body
  var userName = req.body.user.username
  var password = req.body.user.password

  User.create({ //this is creating a save in the database
    username: userName,
    passwordhash: bcrypt.hashSync(password, 10)
  }).then(
    
    function createSuccess(user){ //on a success this will run
      var token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {expiresIn:60*60*24});
      //process.env.JWT_SECRET this is going to allow for variables to be made for the server and we will add something in .gitignore so that the saved information is not uploaded to github
      res.json({
        user: user,
        message: 'created',
        sessionToken: token
      })
    }, function createError(err){
      res.send(500, err.message);
    })
})

router.post('/signin', function (req, res) {
  let email = req.body.user.username
  let password = req.body.user.password
  User.findOne({
      where: { username: email }
  }).then(user => {
      if (user) {
          comparePasswords(user);
      } else {
          res.send("User not found in our database");
      }
      function comparePasswords(user) {
          bcrypt.compare(password, user.passwordhash, function matches(err, matches) {
              matches ? generateToken(user) : res.send("Incorrect password")
          })
      }
      function generateToken(user) {
          var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
          //process.env.JWT_SECRET this is going to allow variables for your server
          res.json({
              user: user,
              message: 'created',
              sessionToken: token
          })
      }
  }
  );
});

module.exports = router