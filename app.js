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
    id: Schema.ObjectId,
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
        if (err) return res.status(404).json({
            message: 'Not found'
        })
        products.map((value, index) => {
            products[index] = {
                name: value.name,
                price: value.price,
                left: value.left
            }
        })
        res.status(200).json(products)
    })
})

app.get('/api/products/:name', (req, res) => {
    Product.findOne({name: req.params.name}, (err, product) => {
        if (err || !product) return res.status(404).json({
            message: 'Not found'
        })
        res.status(200).json({
            name: product.name,
            price: product.price,
            left: product.left
        })
    })
})

app.post('/api/products', (req, res) => {
    const { name, price, left } = req.body
    const product = new Product({
        name: name,
        price: price,
        left: left
    })
    if (product.validateSync() instanceof mongoose.Error) {
        return res.status(400).json({
            message: 'Product didn\'t created'
        })
    }
    product.save((err, data) => {
        if (err) return res.status(400).json({
            message: 'Product didn\'t created'
        })
        res.status(201).json({
            message: `${data.name} created successfully`
        })
    })
})

// Server start
app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))