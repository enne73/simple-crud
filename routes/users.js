var express = require('express');
var mongoose = require('mongoose');
const router = express.Router();

var User = require('../schema/User');

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Serving Users on the Endpoint."
  });
});

router.get("/list", (req, res, next) => {
  User.find({})
    .exec()
    .then(docs => {
      res.status(200).json({
        docs
      });
    })
    .catch(err => {
      console.log(err)
    });
});


router.get("/error", (req, res, next) => {
  throw Error('simulated error');
});


router.get('/update/:id', (req, res, next) => {
  let id = req.params.id;
  User.findOne({
    _id: id
  }, (err, user) => {
    if (err) throw err;
    res.render('users/form', {
      user: user
    });
  });
});

router.get('/detail/:id', (req, res, next) => {
  let id = req.params.id;
  User.findOne({
    _id: id
  }, (err, user) => {
    if (err) throw err;
    res.render('users/form', {
      user: user
    });
  });
});

router.get('/add', (req, res, next) => {
  res.render('users/form');
});

router.post("/add", (req, res, next) => {

  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    address: req.body.address,
    salary: req.body.salary
  });

  user.save()
    .then(result => {
      res.status(200).json({
        docs: [user]
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/persist", (req, res, next) => {
  const id = req.body._id;
  let wm = {
    name: {
      first: req.body.first,
      last: req.body.last
    },
    email: req.body.email
  }
  console.log(wm);
  if (id) {
    User.findOneAndUpdate(id, {
      $set: wm
    }, function(err, user) {
      if (err) return next(err);
      res.redirect('detail/' + id);
    });
  } else {
    let user = new User(wm);
    user.save(function(err, u) {
      if (err) return next(err);
      res.redirect('detail/' + u._id);
    })
  }
});


router.post("/delete", (req, res, next) => {
  const rid = req.body.id;

  User.findById(rid)
    .exec()
    .then(docs => {
      docs.remove();
      res.status(200).json({
        deleted: true
      });
    })
    .catch(err => {
      console.log(err)
    });
});

module.exports = router;
