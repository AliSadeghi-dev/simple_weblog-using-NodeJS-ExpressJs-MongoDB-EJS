const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const adminController = require("../controllers/adminControllers");

const router = new Router();

//* dashboardPage GET /dashboard
router.get("/", authenticated, adminController.getDashboard);
router.get("/add-post", authenticated, adminController.getAddPost);
router.get("/edit-post/:id", authenticated, adminController.getEditPost);
router.get("/delete-post/:id", authenticated, adminController.deletePost);

router.post("/add-post", authenticated, adminController.CreatePost);
router.post("/edit-post/:id", authenticated, adminController.editPost);

//* POST handle image upload  dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);

router.post("/search", authenticated, adminController.handleSearch);

module.exports = router;