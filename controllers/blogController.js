const Blog = require("../models/blog");
const { formatDate } = require("../utils/jalaliMoment");
const { truncate } = require("../utils/helpers");
const Yup = require("yup");

exports.getIndex = async(req, res) => {
    try {
        const posts = await Blog.find({ status: "public" }).sort({
            createdAt: "desc",
        });
        res.render("index", {
            pageTitle: "وبلاگ",
            path: "/",
            posts,
            formatDate,
            truncate,
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};

exports.getSinglePost = async(req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate("user");
        if (!post) {
            return res.redirect("errors/404");
        }
        res.render("post", {
            pageTitle: post.title,
            path: "/post",
            post,
            formatDate,
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};

exports.getContactPage = (req, res) => {
    res.render("contact", {
        pageTitle: "تماس با ما",
        path: "/contact",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        errors: [],
    });
};

// exports.handleContactPage = async(req, res) => {
//     const errorArr = [];
//     const { fullname, email, message, captcha } = req.body;

//    const schema = Yup.object().shape({
//      fullname: Yup.string()
//        .required("نام و نام خانوادگی الزامی میباشد.  "),
//        email: Yup.string().required("وارد کردن ایمیل الزامی میباشد").email("آدرس ایمیل صحیح نمیباشد."),
//      message:Yup.string().required("پیام اصلی الزامی میباشد.")
//    });

//     try {
//         await schema.validate(req.body, { abortEarly: false });
//          sendEmail(email,fullname,"پیام از طرف وبلاگ",message);
//     } catch (err) {

//     }

// };

exports.handleSearch = async(req, res) => {
    try {
        const posts = await Blog.find({
            status: "public",
            $text: { $search: req.body.search },
        }).sort({
            createdAt: "desc",
        });
        res.render("index", {
            pageTitle: "نتایج جستجوی شما",
            path: "/",
            posts,
            formatDate,
            truncate,
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500", {
            pageTitle: "خطای سرور",
            path: "/500",
        });
    }
};