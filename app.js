// Includes
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Constants
const PORT = 3000

// DB
mongoose.connect('mongodb://localhost:27017/base')

const Schema = mongoose.Schema
const ProductsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        minlength: 2
    },
    price: Number,
    left: {
        type: Number,
        default: 0
    }
})

const Product = mongoose.model('products', ProductsSchema)

// Middleware
app.use(express.json())

// Routes
app.get('/api/products', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return console.error(err);
        products.map((value, index) => {
            products[index] = {
                name: value.name,
                price: value.price,
                left: value.left,
            }
        })
        res.status(200).json(products)
    })
})

// Server start
app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))