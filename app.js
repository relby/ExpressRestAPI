const express = require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = 3000

mongoose.connect('mongodb://localhost:27017/base')

const Schema = mongoose.Schema
const ProductsSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2
    },
    price: Number,
    left: {
        type: Number,
        default: 0
    }
})

const Product = mongoose.model('products', ProductsSchema)


app.get('/', (req, res) => {
    res.send("test")
})


app.listen(PORT, () => console.log(`Server has been started on http://localhost:${PORT}`))