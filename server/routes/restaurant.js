const express  = require('express');
const passport = require('passport');
const { Restaurant } = require('../database/schemas');

const { User } = require('../database/schemas');

var ObjectId = require('mongodb').ObjectID;

const router = express.Router();

module.exports = router;

router.post('/addRestaurant', (req, res) => {
//   if (!req || !req.body || !req.body.username || !req.body.password) {
//     res.status(400).send({ message: 'Username and Password required' });
//   }
  console.log("** ", req.body)
  
  console.log("REGISTER ", req.body)
 


         const newRestaurant = Restaurant(req.body);

          newRestaurant.save((err, savedUser) => {
              if (err || !savedUser) {
                res.status(400).send({ message: 'Adding new Restaurant Failed', err });
              } else {
                  console.log("Success")
                 //res.send({ message: 'Restaurant Added successfully'});
                 if (!req || !req.body || !req.body.username || !req.body.password) {
                  res.status(400).send({ message: 'Username and Password required' });
                }
              
                req.body.username_case = req.body.username;
                req.body.username = req.body.username.toLowerCase();
              
                const { username } = req.body;
                console.log("LL ",savedUser )
                const newUser = User({
                  username:req.body.username,
                  password: req.body.password,
                  restaurantID: savedUser._id
                });
              
                User.find({ username }, (err, users) => {
                  if (err) {
                    res.status(400).send({ message: 'Create user failed', err });
                  }
                  if (users[0]) {
                    res.status(400).send({ message: 'Username exists' });
                  }
              
                  newUser.hashPassword().then(() => {
                    newUser.save((err, savedUser) => {
                      if (err || !savedUser) {
                        res.status(400).send({ message: 'Create user failed', err });
                      } else {
                        User
                        .find({_id:savedUser._id})
                        .populate('restaurantID')
                        .exec(function(err, users) {
                          res.send({ message: 'User created successfully', users
                        }) 
                      });
                 
                    }
                    });
                  });
                   
                });
              }
          });
 
});

router.get('/getRestaurants', (req, res) =>{
    Restaurant.find({ }, (err, restaurants) => {
        if (err) {
          res.status(400).send({ message: 'Get Restaurants failed', err });
        } else {
          res.send({ message: 'Restaurants retrieved successfully', restaurants });
        }
      });
})


router.post('/addMenu', (req, res) =>{
 
  var menuItem = { itemName: req.body.itemName,price: req.body.price };
   Restaurant.findOneAndUpdate(
   { _id: ObjectId(req.body.id) },
   { $push: { menu: menuItem  } },{new: true}, 
   function (error, success) {
        if (error) {
          res.send({ message: 'Error', error })
        } else {
            res.send({ message: 'Menu Added successfully', success })
        }
    });

})

router.get('/getRestaurantsByLocation', (req, res) =>{
    Restaurant.find({location: req.body.location }, (err, restaurants) => {
        if (err) {
          res.status(400).send({ message: 'Get Restaurants failed', err });
        } else {
          res.send({ message: 'Restaurants retrieved successfully', restaurants });
        }
      });
})

router.post('/login', (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }

    req.login(user, err => {
      if (err) {
        res.status(401).send({ message: 'Login failed', err });
      }
      res.send({ message: 'Logged in successfully', user: user.hidePassword() });
    });

  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(400).send({ message: 'Logout failed', err });
    }
    req.sessionID = null;
    req.logout();
    res.send({ message: 'Logged out successfully' });
  });
});
