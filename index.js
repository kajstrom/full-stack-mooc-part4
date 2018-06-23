const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require("./controllers/blog")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const config = require("./utils/config")
const {tokenExtractor} = require("./utils/middleware")

app.use(cors())
app.use(bodyParser.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log("connected to database", config.mongoUrl)
  })
  .catch((err) => {
    console.log(config.mongoUrl)
    console.log(err)
  })

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on("close", () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}