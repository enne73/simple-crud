// import mongoose from "mongoose";
var mongoose = require('mongoose');


// var validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };



const userSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    first: {
      type: String,
      required: 'nome obbligatorio'
    },
    last: {
      type: String,
      required: 'cognome obbligatorio'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'e-mail obbligatoria',
    // validate: [validateEmail, 'e-mail non valida'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'e-mail non valida']
  }
});

var UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
