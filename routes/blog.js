const { Router } = require("express");
const router = Router();
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");
const Comment = require("../models/comment");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
  res.render("blog", {
    user: req.user,
  });
});
router.post("/", upload.single("coverimg"), async (req, res) => {
  const { title, body, coverimg } = req.body;
  const blog = await Blog.create({
    title,
    body,
    coverimg,
    createdby: req.user._id,
    coverimg: `uploads/${req.file.filename}`,
  });
  return res.redirect("/");
});
router.get("/:id", async (req, res) => {
  const blogid = req.params.id;
  const comments = await Comment.find({ blogid: req.params.id }).populate(
    "postby"
  );
  const blog = await Blog.findById(blogid).populate("createdby");
  if (!blog) return res.json({ msg: "blog not found" });
  return res.render("allblog", { user: req.user, blog, comments });
});
router.post("/comment/:blogid", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogid: req.params.blogid,
    postby: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogid}`);
});
module.exports = router;
