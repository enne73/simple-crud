var express = require('express');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const router = express.Router();

var User = require('../schema/User');

router.get("/list/:p", (req, res) => {
  const PAGE_SIZE = 5;
  let page = parseInt(req.params.p);
  let skip = PAGE_SIZE * (page - 1);
  let w = {}
  User.count(w, (err, count) => {
    if (err) {
      res.json({
        success: false,
        err: err
      });
    } else {
      var q = User.find(w);
      q.limit(PAGE_SIZE);
      q.skip(skip);
      q.sort('-updatedAt');
      q.exec(function(err, users) {
        if (err) {
          res.json({
            success: false,
            err: err
          });
        } else {
          res.json({
            success: true,
            users: users,
            page: page,
            limit: PAGE_SIZE,
            total: count,
            pages: Math.ceil(count / PAGE_SIZE)
          })
        }
      })
    }
  })
});

router.get('/update/:id', (req, res, next) => {
  let id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new Error('id non valido'));
  } else {
    User.findOne({
      _id: id
    }, (err, user) => {
      if (err) throw err;
      if (!user) {
        next(new Error('utente non trovato'));
      } else {
        res.render('users/form', {
          user: user
        });
      }
    });
  }
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

router.get('/paginate/:p', (req, res, next) => {
  const PAGE_SIZE = 5;
  let page = req.params.p;
  let skip = PAGE_SIZE * (page - 1);
  console.log('=============== paginate', page, skip, PAGE_SIZE)
  let w = {}
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
    User.findOne({
      email: wm.email
    }, (err, user) => {
      if (err) throw err;
      if (user) {
        let e = new Error('e-mail già utilizzata da un altro utente');
        next(e);
      } else {
        User.create(wm, function(err, u) {
          if (err) return next(err);
          res.redirect('detail/insert/' + u._id);
        })
      }

    });
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
          res.send({
            success: true,
            operation: 'update'
          })
          // res.redirect('detail/update/' + u._id);
        });
      }
    });
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
