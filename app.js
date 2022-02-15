// Includes
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {queryParser, checkPaging, createProductJSON} = require('./util')
const Product = require("./schemas/Product")


// Constants
const PORT = 3000


// DB
mongoose.connect('mongodb://localhost:27017/base')

// Middleware
app.use(express.json())


// Routes
app.get('/api/products', async (req, res, next) => {
    const {name, price, left} = queryParser(req.query)
    const options = checkPaging(req.query.elemOnPage, req.query.page)
    try {
        const products = await Product.find({name, price, left}, null, options)
        for (let i = 0; i < products.length; i++) {
            products[i] = createProductJSON(products[i])
        }
        res.status(200).json({
            message: `${products.length} products were recieved`,
            data: products
        })
    } catch (e) {
        next(e);
    }
})

app.get('/api/products/:name', async (req, res, next) => {
    try {
        const product = await Product.findOne({name: req.params.name});
        if (!product) {
            res.status(404).json({
                message: 'Product wasn\'t recieved',
                data: {}
            })
        } else {
            res.status(200).json({
                message: 'Product was recieved successfully',
                data: createProductJSON(product)
            })
        }
    } catch (e) {
        next(e);
    }
})

app.post('/api/products', async (req, res, next) => {
    const { name, price, left } = req.body
    const product = new Product({
        name: name,
        price: price,
        left: left
    })
    const validationError = product.validateSync()
    if (validationError) {
        return next(validationError)
    }
    try {
        await product.save();
        res.status(201).json({
            message: `Product ${product.name} created successfully`,
            data: createProductJSON(product)
        })
    } catch (e) {
        next(e)
    }
})

app.delete('/api/products/:name', async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({name: req.params.name});
        res.status(200).json({
            message: 'Product deleted',
            data: createProductJSON(product)
        })
    } catch (e) {
        next(e);
    }
})

app.put('/api/products/:name', async (req, res, next) => {
    const productToUpdate = new Product({
        name: req.body.name,
        price: req.body.price,
        left: req.body.left
    })
    const validationError = productToUpdate.validateSync(Object.keys(req.body));
    if (validationError) {
        return next(validationError)
    }
    try {
        const product = await Product.findOneAndUpdate({name: req.params.name}, req.body);
        res.status(200).json({
            message: `${product.name} updated`,
            data: {
                name: productToUpdate.name ?? product.name,
                price: productToUpdate.price ?? product.price,
                left: productToUpdate.left ?? product.left
            }
        })
    } catch (e) {
        next(e);
    }
})

app.use('/api/products', (err, req, res, next) => {
    let status = 500
    let message = err.message
    switch (err.name) {
        case 'TypeError':
            status = 404
            message = 'Product not found'
            break
        case 'MongoServerError':
            status = 409
            message = 'Product with this name already exists'
            break
        case 'ValidationError':
            status = 409
            message = 'Product didn\'t created/updated. Validation failed'
    }
    res.status(status).json({
        message: message
    })
})


// Server start
app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))