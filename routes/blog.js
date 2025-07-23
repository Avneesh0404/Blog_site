// routes/blog.js - Updated with Cloudinary (keeping your existing model)
const { Router } = require("express");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_covers', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' }, // Resize large images
      { quality: 'auto' }, // Auto optimize quality
      { fetch_format: 'auto' } // Auto format selection
    ],
  },
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

router.get("/add-new", (req, res) => {
  res.render("blog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverimg"), async (req, res) => {
  try {
    const { title, body } = req.body;
    
    const blogData = {
      title,
      body,
      createdby: req.user._id,
    };

    // If image was uploaded, store the Cloudinary URL in coverimg field
    if (req.file) {
      blogData.coverimg = req.file.path; // This will be the Cloudinary URL
    }

    const blog = await Blog.create(blogData);
    return res.redirect("/");
  } catch (error) {
    console.error('Error creating blog:', error);
    // You can add flash messages here if you have them set up
    return res.redirect("/blog/add-new");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blogid = req.params.id;
    const comments = await Comment.find({ blogid: req.params.id }).populate("postby");
    const blog = await Blog.findById(blogid).populate("createdby");
    
    if (!blog) return res.json({ msg: "blog not found" });
    
    return res.render("allblog", { user: req.user, blog, comments });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return res.json({ msg: "Error fetching blog" });
  }
});

router.post("/comment/:blogid", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogid: req.params.blogid,
      postby: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogid}`);
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.redirect(`/blog/${req.params.blogid}`);
  }
});

module.exports = router;