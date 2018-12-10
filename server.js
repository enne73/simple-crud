const express = require('express');
const bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
// app.get('/', (req, res) => {
//   res.json({
//     "message": "Welcome to simple-crud."
//   });
// });

app.get('/', function (req, res) {
 res.send('Hello');
});

// listen for requests
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
