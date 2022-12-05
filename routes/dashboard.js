const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const adminController = require("../controllers/adminControllers");

const router = new Router();

//* dashboardPage GET /dashboard
router.get("/", authenticated, adminController.getDashboard);
router.get("/add-post", authenticated, adminController.getAddPost);
router.post("/add-post", authenticated, adminController.CreatePost);

//* POST handle image upload  dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);

module.exports = router;