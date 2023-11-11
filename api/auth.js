const prisma = require("../prisma");
const router = require("express").Router();

router.post("/", async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    });

    if (user) {
      return res.json({
        token: user.id,
      });
    }

    res.status(401).send("incorrect username or password");
  } catch (err) {
    next(err);
  }
});

//Get /api/auth
router.get("/", async (req, res, next) => {
  try {
    const id = +req.headers.authorization;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      return res.json(user);
    }

    res.status(401).send("invalid login session or session expored");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
