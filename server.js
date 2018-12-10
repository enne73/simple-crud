const express = require('express');
const bodyParser = require('body-parser');
const expressMongoDb = require('express-mongo-db');

var port = process.env.PORT || 3000;

// create express app
const app = express();

app.use(expressMongoDb('mongodb://enne:enne73@ds141783.mlab.com:41783/simple-crud'));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())

 

app.get('/', function (req, res) {

  let c = req.db.collection('users');
  c.find({}).toArray(function(err, users) {
    if (err) {
      res.json({
        success: false,
        err: err
      })
    } else {
      res.json({
        success: true,
        users: users
      })
    }
  })


});

// listen for requests
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
