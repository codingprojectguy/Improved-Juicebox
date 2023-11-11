const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    });

    if (user) {
      return res.json({
        token: jwt.sign({ id: user.id }, process.env.JWT),
      });
    }

    res.status(401).send("incorrect username or password");
  } catch (err) {
    next(err);
  }
});
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const error = {
        status: 400,
        message: "must provide both username and password to login",
      };
      return next(error);
    }
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: req.body.password,
        posts: {
          create: [],
        },
      },
    });

    if (user) {
      return res.json({
        token: jwt.sign({ id: user.id }, process.env.JWT),
      });
    }
  } catch (err) {
    next(err);
  }
});
//Get /api/auth
router.get("/", async (req, res, next) => {
  try {
    const payload = jwt.verify(req.headers.authorization, process.env.JWT);
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
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
