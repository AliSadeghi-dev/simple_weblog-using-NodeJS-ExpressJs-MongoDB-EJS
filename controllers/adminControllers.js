const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalaliMoment");
const { get500 } = require("./errorController");
const { fileFilter, storage } = require("../utils/multer");
const multer = require("multer");
const uuid = require("uuid").v4;
const appRoot = require("app-root-path");
const shortid = require("shortid");
const sharp = require("sharp");

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

exports.getEditPost = async(req, res) => {
    const post = await Blog.findOne({
        _id: req.params.id,
    });
    console.log(post);
    if (!post) {
        return res.redirect("errors/404");
    }
    if (post.user.toString() != req.user._id) {
        return res.redirect("/dashboard");
    } else {
        res.render("private/editPost", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            post,
        });
    }
};

exports.editPost = async(req, res) => {
    const errorArr = [];

    const post = await Blog.findOne({ _id: req.params.id });
    try {
        await Blog.postValidation(req.body);
        if (!post) {
            return res.redirect("errors/404");
        }
        if (post.user.toString() != req.user._id) {
            return res.redirect("/dashboard");
        } else {
            const { title, status, body } = req.body;
            post.status = status;
            post.title = title;
            post.body = body;

            await post.save();
            return res.redirect("/dashboard");
        }
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.render("private/editPost", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            post,
            errors: errorArr,
        });
    }
};

exports.deletePost = async(req, res) => {
    try {
        await Blog.findByIdAndRemove(req.params.id);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};

exports.CreatePost = async(req, res) => {
    const errorArr = [];

    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortid.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
    console.log(thumbnail);

    try {
        req.body = {...req.body, thumbnail };
        console.log(req.body);
        await Blog.postValidation(req.body);

        await sharp(thumbnail.data)
            .jpeg({ quality: 60 })
            .toFile(uploadPath)
            .catch((err) => console.log(err));

        Blog.create({...req.body, user: req.user.id, thumbnail: fileName });
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
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .send("حجم عکس ارسالی نباید بیشتر از ۴ مگابایت باشد.");
            }
            console.log(err);
            res.status(400).send(err);
        } else {
            const fileName = `${uuid()}_${req.file.originalname}`;
            if (req.file) {
                res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
            } else {
                res.send("جهت آپلود عکسی را انتخاب کنید.");
            }
        }
    });
};