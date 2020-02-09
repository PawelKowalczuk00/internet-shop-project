import express from 'express';
import User from '../dataBase/user.js';
import Transaction from '../dataBase/transaction.js';

const route = express.Router();

route.get('/:id', async (req, res) => {
     if (req.params.id !== req.user._id)
          return res.status(401);
     let user = await User.findOne({_id: req.user._id})
          .select('-__v -isAdmin');
     if (user)
          return res.send(user);
     return res.status(404).send('User not found');
});

route.get('/:id/transactions', async (req, res) => {
     if (req.params.id !== req.user._id)
          return res.status(401);
     const user = await User.findById(req.user._id);
     if (user) {
          const transactions = await Transaction
               .find()
               .or([{seller: user._id}, {buyer: user._id}])
               .populate('seller', 'email')
               .populate('buyer', 'email')
               .populate('product', 'name')
               .sort('-date');
          return res.send(transactions);
     }
     return res.status(404).send('User not found');
});

export default route;