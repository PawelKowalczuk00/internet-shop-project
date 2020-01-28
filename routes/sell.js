import express from 'express';
import joi from '@hapi/joi';

import { sendProdPostEmail, sendProdPutEmail, sendProdDelEmail } from '../functions/emails.js';
import Product, { validateBody } from '../dataBase/product.js';
import User from '../dataBase/user.js';

const route = express.Router();

route.post('/', async (req, res) => {
    //1 validation checking if user is verified
    if (!req.user.veryfied)
        return res.status(403).send("Your account has to be veryfied to be able to sell products.");
    const { error, value } = validateBody(req.body);
    //2 validation checking if req.body syntax and value range is correct
    if (error)
        return res.status(400).send(error.message);
    //Creating product
    const product = new Product(value);
    product.seller = req.user._id;
    await product.save();
    sendProdPostEmail(req.user.email, `${req.user.name} ${req.user.surname}`, product);
    //attaching product to active offers of an user
    await User.findByIdAndUpdate(req.user._id, { $push: { activeProducts: product._id } });
    return res.status(201).send("Product succesfully exposed.");
})

route.delete('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    //const deletedProduct = await Product.findByIdAndRemove(req.params.id, { select: "-__v" });
    //1 validation checking if product exists
    if (product) {
        //2 validation checking if product isnt finalazed
        if (product.finalized)
            return res.status(405).send("You can't change products that have been sold.");
        //deleting product and updating users active products
        sendProdDelEmail(req.user.email, `${req.user.name} ${req.user.surname}`, product);
        await product.remove();
        await User.findByIdAndUpdate(req.user._id, { $pull: { activeProducts: deletedProduct._id } });
        return res.send(product);
    }
    else
        return res.status(404).send("Product not found, therefore it could not be deleted.");
})

route.put('/:id', async (req, res) => {
    const { error, value } = validateBody(req.body);
    //1 validation checking if req.body syntax and value range is correct
    if (error)
        return res.status(400).send(error.message);
    //2 validation checking if product exists
    const product = await Product.findById(req.params.id);
    if (product) {
        //3 validation checking if product isnt finalazed
        if (product.finalized)
            return res.status(405).send("You can't change products that have been sold.");
        //Updating product
        product.name = value.name;
        product.description = value.description;
        product.price = value.price;
        await product.save();
        sendProdPutEmail(req.user.email, `${req.user.name} ${req.user.surname}`, product);
        return res.send(product);
    }
    else
        return res.status(404).send("Product not found, therefore it could not be updated.");
})

export default route;