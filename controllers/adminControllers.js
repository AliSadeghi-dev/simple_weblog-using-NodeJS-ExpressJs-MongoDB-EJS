const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalaliMoment");
const { get500 } = require("./errorController");

exports.getDashboard = async(req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.render("private/blogs", {
            pageTitle: "بخش مدیریت ",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,
            formatDate,
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};

exports.getAddPost = async(req, res) => {
    res.render("private/addPost", {
        pageTitle: "بخش مدیریت |پست جدید",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname, 
    });
};

exports.CreatePost = async(req, res) => {
    const errorArr = [];
    try {
        await Blog.postValidation(req.body);
        Blog.create({...req.body, user: req.user.id });
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/addPost", {
            pageTitle: "بخش مدیریت |پست جدید",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            errors: errorArr,
        });
    }
};