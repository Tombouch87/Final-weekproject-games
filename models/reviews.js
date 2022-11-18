const db = require('../db/connection.js')
const { checkCategoryExists } = require('../utils.js')

//4 & 11 GET api/reviews
exports.selectReviews = (sort_by = 'created_at', order = 'DESC', category) => {
    const validOrder = ['ASC', 'DESC']
    const validColumnsSort = ['owner','title','review_id','category','created_at','votes','designer','comment_count']
    
    if (!validColumnsSort.includes(sort_by) || !validOrder.includes(order)) {
        return Promise.reject({status: 400, msg: 'invalid sort query'})
    }
    let queryStr = `
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
    `
    const queryValues = []

    if (category) {
        queryStr += ` WHERE reviews.category = $1`
        queryValues.push(category)
    }
    queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`

    return checkCategoryExists(category)
    .then(() => {
        return db.query(queryStr, queryValues)
    .then((reviews) => {
        return reviews.rows
    })
    })
}

//5 & 10 GET api/reviews/:review_id
exports.selectReviewById = (id) => {
    return db.query(
        `
        SELECT reviews.review_id,
        reviews.title,
        reviews.review_body,
        reviews.designer,
        reviews.review_img_url,
        reviews.votes,
        reviews.category,
        reviews.owner,
        reviews.created_at,
        COUNT(comments.comment_id) AS comment_count FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id=$1
        GROUP BY reviews.review_id;
        `, [id]
    ).then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'review not found'})
        }
        return review.rows[0]
    })
}

//8 PATCH api/reviews/review_id
exports.updateReview = (id, inc) => {
    return db.query(
        `
        UPDATE reviews
        SET votes = votes + $2
        WHERE review_id=$1
        RETURNING *;
        `, [id, inc]
    ).then((review) => {
        if (!review.rows[0]){
            return Promise.reject({status: 404, msg: 'review not found'}) 
        }
        console.log(review.rows[0])
        return review.rows[0]
    })
}