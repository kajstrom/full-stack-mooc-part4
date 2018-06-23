if (process.env.MONGO_URI !== "production") {
    require("dotenv").config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGO_URI

if (process.env.NODE_ENV === "test") {
    port = process.env.TEST_PORT
    mongoUrl = process.env.TEST_MONGO_URI
}

module.exports = {
    port, mongoUrl
}