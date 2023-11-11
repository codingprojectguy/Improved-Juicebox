const router = require("express").Router();
const prisma = require("../prisma");

//GET all the posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

//GET the post by id
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const result = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      return next({
        status: 404,
        message: `None`,
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
