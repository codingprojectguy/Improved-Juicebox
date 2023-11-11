const router = require("express").Router();
const prisma = require("../prisma");
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
