const express  = require('express');
const passport = require('passport');
const { Order } = require('../database/schemas');

const { User } = require('../database/schemas');

var ObjectId = require('mongodb').ObjectID;

const router = express.Router();

module.exports = router;


router.post('/saveOrder', (req,res) =>{
    // console.log('req ',req)
    const newOrder = Order(req.body);

    newOrder.save((err, savedUser) => {
        if (err || !savedUser) {
            console.log("err ",err)
          res.status(400).send({ message: 'Placing order Failed', err });
        } else {
            // console.log("Success")
           res.send({ message: 'Order Placed Successfully'});
           console.log("Succ ",savedUser)

          }
        })
        

    console.log("Save order called")
})

router.get('/userOrderDetails/:id', (req,res) =>{
  // console.log('req ',req)
 
  console.log("Get order called")
  console.log("ID ", req.params.id)

  Order
  .find({user_id: ObjectId(req.params.id)})
  .populate('restaurant_id')
  .exec(function(err, orders) {
    res.send({ message: 'Orders', orders}) 
});

})

router.get('/restaurantOrderDetails/:id', (req,res) =>{
  // console.log('req ',req)

  console.log("Rest order detaila ", req.params.id)
  Order
  .find({restaurant_id:req.params.id})
  .populate('user_id')
  .exec(function(err, orders) {
    res.send({ message: 'Orders', orders
  }) 
  console.log("Save order called")
})

})


router.put('/acceptOrder/:id', (req, res) => {
  // req.body.updated_at = Date.now();

  console.log("accpet order ", req.params.id)
  Order.findByIdAndUpdate({ _id: req.params.id }, {status:"Order Accepted"}, { new: true }, (err, orders) => {
    if (err) {
      res.status(400).send({ err, message: 'Error updating order' });
    }
    res.status(200).send({ message: 'Order successfully updated', orders });
  });
});


router.put('/rejectOrder/:id', (req, res) => {
  // req.body.updated_at = Date.now();

  console.log("Reject order ", req.params.id)
  Order.findByIdAndUpdate({ _id: req.params.id }, {status:"Order Rejected"}, { new: true }, (err, orders) => {
    if (err) {
      res.status(400).send({ err, message: 'Error updating order' });
    }
    res.status(200).send({ message: 'Order successfully updated', orders });
  });
});