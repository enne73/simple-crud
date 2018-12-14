var express = require('express');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

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
  User.findById(id, (err, user) => {
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
  User.find({}).sort('-updatedAt')
    .exec()
    .then(users => {
      console.log(users)
      res.render('users/search', {
        users: users
      });
    })
    .catch(err => {
      console.log(err)
      next(err);
    });
});

router.get('/paginate/:p', (req, res, next) => {
  const PAGE_SIZE = 5;
  let page = req.params.p;
  let skip = PAGE_SIZE * (page - 1);
  console.log('=============== paginate', page, skip, PAGE_SIZE)
  let w = { }
  User.count(w, (err, count) => {
    if (err) return next(err);
    var q = User.find(w);
    q.limit(PAGE_SIZE);
    q.skip(skip);
    q.sort('-updatedAt');
    q.exec(function(err, users) {
      if (err) return next(err);
      console.log(users)
      res.render('users/search', {
        users: users,
        page: page,
        limit: PAGE_SIZE,
        total: count,
        pages: Math.ceil(count / PAGE_SIZE)
      });
    });
  })

});

router.post("/add", (req, res, next) => {
  setTimeout(() => {
    let wm = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email
    }
    User.create(wm, function(err, u) {
      if (err) return next(err);
      res.redirect('detail/insert/' + u._id);
    })
  }, 1000);
});

router.post("/update", (req, res, next) => {
  setTimeout(() => {
    let wm = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email
    }
    console.log('======= UPDATE', req.body._id)

    User.findById(req.body._id, function(err, user) {
      if (err) return next(err);
      if (user) {
        Object.assign(user, wm);
        user.save((err, u) => {
          if (err) return next(err);
          res.redirect('detail/update/' + u._id);
        });
      }



    });

    // User.update({ _id:  pareq.body._id }, { $set: wm }, (err, u) => {
    //   if (err) return next(err);
    //   res.redirect('detail/update/' + u._id);
    // });

    // User.updateOne({_id: new ObjectId(req.body._id)}, wm, function(err, u) {
    //
    // })
  }, 1000);
});

router.post("/persist", (req, res, next) => {
  let wm = {
    _id: req.body._id ? new ObjectId(req.body._id) : new ObjectId(),
    name: {
      first: req.body.first,
      last: req.body.last
    },
    email: req.body.email
  }
  setTimeout(() => {
    let op = req.body._id ? 'update' : 'insert';

    let user = new User(wm);
    console.log(req.body._id, op, user)

    // console.log(user);
    user.save(function(err, u) {
      if (err) return next(err);
      res.redirect('detail/' + op + '/' + u._id);
    })

    // User.findById(req.body._id, function(err, user) {
    //   if (err) {
    //     console.log(err)
    //     return next(err);
    //   } else {
    //     let op = user ? 'update' : 'insert';
    //     console.log(req.body._id, op, user)
    //     if (!user) {
    //       user = new User(wm);
    //     } else {
    //       delete wm._id;
    //       Object.assign(user, wm);
    //     }
    //     // console.log(user);
    //     user.save(function(err, u) {
    //       if (err) return next(err);
    //       res.redirect('detail/' + op + '/' + u._id);
    //     })
    //   }
    // });
  }, 1000);
});

router.post("/delete", (req, res, next) => {
  const id = req.body.id;
  setTimeout(() => {
    User.findOne({
        _id: id
      })
      .exec()
      .then(user => {
        user.remove((err) => {
          if (err) {
            res.send({
              success: false,
              err: err
            });
          } else {
            res.send({
              success: true
            })
          }
        })
      })
      .catch(err => {
        console.log(err)
        res.send({
          success: false,
          err: err
        })
      });
  }, 1000);
});

module.exports = router;
