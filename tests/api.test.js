const supertest = require("supertest")
const {app, server} = require("../index")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")
const testBlogs = require("./blogs")
const {blogsInDb, usersInDb} = require("./test_helper")

describe("blog api", async () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(testBlogs.map((b) => {
            b = Object.assign({}, b)
            delete b._id
            delete b.__v
            return b;
        }))
    })

    describe("retrieving blogs", async () => {
        test("GET /api/blogs returns all blogs", async () => {
            const res = await api.get("/api/blogs")
        
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(testBlogs.length)
        })
    })
    
    describe("adding blogs", async () => {
        test("POST /api/blogs adds a valid blog", async () => {
            const res = await api
                .post("/api/blogs")
                .send({
                    title: "My Post",
                    author: "Kaj Ström",
                    url: "kajstrom.fi",
                    likes: 5
                })
        
            expect(res.status).toBe(201)
            expect(res.body.title).toBe("My Post")
        
            const blogsAfterOperation = await blogsInDb()
        
            expect(blogsAfterOperation.length).toBe(testBlogs.length + 1)
        })
    
        test("POST /api/blogs defaults likes to 0 if likes field is omitted", async () => {
            const res = await api
                .post("/api/blogs")
                .send({
                    title: "My Post",
                    author: "Kaj Ström",
                    url: "kajstrom.fi"
                })
        
            const blogsAfterOperation = await blogsInDb()
    
            expect(res.body.likes).toBe(0)
            expect(blogsAfterOperation.length).toBe(testBlogs.length + 1)
        })
    
        test("POST /api/blogs does not add blog without title and url", async () => {
            const res = await api
                .post("/api/blogs")
                .send({
                    author: "Kaj Ström",
                    likes: 2000
                })
        
            const blogsAfter = await blogsInDb()
    
            expect(res.status).toBe(400)
            expect(blogsAfter.length).toBe(testBlogs.length)
        })
    })
    
    describe("deleting blogs", async () => {
        test("DELETE /api/blogs/:id should delete blog post", async () => {
            const toDelete = await api
                .post("/api/blogs")
                .send({
                    title: "My Post",
                    author: "Kaj Ström",
                    url: "kajstrom.fi"
                })
    
            const res = await api
                .delete(`/api/blogs/${toDelete.body._id}`)
                .send()
            
            const blogsAfterOperation = await blogsInDb()
    
            expect(res.status).toBe(204)
            expect(blogsAfterOperation.length).toBe(testBlogs.length)
        })
    })
    
    describe("updating blog", async () => {
        test("PUT /api/blogs/:id should update blog post", async () => {
            const blogsBeforeOperation = await blogsInDb()
    
            const toUpdate = blogsBeforeOperation[0]
    
            const res = await api
                .put(`/api/blogs/${toUpdate.id}`)
                .send({
                    title: "My Post",
                    author: "Kaj Ström",
                    url: "kajstrom.fi",
                    likes: 9999
                })
    
            const blogsAfterOperation = await blogsInDb()
    
            const likes = blogsAfterOperation.map(b => b.likes)
            
            expect(res.status).toBe(200)
            expect(res.body.likes).toBe(9999)
            expect(likes).toContain(9999)
        })
    })
})

describe("user api",  async () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    describe("creating users", async () => {
        test("POST /api/users with a too short password should not create user", async () => {
            const usersBeforeOperation = await usersInDb()
    
            const response = await api
                .post("/api/users")
                .send({
                    username: "Testing",
                    name: "Justin Case",
                    adult: true,
                    password: "12"
                })
    
            expect(response.status).toBe(400)
            expect(response.body.error).toBe("Password is too short")
    
            const usersAfterOperation = await usersInDb()
    
            expect(usersBeforeOperation.length).toBe(usersAfterOperation.length)
        })

        test("POST /api/users with a username already in use should not create a new user", async () => {
            const usersBeforeOperation = await usersInDb()

            const user = {
                username: "Testing",
                    name: "Justin Case",
                    adult: true,
                    password: "12345"
            }

            let response = await api
                .post("/api/users")
                .send(user)

            expect(response.status).toBe(201)

            response = await api
                .post("/api/users")
                .send(user)

            expect(response.status).toBe(400)
            expect(response.body.error).toBe("Username is already taken")
        })
    })
})

afterAll(() => {
    server.close()
})