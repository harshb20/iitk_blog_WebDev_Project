import express from 'express'
const router = express.Router({ mergeParams: true });
import Blog from './../models/Blog.js'
import Comment from './../models/Blog.js'
import mongoose from 'mongoose';

router.post("/post", async (req, res) => {
  try {
    const newComment = req.body;
    const blog = await Blog.findOne({
      _id: newComment.blog
    })

    if (!blog) { return res.status(404).json({ error: "Blog not found" }) }


    const comment = new Comment(newComment);
    await comment.save()

    blog.comments.push(comment._id);
    await blog.save();
    res.json(newComment);
  }
  catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const comments = await Comment.findOne({ _id: id });
    if (!comments) return res.status(404).json({ error: "Comment not found" });
    res.json(comments);
  }
  catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const comments = await Comment.findOneAndDelete({ _id: id });
    if (!comments) return res.status(404).json({ error: "Comment not found" });
    res.json(comments);
  }
  catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const comments = await Comment.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true, runValidators: true });
    if (!comments) return res.status(404).json({ error: "Comment not found" });
    res.json(comments);
  }
  catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
}
);

export default router;