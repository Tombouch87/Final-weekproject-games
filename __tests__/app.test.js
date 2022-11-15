const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')

beforeEach(() => seed(testData))

afterAll(() => {
    return db.end()
})

//3 GET api/nonsense
describe('GET /api/noosense', () => {
    test('status:404, responds with an array of category objects', () => {
        return request(app)
            .get('/api/nonsense')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Route not found')
            })
    })
})

//3 GET api/categories
describe('GET /api/categories', () => {
    test('status:200, responds with an array of category objects', () => {
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

//4 GET api/reviews
describe('GET /api/reviews', () => {
    test('status:200, responds with an array of review objects', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(String)
                        })
                    )
                })

        })
    })
    test('status 200: ordered by date, descending', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) =>  {
            expect(body.reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
})