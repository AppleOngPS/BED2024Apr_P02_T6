const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validatePost = require("../middlewares/validatepost");
// CRUD routes
router.post("/", postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
