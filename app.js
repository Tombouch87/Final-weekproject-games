const express = require('express')
const { getCategories } = require('./controllers/categories.js')
const { getReviews, getReviewById } = require('./controllers/reviews.js')

const app = express()

//3 GET api/categories
app.get('/api/categories', getCategories)

//4 GET api/reviews
app.get('/api/reviews', getReviews)

//5 GET api/review/:review_id
app.get('/api/reviews/:review_id', getReviewById)


app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Route not found'})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({msg: 'bad request, review_id must be a number'})
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(500)
})

module.exports = app