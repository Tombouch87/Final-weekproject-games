const db = require('../db/connection.js')

//4 GET api/reviews
exports.selectUsers = () => {
    return db.query(
        `
        SELECT username,
        name,
        avatar_url
        FROM users
        `
    ).then((users) => {
        return users.rows
    })
}