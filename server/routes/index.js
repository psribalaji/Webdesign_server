const express = require('express');

const auth         = require('./auth');
const restaurant   = require('./restaurant')

const user         = require('./user');
const users        = require('./users');
const todos        = require('./todos');
const order        = require('./order');


const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/users', users);
router.use('/api/todos', todos);
router.use('/api/res', restaurant)
router.use('/api/order', order)
router.use('/public', express.static('public'));



router.get('/api/tags', (req, res) => {
  res.send([
    'MERN', 'Node', 'Express', 'Webpack', 'React', 'Redux', 'Mongoose',
    'Bulma', 'Fontawesome', 'Ramda', 'ESLint', 'Jest', 'Enzyme',
  ]);
});



module.exports = router;
