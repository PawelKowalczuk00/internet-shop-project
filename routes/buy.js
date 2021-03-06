import express from 'express';
import joi from '@hapi/joi';

import { sendBought, sendSold } from '../functions/emails.js';
import Product from '../dataBase/product.js';
import User from '../dataBase/user.js';
import Transaction from '../dataBase/transaction.js'

const route = express.Router();

route.get('/:id', async (req, res) => {
    //1 validation checking if product exists
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product && !product.finalized) {
        const buyer = await User.findById(req.user._id);
        //2 validation checking if buyer is verified
        if (!buyer.veryfied)
            return res.status(403).send("Your account has to be veryfied to be able to buy products.");
        const seller = await User.findById(product.seller);
        //3 validation checking if buyer isnt the seller
        if (buyer.equals(seller))
            return res.status(403).send("You can't buy your own products");
        //4 validation checking if buyer has enough money
        if (buyer.saldo < product.price)
            return res.status(402).send("You don't have enough money.");
        /*buying: 
        1) TRANSACTION: creating transaction
        2) PRODUCT: finalized set to true and add transaction id
        3) SELLER: remove product from active products and add transaction id to transactionHistory, add money
        4) BUYER: add transaction id to transactionHistory, take money
        */
        // 1) ----------------------------
        const transaction = new Transaction({
            product: productId,
            seller: seller._id,
            buyer: buyer._id
        });
        await transaction.save();
        // 2) ----------------------------
        product.finalized = true;
        product.transaction = transaction._id;
        await product.save();
        // 3) ----------------------------
        seller.saldo += product.price;
        await User.findByIdAndUpdate(seller._id, { $pull: { activeProducts: product._id } });
        seller.transactionHistory.push(transaction._id);
        await seller.save();
        sendSold(seller.email, `${seller.name} ${seller.surname}`, product);
        // 4) ----------------------------
        buyer.saldo -= product.price;
        buyer.transactionHistory.push(transaction._id);
        await buyer.save();
        sendBought(buyer.email, `${buyer.name} ${buyer.surname}`, product);
        //---------------------------------
        return res.send({ transaction, product });
    }
    else
        return res.status(404).send("Product not found, therefore it could not be bought.");
});

export default route;