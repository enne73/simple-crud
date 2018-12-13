var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});





userSchema.pre('save', function preSave(next){
  console.log('=============SAVE', new Date())
  this.updatedAt = new Date();
  next();
});

var UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
