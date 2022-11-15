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

//5 GET api/reviews/:review_id
exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.review_id).then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
}