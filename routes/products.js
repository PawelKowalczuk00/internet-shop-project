import express from 'express';
import joi from '@hapi/joi';

import Product from '../dataBase/product.js';

const route = express.Router();

route.post('/', async (req, res) => {  
    const { value } = validateFilters(req.body);
    const minPrice = value.minPrice || 0;
    const maxPrice = value.maxPrice || 999999;
    let page = req.query.page || 0;
    page = Number(page);
    let range = req.query.range || 9;
    range = Number(range);
    const sort = req.query.sort || "name";
    const order = req.query.order || ""; //""=>asc, "-"=>desc
    let { keywords } = value;
    let productsList, howMany;
    if (keywords) {
        keywords = keywords.trim().toLowerCase().split(" ")
        productsList = await Product
            .find({ finalized: false, price: { $gte: minPrice, $lte: maxPrice } })
            .or([{ name: { $in: keywords } }, { description: { $in: keywords } }])
            .skip(page * range)
            .limit(range)
            .select("name description price imgUrl _id")
            .sort(order + sort);
        howMany = await Product
            .find({ finalized: false, price: { $gte: minPrice, $lte: maxPrice } })
            .or([{ name: { $in: keywords } }, { description: { $in: keywords } }])
            .countDocuments();
    }
    else {
        productsList = await Product
            .find({ finalized: false, price: { $gte: minPrice, $lte: maxPrice } })
            .skip(page * range)
            .limit(range)
            .select("name description price imgUrl _id")
            .sort(order + sort);
        howMany = await Product
            .find({ finalized: false, price: { $gte: minPrice, $lte: maxPrice } })
            .countDocuments();
    }
    res.send({ productsList, howMany });
})

route.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    .populate('seller', 'email -_id')
    .populate('transaction')
    .select("-__v");
    if (product)
        return res.send(product);
    else
        return res.send("Product not found.")
})

const validateFilters = (filters) => {
    const schema = joi.object({
        minPrice: joi.number().min(0).max(999999),
        maxPrice: joi.number().min(0).max(999999),
        keywords: joi.string()
    });
    return schema.validate(filters);
}

export default route;