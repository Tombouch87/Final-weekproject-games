const { selectReviews, selectReviewById, updateReview } = require('../models/reviews.js')

//4 GET api/reviews
exports.getReviews = (req, res, next) => {
    selectReviews().then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    })
}

//5 & 10 GET api/reviews/:review_id
exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.review_id).then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
}

//8 PATCH api/reviews/:review_id
exports.patchReview = (req, res, next) => {
    if (Object.keys(req.body).length!==1 || !req.body.inc_votes){
        next({status:400, msg: "update formatted incorrectly"})
    }
    else{
        updateReview(req.params.review_id, req.body.inc_votes).then((review) => {
            res.status(200).send({review})
        })
        .catch((err) => {
            next(err)
        })
    }
}