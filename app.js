const express = require('express')
const { getCategories } = require('./controllers/categories.js')
const { getReviews, getReviewById, patchReview } = require('./controllers/reviews.js')
const { getReviewComments, postComment, deleteComment } = require('./controllers/comments.js')
const { getUsers } = require('./controllers/users.js')
const { getApi, seedDb } = require('./controllers/api.js')

const app = express()

app.use(express.json())

//13 GET api
app.get('/api', getApi)

app.get('/api/seed', seedDb)

//3 GET api/categories
app.get('/api/categories', getCategories)

//4 GET api/reviews
app.get('/api/reviews', getReviews)

//5 GET api/review/:review_id
app.get('/api/reviews/:review_id', getReviewById)

//6 GET api/review/:review_id/comments
app.get('/api/reviews/:review_id/comments', getReviewComments)

//7 POST api/review/:review_id/comments
app.post('/api/reviews/:review_id/comments', postComment)

//8 PATCH api/review/review_id
app.patch('/api/reviews/:review_id', patchReview)

//9 GET api/users
app.get('/api/users', getUsers)

//12 DELETE api/comments/:comment_id
app.delete('/api/comments/:comment_id', deleteComment)


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
        res.status(400).send({msg: 'bad request, must be a number'})
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === "23503") {
        res.status(400).send({msg: 'bad request, author does not exist'})
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({msg: 'bad request, incorrectly formatted comment'})
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