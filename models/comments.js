const db = require('../db/connection.js')
const { checkReviewExists } = require('../utils.js')

//6 GET api/reviews/:review_id/comments
exports.selectReviewComments = (id) => {
    return checkReviewExists(id)
        .then(() => {
            return db.query(
                `
                SELECT comment_id,
                votes,
                created_at,
                author,
                body,
                review_id
                FROM comments
                WHERE review_id=$1
                ORDER BY created_at DESC;
                `, [id]
            )
        })
        .then((comments) => {
            return comments.rows
    })
}