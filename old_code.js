//5 GET api/reviews/:review_id controller
exports.getReviewById = (req, res, next) => {
    selectReviewById(req.params.review_id).then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
}


//5 GET api/reviews/:review_id
exports.selectReviewById = (id) => {
    return db.query(
        `
        SELECT review_id,
        title,
        review_body,
        designer,
        review_img_url,
        votes,
        category,
        owner,
        created_at
        FROM reviews
        WHERE review_id=$1;
        `, [id]
    ).then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'review not found'})
        }
        return review.rows[0]
    })
}

