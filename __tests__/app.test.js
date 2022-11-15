const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')

// console.log(categoryData)
beforeEach(() => seed(testData))
afterAll(() => {
    return db.end()
})

//GET api/categories
describe.only('GET /api/categories', () => {
    test('status:200, responds with an array of category objects', () => {
        console.log('hello2')
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                const { categories } = body
                categories.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })

        })
    })
})