var mongoose = require('mongoose');

mongoose.connect(
  'mongodb://enne:enne73@ds141783.mlab.com:41783/simple-crud', {
    useNewUrlParser: true
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB database")
});

module.exports = db;
