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


//5 GET api/reviews/:review_id
describe('GET /api/reviews/:review_id', () => {
    test('status:200, responds with review object', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                    expect(review).toEqual({
                        review_id: 2,
                        title: expect.any(String),
                        review_body: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: expect.any(String),
                        owner: expect.any(String),
                        created_at: expect.any(String)
                    })
        })
    })
    test('status 404: valid but non-existent review_id', () => {
        return request(app)
            .get('/api/reviews/1000')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('review not found')
            })
    })
    test('status 400: non_valid review_id', () => {
        return request(app)
            .get('/api/reviews/nonvalid')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('bad request, review_id must be a number')
            })
    })
})

//6 GET api/reviews/:review_id/comments
describe.only('GET /api/reviews/:review_id/comments', () => {
    test('status:200, responds with aray of review comments', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            review_id: 2,
                        })
                    )
                })
        })
    })
    test('status 200: ordered by created_at', () => {
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({body}) =>  {
            expect(body.comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('status 200: empty array when review has no comments', () => {
        return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([])
            })
    })
    test('status 404: valid but non-existent review_id', () => {
        return request(app)
            .get('/api/reviews/1000/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('review not found')
            })
    })
    test('status 400: non_valid review_id', () => {
        return request(app)
            .get('/api/reviews/nonvalid/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('bad request, review_id must be a number')
            })
    })
})