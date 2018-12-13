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

router.get('/detail/:op/:id', (req, res, next) => {
  let id = req.params.id;
  let wmsg = {
    'insert': 'inserimento completato',
    'update': 'aggiornamento completato',
    'delete': 'cancellazione completata',
  }
  User.findOne({
    _id: id
  }, (err, user) => {
    if (err) throw err;
    res.render('users/form', {
      user: user,
      op: wmsg[req.params.op]
    });
  });
});

router.get('/add', (req, res, next) => {
  res.render('users/form');
});

router.get('/search', (req, res, next) => {
  console.log('=============== search')
  User.find({})
    .exec()
    .then(users => {
      console.log(users)
      res.render('users/search', {
        users: users
      });
    })
    .catch(err => {
      console.log(err)
    });
});

router.post("/persist", (req, res, next) => {
  let wm = {
    name: {
      first: req.body.first,
      last: req.body.last
    },
    email: req.body.email
  }
  setTimeout(() => {
    User.findOne({
      email: wm.email
    }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        let op = user ? 'update' : 'insert';
        if (!user) {
          user = new User(wm);
        } else {
          delete wm._id;
          Object.assign(user, wm);
        }
        console.log(user);
        user.save(function(err, u) {
          if (err) return next(err);
          res.redirect('detail/' + op + '/' + u._id);
        })
      }
    });
  }, 1500);
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
