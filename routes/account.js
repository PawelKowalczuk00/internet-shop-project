import express from 'express';
import User from '../dataBase/user.js'

const route = express.Router();

route.get('/:id', async (req, res) => {
     if (req.params.id !== req.user._id)
          return res.status(401);
     const user = await User.findById(req.user._id);
     if (user)
          return res.send(user);
     return res.status(404).send('User not found');
});

export default route;