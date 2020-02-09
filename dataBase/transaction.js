import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "products",
        required: true
    },
    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
        required: true
    },
    buyer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Transaction = mongoose.model('transactions', transactionSchema);

export default Transaction;
