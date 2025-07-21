// routes/edit.js
const express = require("express");
const router = express.Router();
const Blog = require("../models/blog"); // Adjust path if different

// Update blog by ID (PUT)

router.get("/", async (req, res) => {
  const allblog = await Blog.find({createdby:req.user._id});
  return res.render("edit", {
    user: req.user,
    blog: allblog,
    deleted: req.query.deleted
  });
});

// Delete blog by ID (DELETE)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.redirect("/edit?deleted=true"); // redirect with query param
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
