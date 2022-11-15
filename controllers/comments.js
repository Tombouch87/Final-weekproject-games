const { selectReviewComments } = require('../models/comments.js')

//6 GET api/reviews/:review_id/comments
exports.getReviewComments = (req, res, next) => {
    selectReviewComments(req.params.review_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}