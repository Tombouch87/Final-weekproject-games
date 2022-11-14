const { selectCategories } = require('../models/categories.js')

//GET api/categories
exports.getCategories = (req, res, next) => {
    selectCategories().then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err)
    })
}