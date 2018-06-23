const listHelper = require('../utils/list_helper')
const testBlogs = require("./blogs")

test('dummy is called', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('of a non-empty list to match amount of total likes', () => {
        expect(listHelper.totalLikes(testBlogs)).toBe(36)
    })
})

describe('favorite blog', () => {
    test('finds favorite blog', () => {
        expect(listHelper.favoriteBlog(testBlogs)).toEqual({
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
          })
    })
})

describe('most blogs', () => {
    test('finds author with most blogs', () => {
        expect(listHelper.mostBlogs(testBlogs)).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('most likes', () => {
    test('finds author with most likes', () => {
        expect(listHelper.mostLikes(testBlogs)).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})