import mongoose from 'mongoose';
import joi from '@hapi/joi';

const productSchema = new mongoose.Schema({
    name: {
        type: [String],
        minlength: 2,
        maxlength: 60,
        required: true
    },
    description: {
        type: [String],
        maxlength: 1000,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        max: 999999,
        required: true
    },
    imgUrl: String,
    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
        required: true
    },
    exposeDate: {
        type: Date,
        default: Date.now()
    },
    transaction: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "transactions"
    },
    finalized: {
        type: Boolean,
        default: false
    }
});

export const validateBody = (body) => {
    const schema = joi.object({
        name: joi.string().min(2).max(60),
        description: joi.string().allow('').max(1000),
        price: joi.number().min(0.01).max(999999).required(),
        picture: joi.allow(),
        imgUrl: joi.forbidden(),
        seller: joi.forbidden(),
        exposeDate: joi.forbidden(),
        transaction: joi.forbidden(),
        finalized: joi.forbidden()

    });
    return schema.validate(body)
}

const Product = mongoose.model('products', productSchema);

export default Product;
