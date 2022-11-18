const endpoints = require('../endpoints.json')

exports.getApi = (req, res, next) => {
    res.status(200).send({endpoints})
}

exports.seedDb = (req, res, next) => {
    require('../db/seeds/run-seed.js')
    res.status(200).send({msg: 'Successfully seeded'})
}