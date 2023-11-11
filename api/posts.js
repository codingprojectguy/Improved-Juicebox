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

//POST create a new post as the currently logged in user
router.post("/", async (req, res, next) => {
  try {
    const userId = +req.headers.authorization;

    if (!userId) {
      return next({
        status: 401,
        message: "Must login",
      });
    }

    const { userTitle, userContent } = req.body;
    if (!userTitle || !userContent) {
      const error = {
        status: 400,
        message: "title and content must included",
      };
      return next(error);
    }
    const post = await prisma.post.create({
      data: {
        title: userTitle,
        content: userContent,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.json(post);
  } catch (err) {
    next(err);
  }
});

//PUT update a post only if it was created by currently logged in user.
router.put("/:id", async (req, res, next) => {
  try {
    const userId = +req.headers.authorization;
    if (!userId) {
      return next({
        status: 401,
        message: "must login first",
      });
    }
    const id = +req.params.id;
    const postExists = await prisma.post.findUnique({ where: { id } });
    if (!postExists) {
      return next({
        status: 404,
        message: `Can not find post id${id}`,
      });
    }
    if (postExists.userId !== userId) {
      return next({
        status: 403,
        message: "you can't update other user's post",
      });
    }

    const { userTitle, userContent } = req.body;
    if (!userTitle || !userContent) {
      const error = {
        status: 400,
        message: "title and content must included",
      };
      return next(error);
    }

    const update = await prisma.post.update({
      where: { id },
      data: { title: userTitle, content: userContent },
    });

    res.send(update);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
