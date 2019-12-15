require('dotenv').config();
var express = require('express');
var app = express();
var test = require('./controllers/testcontroller')
var authTest = require("./controllers/authtestcontroller")
var sequelize = require('./db')
var bodyParser = require("body-parser")
var user = require('./controllers/usercontroller')

var login = require('./controllers/logincontroller')
var log = require('./controllers/logcontroller')

sequelize.sync()
app.use(bodyParser.json());
app.use(require('./middleware/header'));


app.use('/api/login', login) //login pointer
app.use('/testcontroller', test)
app.use('/api/user', user) //create a user pointer

app.use(require('./middleware/validate-session')) //anything after this line means it will require a session token so it is protected

app.use('/authtest', authTest)
app.use('/api/log', log) //log creation pointer





app.listen(3000, function(){
  console.log("app is listening on 3000");
})

// app.get("/", function(req, res){ //request and a response
//   res.send('Hello')
// })

// app.use('/api/test', function(req, res){
//   res.send("This is data from the api/test endpoint")
// })

// app.use('/api/about-me', function(req, res){
//   res.send("I am 25 years old and I was born in Boston.")
// })