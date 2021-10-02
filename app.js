// Includes
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {queryParser, checkPaging} = require('./util')
const axios = require('axios')

// Constants
const HOST = "127.0.0.1"
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
        min: 0,
        default: 0
    }
})

const Product = mongoose.model('products', ProductsSchema)

// Middleware
app.use(express.json())


// Routes
app.get('/api/products', (req, res) => {
    const {name, price, left} = queryParser(req.query)
    const options = checkPaging(req.query.elemOnPage, req.query.page)
    Product.find({name: name, price: price, left: left}, null, options, (err, products) => {
        if (err) return res.status(404).json({})
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
        if (err || !product) return res.status(404).json({})
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
            message: 'Product didn\'t created',
            ok: false
        })
    }
    product.save((err, data) => {
        if (err) return res.status(400).json({
            message: 'Product didn\'t created',
            ok: false
        })
        res.status(201).json({
            message: `Product ${data.name} created successfully`,
            ok: true
        })
    })
})

app.delete('/api/products/:name', (req, res) => {
    Product.findOneAndDelete({name: req.params.name}, (err, product) => {
        if (err || !product) return res.status(404).json({
            message: 'Product not found',
            ok: false
        })
        res.status(200).json({
            message: 'Product deleted',
            ok: true
        })
    })
})

app.delete('/api/products', (req, res) => {
    const {name, price, left} = queryParser(req.query)
    Product.deleteMany({name: name, price: price, left: left}, (err, products) => {
        if (err || !products.deletedCount) return res.status(404).json({
            message: 'Products not found',
            ok: false
        })
        res.status(200).json({
            message: `${products.deletedCount} products deleted`,
            ok: true
        })
    })
})

app.put('/api/products/:name', (req, res) => {
    Product.findOneAndUpdate({name: req.params.name}, req.body, (err, product) => {
        if (err || !product) return res.status(404).json({
            message: 'Product didn\'t update',
            ok: false
        })
        res.status(200).json({
            message: `${product.name} updated`,
            ok: true
        })
    })
})

app.put('/api/products', (req, res) => {
    const {name, price, left} = queryParser(req.query)
    Product.updateMany({name: name, price: price, left: left}, req.body, (err, products) => {
        if (err || !products.matchedCount) return res.status(404).json({
            message: 'Products didn\'t update',
            ok: false
        })
        res.status(200).json({
            message: `${products.matchedCount} products updated`,
            ok: true
        })
    })
})


// Server start
app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))