const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductsSchema = new Schema({
    id: Schema.ObjectId,
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        minlength: 2
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    left: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('products', ProductsSchema);