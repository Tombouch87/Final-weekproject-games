const { selectReviewComments, addComment, removeComment } = require('../models/comments.js')

//6 GET api/reviews/:review_id/comments
exports.getReviewComments = (req, res, next) => {
    selectReviewComments(req.params.review_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

//7 POST api/reviews/:review_id/comments
exports.postComment = (req, res, next) => {
    addComment(req.body, req.params.review_id)
        .then((comment) => {
            res.status(201).send({comment})
        })
        .catch((err) => {
            next(err)
        })
}

//12 DELETE ApI/comments/:comment_id
exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id)
        .then((comment) => {
            res.status(204).end()
        })
        .catch((err) => {
            next(err)
        })
}