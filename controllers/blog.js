const jwt = require("jsonwebtoken")
const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate("user", {username: 1, name: 1})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const {body} = request

    if (!request.token) {
        return response.status(401).json({error: "Token missing"})
    }

    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({error: "Token invalid"})
    }

    if (body.title === undefined || body.url === undefined) {
        return response.status(400).end()
    }

    if (body.likes === undefined) {
        body.likes = 0
    }

    const user = await User.findById(decodedToken.id)
    body.user = user._id

    const blog = new Blog(body)

    const result = await blog.save()

    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    response.status(201).json(result)
})

blogRouter.put("/:id", async (request, response) => {
    const id = request.params.id

    const updated = await Blog.findOneAndUpdate({_id: id}, request.body, {new: true})

    response.status(200).json(updated)
})

blogRouter.delete("/:id", async (request, response) => {
    const id = request.params.id

    if (!request.token) {
        return response.status(401).json({error: "Token missing"})
    }

    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({error: "Token invalid"})
    }

    const blog = await Blog.findById(id)

    if (blog.user._id.toString() !== decodedToken.id.toString()) {
        return response.status(401).json({error: "Cannot delete blog posts added by another user!"})
    }

    await blog.remove()

    response.status(204).send()
})

module.exports = blogRouter