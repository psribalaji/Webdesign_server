const express = require('express')
const passport = require('passport')
const { Restaurant } = require('../database/schemas')

const { User } = require('../database/schemas')

const multer = require('multer')

var ObjectId = require('mongodb').ObjectID

const router = express.Router()

module.exports = router

//Multer Function to store images in uploads folder
var fileStorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '--' + file.originalname)
  },
})

const upload = multer({ storage: fileStorageEngine })

router.post('/test', upload.single('profilePic'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('ss ', req.body)
  console.log('ssdd ', req)

  const newRestaurant = new Restaurant({
    address: '1 Hacker Street',
    restaurantName: 'Facebook',
    pincode: '02120',
    location: 'California',
    profilePic: req.body.profilePic,
  })
  newRestaurant
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Success',
        restaurants: {
          profilePic: result.profilePic,
        },
      })
    })
    .catch((err) => {
      console.log('Err ', err)
      res.send(err)
    })
})

router.post('/addRestaurant', (req, res) => {
  //   if (!req || !req.body || !req.body.username || !req.body.password) {
  //     res.status(400).send({ message: 'Username and Password required' });
  //   }
  console.log('** ', req.body)

  console.log('REGISTER ', req.body)

  const newRestaurant = Restaurant(req.body)

  newRestaurant.save((err, savedUser) => {
    if (err || !savedUser) {
      res.status(400).send({ message: 'Adding new Restaurant Failed', err })
    } else {
      console.log('Success')
      //res.send({ message: 'Restaurant Added successfully'});
      if (!req || !req.body || !req.body.username || !req.body.password) {
        res.status(400).send({ message: 'Username and Password required' })
      }

      req.body.username_case = req.body.username
      req.body.username = req.body.username.toLowerCase()

      const { username } = req.body
      console.log('LL ', savedUser)
      const newUser = User({
        username: req.body.username,
        password: req.body.password,
        restaurantID: savedUser._id,
      })

      User.find({ username }, (err, users) => {
        if (err) {
          res.status(400).send({ message: 'Create user failed', err })
        }
        if (users[0]) {
          res.status(400).send({ message: 'Username exists' })
        }

        newUser.hashPassword().then(() => {
          newUser.save((err, savedUser) => {
            if (err || !savedUser) {
              res.status(400).send({ message: 'Create user failed', err })
            } else {
              User.find({ _id: savedUser._id })
                .populate('restaurantID')
                .exec(function (err, users) {
                  res.send({ message: 'User created successfully', users })
                })
            }
          })
        })
      })
    }
  })
})

router.get('/getRestaurants', (req, res) => {
  Restaurant.find({}, (err, restaurants) => {
    if (err) {
      res.status(400).send({ message: 'Get Restaurants failed', err })
    } else {
      res.send({ message: 'Restaurants retrieved successfully', restaurants })
    }
  })
})

router.post('/addMenu', (req, res) => {
  console.log('Add menu caled')
  //console.log("rr" , req)
  var menuItem = { itemName: req.body.itemName, price: req.body.price }
  Restaurant.findOneAndUpdate(
    { _id: ObjectId(req.user.restaurantID) },
    { $push: { menu: menuItem } },
    { new: true },
    function (error, success) {
      if (error) {
        res.send({ message: 'Error', error })
      } else {
        console.log('Add menu ', success)
        res.send({ message: 'Menu Added successfully', success })
      }
    }
  )
})

router.patch('/updateMenu', (req, res) => {
  console.log('Update menu caled')
  console.log('rr', req.user.restaurantID)
  console.log('mm', req.body)
  var menuItem = { itemName: req.body.itemName, price: req.body.price }
  Restaurant.findByIdAndUpdate(
    { 'menu._id': ObjectId(req.body._id) },
    { $set: menuItem },
    function (error, success) {
      if (error) {
        res.send({ message: 'Error', error })
      } else {
        console.log('Add menu ', success)
        res.send({ message: 'Menu Added successfully', success })
      }
    }
  )
})

router.post('/deleteMenu', (req, res) => {
  console.log('Delete menu caled')
  //console.log("rr" , req)
  console.log('menu id', req.body._id)
  console.log('rest id', req.user.restaurantID)

  Restaurant.findOneAndUpdate(
    { _id: ObjectId(req.user.restaurantID) },
    { $pull: { menu: { _id: ObjectId(req.body._id) } } },
    { new: true },
    function (err, data) {
      if (err) {
        res.send({ message: 'Error', err })
      } else {
        console.log('Delete Menu ', data)
        res.send({ message: 'Deleted successfully', data })
      }
    }
  )
})

router.get('/getMenu', (req, res) => {
  console.log('Menu called')
  // console.log(req)

  console.log(req.user.restaurantID)
  Restaurant.find({ _id: req.user.restaurantID }, (err, restaurants) => {
    if (err) {
      res.status(400).send({ message: 'Get Menus failed', err })
    } else {
      res.send({ message: 'Menus retrieved successfully', restaurants })
    }
  })
})

router.get('/getMenu/:id', (req, res) => {
  console.log('Menu called')
  // console.log(req)

  console.log(req.params.id)
  Restaurant.find({ _id: req.params.id }, (err, restaurants) => {
    if (err) {
      res.status(400).send({ message: 'Get Menus failed', err })
    } else {
      res.send({ message: 'Menus retrieved successfully', restaurants })
    }
  })
})

router.get('/getRestaurantsByLocation/:location', (req, res) => {
  Restaurant.find({ location: req.params.location }, (err, restaurants) => {
    if (err) {
      res.status(400).send({ message: 'Get Restaurants failed', err })
    } else {
      res.send({ message: 'Restaurants retrieved successfully', restaurants })
    }
  })
})

router.get('/getRestaurantsByName/:name', (req, res) => {
  Restaurant.find(
    {
      restaurantName: {
        $regex: new RegExp(req.params.name, 'i'),
      },
    },
    (err, restaurants) => {
      if (err) {
        res.status(400).send({ message: 'Get Restaurants failed', err })
      } else {
        res.send({ message: 'Restaurants retrieved successfully', restaurants })
      }
    }
  )
})

router.get('/getRestaurantsByLocation', (req, res) => {
  Restaurant.find({ location: req.body.location }, (err, restaurants) => {
    if (err) {
      res.status(400).send({ message: 'Get Restaurants failed', err })
    } else {
      res.send({
        message: 'Restaurants Details retrieved successfully',
        restaurants,
      })
    }
  })
})

router.put('/restaurantInfo', (req, res) => {
  req.body.updated_at = Date.now()
  console.log(req.user.restaurantID)
  console.log('** ', req.body)
  Restaurant.findByIdAndUpdate(
    { _id: req.user.restaurantID },
    req.body,
    { new: true },
    (err, restaurants) => {
      if (err) {
        res.status(400).send({ message: 'Update Restaurants failed', err })
      }
      res.send({ message: 'Restaurant updated successfully', restaurants })
    }
  )
})
