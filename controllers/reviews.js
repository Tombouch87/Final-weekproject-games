const { selectReviews, selectReviewById } = require('../models/reviews.js')

//4 GET api/reviews
exports.getReviews = (req, res, next) => {
    selectReviews().then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    })
}