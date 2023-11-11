const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("got a post req");
});
module.exports = router;
