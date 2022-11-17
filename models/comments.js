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

//7 POST api/reviews/:review_id/comments
exports.addComment = (comment, review_id) =>   {
    return checkReviewExists(review_id)
        .then(() => {
            return db.query(
                `
                INSERT INTO comments 
                (review_id, author, body)
                VALUES ($1, $2, $3)
                RETURNING *;
                `, [review_id, comment.author, comment.body]
            )
                })
            .then((response) => {
                 return response.rows[0]
            })
}

//8