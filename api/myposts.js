const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
router.get("/", async (req, res, next) => {
  try {
    const payload = jwt.verify(req.headers.authorization, process.env.JWT);

    const posts = await prisma.post.findMany({
      where: {
        userId: payload.id,
      },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
