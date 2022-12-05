const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalaliMoment");
const { get500 } = require("./errorController");
const { fileFilter, storage } = require("../utils/multer");
const multer = require("multer");

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

exports.uploadImage = (req, res) => {
    // let filename = `${uuid()}.jpg`;
    const upload = multer({
        limits: { fileSize: 4000000 },
        dest: "uploads/",
        storage: storage,
        fileFilter: fileFilter,
    }).single("image");

    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (req.file) {
                res.status(200).send("آپلود عکس موفقیت آمیز بود.");
            } else {
                res.send("جهت آپلود عکسی را انتخاب کنید.");
            }
        }
    });
};