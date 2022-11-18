//4 GET api/reviews
exports.selectReviews = () => {
    return db.query(
        `
        SELECT reviews.owner,
        reviews.title,
        reviews.review_id,
        reviews.category,
        reviews.review_img_url,
        reviews.created_at,
        reviews.votes,
        reviews.designer,
        COUNT(comments.comment_id) AS comment_count FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC
        `
    ).then((reviews) => {
        return reviews.rows
    })
}

//4 GET api/reviews
exports.getReviews = (req, res, next) => {
    selectReviews().then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    })
}

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

