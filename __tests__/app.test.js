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
describe('3 GET /api/noosense', () => {
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
describe('3 GET /api/categories', () => {
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
describe('4 GET /api/reviews', () => {
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
describe('5 GET /api/reviews/:review_id', () => {
    test('status:200, responds with review object', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                    expect(review).toMatchObject({
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
                expect(body.msg).toBe('bad request, must be a number')
            })
    })
})

//6 GET api/reviews/:review_id/comments
describe('6 GET /api/reviews/:review_id/comments', () => {
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
                expect(body.msg).toBe('bad request, must be a number')
            })
    })
})

//7 POST api/reviews/:review_id/comments
describe('7 POST /api/reviews/:review_id/comments', () => {
    test('status:201, added comment', () => {
        const newComment = {
            author: 'mallionaire',
            body: 'not sure what this is'
        }
        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body
                expect(comment).toEqual({
                        comment_id: expect.any(Number),
                        review_id: 1,
                        created_at: expect.any(String),
                        votes: 0,
                        ...newComment    
            })
        })
    })
    test('status:404, review_id is valid but non existent', () => {
        const newComment = {
            author: 'mallionaire',
            body: 'not sure what this is'
        }
        return request(app)
            .post('/api/reviews/1000/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual('review not found')
        })
    })
    test('status:400, review_id is not valid', () => {
        const newComment = {
            author: 'mallionaire',
            body: 'not sure what this is'
        }
        return request(app)
            .post('/api/reviews/notid/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request, must be a number')
        })
    })
    test('status:400, author not a valid user', () => {
        const newComment = {
            author: 'me',
            body: 'not sure what this is'
        }
        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request, author does not exist')
        })
    })
    test('status:400, request body not formatted correctly', () => {
        const newComment = {
            body: 'not sure what this is'
        }
        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('bad request, incorrectly formatted comment')
        })
    })
})

//8 PATCH api/reviews/:review_id
describe('8 PATCH /api/reviews/:review_id', () => {
    test('status:200, increase votes by inc_votes', () => {
        const reviewPatch = {
            inc_votes: 1
        }
        return request(app)
            .patch('/api/reviews/1')
            .send(reviewPatch)
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                expect(review).toEqual({
                    review_id: 1,
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: 2,
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                })
        })
    })
    test('status:200, decreases votes but inc_votes', () => {
        const reviewPatch = {
            inc_votes: -1
        }
        return request(app)
            .patch('/api/reviews/1')
            .send(reviewPatch)
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                expect(review).toEqual({
                    review_id: 1,
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: 0,
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                })
        })
    })
    test("status 404: returns error if review_id is valid but non-existent", () => {
        return request(app)
          .patch("/api/reviews/1000")
          .send({ inc_votes: 3 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("review not found")
        })
    })
    test("status 400: returns error message if review_id is not a number", () => {
        return request(app)
        .patch("/api/reviews/nonvalid")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request, must be a number')
        })
    })
    test("status 400: returns error if not in correct format", () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 3, other: "thing" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('update formatted incorrectly')
        })
    })
      test("status 400: returns error if inc_votes is not a number", () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "hello" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request, must be a number')
        })
      })
})

//9 GET api/users
describe('GET /api/users', () => {
    test('status:200, responds with an array of user objects', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                const { users } = body
                users.forEach((user) => {
                    expect(user).toEqual({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })

        })
    })
})

//10 GET api/reviews/:review_id
describe('GET /api/reviews/:review_id', () => {
    test('status:200, responds with review object', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                    expect(review).toMatchObject({
                        review_id: 2,
                        title: 'Jenga',
                        review_body: 'Fiddly fun for all the family',
                        designer: 'Leslie Scott',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        votes: 5,
                        category: 'dexterity',
                        owner: 'philippaclaire9',
                        created_at: expect.any(String),
                        comment_count: expect.any(String)
                    })
        })
    })
})

//11 GET api/reviews/<query>
describe('GET /api/reviews/?category=<category>', () => {
    test('status:200, responds with reviews by category', () => {
        return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body
                reviews.forEach((review) => {
                    expect(review).toEqual({
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
                })
            })
    })
    test('status:200, responds with reviews by category', () => {
        return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body
                reviews.forEach((review) => {
                    expect(review.category).toBe('dexterity')
                })
            })
    })
    test('status:200, responds with empty array if category exist but no reviews', () => {
        return request(app)
            .get(`/api/reviews?category=children's games`)
            .expect(200)
            .then(({body}) => {
                const { reviews } = body
                expect(reviews).toEqual([])
            })
    })
    test('status:404, responds with error', () => {
        return request(app)
            .get('/api/reviews?category=notACategory')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('category not found')
            })
    })
    test('status:200, responds with reviews in correct format', () => {
        return request(app)
            .get('/api/reviews?sort_by=owner')
            .expect(200)
            .then(({body}) => {
                const { reviews } = body
                reviews.forEach((review) => {
                    expect(review).toEqual({
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
                })
            })
    })
    test('status:200, responds with reviews sorted', () => {
        return request(app)
            .get('/api/reviews?sort_by=owner')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toBeSortedBy('owner', {descending: true})
            })
    })
    test('status:400, responds error for invalid sort', () => {
        return request(app)
            .get('/api/reviews?sort_by=bad')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('invalid sort query')
            })
    })
    test('status:200, responds with reviews sorted', () => {
        return request(app)
            .get('/api/reviews?sort_by=votes&&order=ASC')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toBeSortedBy('votes', {descending: false})
            })
    })
    test('status:400, responds with error for invalid sort', () => {
        return request(app)
            .get('/api/reviews?sort_by=votes&&order=BAD')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('invalid sort query')
            })
    })
})

//12 DELETE api/comments/:comment_id
describe('DELETE api/comments/:comment_id', () => {
    test('status:204, no response', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204)
    })
    test('status:404, valid but non-existent comment_id', () => {
        return request(app)
            .delete('/api/comments/1000')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('comment not found')
            })
    })
    test('status:400, non_valid comment_id', () => {
        return request(app)
            .delete('/api/comments/notNumber')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('bad request, must be a number')
            })
    })
})