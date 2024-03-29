const { Router } = require("express");
const blogController = require("../controllers/blogController");

const router = new Router();

router.get("/", blogController.getIndex);

router.get("/post/:id", blogController.getSinglePost);

router.get("/contact", blogController.getContactPage);

router.post("/search", blogController.handleSearch);

module.exports = router;