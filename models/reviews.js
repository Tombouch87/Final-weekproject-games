const db = require('../db/connection.js')

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
