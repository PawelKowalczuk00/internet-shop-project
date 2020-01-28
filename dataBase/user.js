import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import joi from '@hapi/joi';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 25,
        required: true
    },
    surname: {
        type: String,
        minlength: 2,
        maxlength: 40,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 40,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true    
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    transactionHistory: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "transactions",
    },
    activeProducts: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "products",
    },
    logHistory: {
        type: [Date],
        default: [Date.now()]
    },
    saldo: {
        type: Number,
        default: 0
    },
    registerDate: {
        type: Date,
        default: Date.now()
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    veryfied: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this.id,
        surname: this.surname,
        name: this.name,
        email: this.email,
        veryfied: this.veryfied
    }, global.jwtKey, {
        expiresIn: '3d'
    })
};

export const validateBody = (body) => {
    const schema =  joi.object({
            name: joi.string().min(2).max(25).required(),
            surname: joi.string().min(2).max(40).required(),
            email: joi.string().min(5).max(40).required().email(),
            hash: joi.string().min(8).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/), // one lower, one upper, one digit
            gender: joi.string().required().valid('Male', 'Female', 'Other'),
            logHistory: joi.forbidden(),
            saldo: joi.forbidden(),
            registerDate: joi.forbidden(),
            isAdmin: joi.forbidden(),
            veryfied: joi.forbidden()
    });
    return schema.validate(body)
};

const User = mongoose.model('users', userSchema);

export default User;
