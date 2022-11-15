const db = require('../db/connection.js')

//GET api/categories
exports.selectCategories = () => {
    return db.query(
        'SELECT * FROM categories;'
    ).then((categories) => {
        console.log(categories)
        return categories.rows
    })
}