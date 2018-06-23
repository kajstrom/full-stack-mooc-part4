const usersRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")

usersRouter.post("/", async (request, response) => {
    const body = request.body

    if (body.username === undefined) {
        return response.status(400).json({error: "Username missing"})
    }

    if (body.name === undefined) {
        return response.status(400).json({error: "Name missing"})
    }

    if (body.password === undefined) {
        return response.status(400).json({error: "Password missing"})
    }

    if (body.password.length <= 3) {
        return response.status(400).json({error: "Password is too short"})
    }

    body.adult = body.adult === undefined ? true : body.adult

    const existingUsersWithSameUsername = await User.find({username: body.username})
    
    if (existingUsersWithSameUsername.length !== 0) {
        return response.status(400).json({error: "Username is already taken"})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new User({
        username: body.username,
        name: body.name,
        adult: body.adult,
        passwordHash
    })

    await newUser.save()

    response.status(201).send()
})

usersRouter.get("/", async (request, response) => {
    const allUsers = await User
        .find({})
        .populate("blogs", {title: 1, url: 1, likes: 1})
    response.json(allUsers.map(User.format))
})

module.exports = usersRouter