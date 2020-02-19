import express from 'express';
import fs from 'fs';

import upload from '../functions/multer.js';
import { sendProdPostEmail, sendProdPutEmail, sendProdDelEmail } from '../functions/emails.js';
import Product, { validateBody } from '../dataBase/product.js';
import User from '../dataBase/user.js';

const route = express.Router();

route.post('/', upload.single('picture'), async (req, res) => {
    //1 validation checking if user is verified
    const user = await User.findById(req.user._id).select('veryfied');
    if (!user.veryfied)
        return res.status(403).send("Your account has to be veryfied to be able to sell products.");
    const { error, value } = validateBody(req.body);
    //2 validation checking if req.body syntax and value range are correct
    if (error)
        return res.status(400).send(error.message);
    //Creating product
    let imgPath = "";
    if (req.file)
        imgPath = req.file.filename;
    const product = new Product({
        name: value.name.toLowerCase().split(" "),
        description: value.description.toLowerCase().split(" "),
        price: Number(value.price),
        seller: user._id,
        imgUrl: imgPath
    });
    await product.save();
    sendProdPostEmail(req.user.email, `${req.user.name} ${req.user.surname}`, product);
    //attaching product to active offers of an user
    await User.findByIdAndUpdate(req.user._id, { $push: { activeProducts: product._id } });
    return res.status(201).send(product._id);
})

route.delete('/delete/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    //1 validation checking if product exists
    if (product) {
        //2 validation checking if product isnt finalazed
        if (product.finalized)
            return res.status(405).send("You can't change products that have been sold.");
        //3 validation checking if product's seller is the person who requested delete'
        if (product.seller._id + " " !== req.user._id + " ")
            return res.status(405).send("You can't change products you don't own.");
        //deleting product and updating users active products
        await User.findByIdAndUpdate(req.user._id, { $pull: { activeProducts: product._id } });
        await product.remove();
        fs.unlink(`client/build/prodImg/${product.imgUrl}`, err => {
            console.log('Unlinking process:', err);
        })
        sendProdDelEmail(req.user.email, `${req.user.name} ${req.user.surname}`, product);
        return res.send(product);
    }
    else
        return res.status(404).send("Product not found, therefore it could not be deleted.");
})

route.put('/edit/:id', upload.single('picture'), async (req, res) => {
    const { error, value } = validateBody(req.body);
    //1 validation checking if req.body syntax and value range is correct
    if (error)
        return res.status(400).send(error.message);
    //2 validation checking if product exists
    const product = await Product.findById(req.params.id).populate("seller");
    if (product) {
        //3 validation checking if product isnt finalazed
        if (product.finalized)
            return res.status(405).send("You can't change products that have been sold.");
        //4 validation checking if product's seller is the person who requested edit'
        if (product.seller._id + " " !== req.user._id + " ")
            return res.status(405).send("You can't change products you don't own.");
        //Updating product
        product.name = value.name;
        product.description = value.description;
        product.price = value.price;
        if (req.file)
            fs.unlink(`client/build/prodImg/${product.imgUrl}`, err => {
                console.log('Picture updating process:', err);
                let imgPath = "";
                imgPath = req.file.filename;
                product.imgUrl = imgPath;
            });
        await product.save();
        sendProdPutEmail(req.user.email, `${req.user.name} ${req.user.surname}`, product);
        return res.send(product);
    }
    else
        return res.status(404).send("Product not found, therefore it could not be updated.");
})

export default route;