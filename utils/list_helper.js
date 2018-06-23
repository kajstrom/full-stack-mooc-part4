const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => {
        return acc + curr.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((acc, curr) => {
        return acc.likes > curr.likes ? acc : curr
    })
}

const groupByAuthor = (blogs) => {
    return blogs.reduce((acc, blog) => {
        const {author} = blog
    
        if (acc[author] === undefined) {
            acc[author] = []
        }
    
        acc[author].push(blog)
    
        return acc;
    }, {})
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = groupByAuthor(blogs)

    return Object.keys(blogsByAuthor)
        .map((author) => {
            return {
                author,
                blogs: blogsByAuthor[author].length
            }
        })
        .reduce((acc, curr) => {
            return acc.blogs > curr.blogs ? acc : curr
        })
}

const mostLikes = (blogs) => {
    const blogsByAuthor = groupByAuthor(blogs)

    return Object.keys(blogsByAuthor)
        .map((author) => {
            return {
                author,
                likes: blogsByAuthor[author].reduce((acc, curr) => acc + curr.likes, 0)
            }
        })
        .reduce((acc, curr) => acc.likes > curr.likes ? acc : curr)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}