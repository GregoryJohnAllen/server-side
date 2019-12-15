var express = require("express");
var router = express.Router();
var sequelize = require("../db");
var LogModel = sequelize.import("../models/log");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

router.get("/getall", function(req, res) {
  var userid = req.user.id;
  LogModel.findAll({
    where: {
      owner: userid
    }
  }).then(
    function findAllSuccess(data) {
      res.json(data);
    },
    function findAll(err) {
      res.send(500, err.message);
    }
  );
});

//creating workout logs made by user
router.post("/create", function(req, res) {
  var owner = req.user.id;
  var descriptionText = req.body.log.description;
  var definitionText = req.body.log.definition;
  var resultText = req.body.log.result;

  /*{"log":
    { "description":
      "definition":
      "results":
    }
  }
*/
  LogModel.create({
    description: descriptionText,
    definition: definitionText,
    result: resultText,
    owner: owner
  }).then(
    function createSuccess(description, definition, result) {
      res.json({
        description: description,
        definiton: definition,
        result: result
      });
    },
    function createError(err) {
      res.send(500, err.message);
    }
  );
});

router.get("/:id", function(req, res) {
  var primaryKey = req.params.id;
  var userid = req.user.id;
  LogModel.findOne({
    where: { id: primaryKey, owner: userid }
  }).then(data => {
    return data
      ? res.json(data)
      : res.send(
          "Not Authorized to access this row, please login to corect user"
        );
  }),
    err => res.send(500, err.message);
});

router.put("/update/:id", function(req, res) {
  var primaryKey = req.params.id;
  var userid = req.user.id;
  var descriptionText = req.body.log.description;
  var definitionText = req.body.log.definition;
  var resultText = req.body.log.result;

  LogModel.update(
    {
      description: descriptionText,
      definition: definitionText,
      result: resultText
    },
    { where: { id: primaryKey, owner: userid } }
  ).then(data => {
    return (
      data > 0 ? res.json(data) : res,
      send("Not Authorized to access this row, please login to correct user")
    );
  }),
    err => res.send(500, err.message);
});

router.delete('/delete/:id', function(req, res){
  var primaryKey = req.params.id
  var userid = req.user.id

  LogModel.destroy({
    where: {id:primaryKey, owner:userid}
  }).then(data => {
    return res.json(data)
  }), err => res.send(500, err.message)
})

module.exports = router;
