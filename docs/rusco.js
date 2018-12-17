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
