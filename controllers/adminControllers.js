const Blog = require('../models/blog');

exports.getDashboard = async(req, res) => {

    res.render("private/blogs", {
        pageTitle: "بخش مدیریت ",
        path: "/dashboard",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}

exports.getAddPost = async(req, res) => {
    res.render("private/addPost", {
        pageTitle: "بخش مدیریت |پست جدید",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}

exports.CreatePost = async(req, res) => {
    try {
        Blog.create({...req.body, user: req.user.id })
        res.redirect("/dashboard")
    } catch (err) {
        console.log(err)
    }
}