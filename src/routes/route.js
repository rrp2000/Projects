const express = require("express")
const router = express.Router()
let authorController = require("../Controller/AutherController")
let blogController = require("../Controller/BlogController")


router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogController.createBlog)
router.get("/blogs" ,blogController.showBlogs)
router.put("/blogs/:blogId", blogController.updateBlog)
router.get("/blogs/:blogId", blogController.deleteBlogById)
router.delete("/blogs",blogController.deleteBlogs)

module.exports = router 