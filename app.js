// Includes
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {queryParser, checkPaging, createProductJSON} = require('./util')


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
})

const Product = mongoose.model('products', ProductsSchema)


// Middleware
app.use(express.json())


// Routes
app.get('/api/products', (req, res, next) => {
    const {name, price, left} = queryParser(req.query)
    const options = checkPaging(req.query.elemOnPage, req.query.page)
    Product.find({name: name, price: price, left: left}, null, options).exec()
        .then(products => {
            for (let i = 0; i < products.length; i++) {
                products[i] = createProductJSON(products[i])
            }
            res.status(200).json({
                message: `${products.length} products were recieved`,
                data: products
            })
        })
        .catch(reason => {
            next(reason)
        })
})

app.get('/api/products/:name', (req, res, next) => {
    Product.findOne({name: req.params.name}).exec()
        .then(product => {
            if (product === null) res.status(404).json({
                message: 'Product wasn\'t recieved',
                data: {}
            })
            else res.status(200).json({
                message: 'Product was recieved successfully',
                data: createProductJSON(product)
            })
        })
        .catch(reason => {
            next(reason)
        })
})

app.post('/api/products', (req, res, next) => {
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
    product.save()
        .then(savedProduct => {
            res.status(201).json({
                message: `Product ${savedProduct.name} created successfully`,
                data: createProductJSON(savedProduct)
            })
        })
        .catch(reason => {
            next(reason)
        })
})

app.delete('/api/products/:name', (req, res, next) => {
    Product.findOneAndDelete({name: req.params.name}).exec()
        .then(product => {
            res.status(200).json({
                message: 'Product deleted',
                data: createProductJSON(product)
            })
        })
        .catch(reason => {
            next(reason)
        })
})

app.put('/api/products/:name', (req, res, next) => {
    const productToUpdate = new Product({
        name: req.body.name,
        price: req.body.price,
        left: req.body.left
    })
    const validationError = productToUpdate.validateSync(Object.keys(req.body))
    if (validationError) {
        return next(validationError)
    }
    Product.findOneAndUpdate({name: req.params.name}, req.body).exec()
        .then(product => {
            res.status(200).json({
                message: `${product.name} updated`,
                data: {
                    name: productToUpdate.name ?? product.name,
                    price: productToUpdate.price ?? product.price,
                    left: productToUpdate.left ?? product.left
                }
            })
        })
        .catch(reason => {
            next(reason)
        })
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