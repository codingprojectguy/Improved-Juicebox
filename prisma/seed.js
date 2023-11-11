const prisma = require("./index");

const mockData = [
  {
    username: "nathan",
    password: "li",
    posts: {
      create: [
        { title: "first post", content: "first content" },
        { title: "second note", content: "second content" },
        { title: "third note", content: "third content" },
      ],
    },
  },
  {
    username: "amy",
    password: "123",
    posts: {
      create: [
        { title: "first post", content: "first content" },
        { title: "second note", content: "second content" },
      ],
    },
  },
  {
    username: "hannah",
    password: "123",
    posts: {
      create: [{ title: "first post", content: "first content" }],
    },
  },
  {
    username: "mock",
    password: "data",
    posts: {
      create: [
        { title: "first post", content: "first content" },
        { title: "second note", content: "second content" },
      ],
    },
  },
];

const seed = async () => {
  for (const data of mockData) {
    await prisma.user.create({
      data,
    });
  }
};

module.exports = seed;
