const db = require('./db/connection')

exports.checkReviewExists = (review_id) => {
    return db.query(
        `
        SELECT * FROM reviews
        WHERE review_id = $1
        `, [review_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'review not found'})
        }
    })
}

exports.checkCategoryExists = (category) => {
    return db.query(
        `
        SELECT * FROM categories
        WHERE slug = $1
        `, [category]
    )
    .then((result) => {
        if (result.rows.length === 0 && category) {
            return Promise.reject({status: 404, msg: 'category not found'})
        }
    })
}