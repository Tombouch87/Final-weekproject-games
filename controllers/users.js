const { selectUsers } = require('../models/users.js')

//9 GET api/users
exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}