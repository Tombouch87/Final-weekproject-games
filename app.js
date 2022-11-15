const express = require('express')
const { getCategories } = require('./controllers/categories.js')
const { getReviews } = require('./controllers/reviews.js')

const app = express()

//3 GET api/categories
app.get('/api/categories', getCategories)

//4 GET api/reviews
app.get('/api/reviews', getReviews)


app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Route not found'})
})

app.use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(500)
})

module.exports = app