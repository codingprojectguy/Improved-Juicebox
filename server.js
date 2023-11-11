require("dotenv").config();
const seed = require("./prisma/seed");
const app = require("./app");

const init = async () => {
  await seed();
  const port = 3000;
  app.listen(port, () => console.log(`ing at http://localhost:${port}`));
};

init();
