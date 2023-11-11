const prisma = require("../prisma");
const router = require("express").Router();
router.get("/", async (req, res, next) => {
  try {
    const userId = +req.headers.authorization;

    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
