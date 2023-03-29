import bcrypt from "bcrypt";
import crypto from "crypto";
import { Prisma, PrismaClient } from "@prisma/client";
import bank from "./comments.js";
const prisma = new PrismaClient();

export const createUser = async () => {
  const role = await prisma.role.create({
    data: { name: "SUPER_ADMIN" },
  });

  const user = await prisma.user.create({
    data: {
      email: "onosbrown.saved@gmail.com",
      firstName: "Brown",
      lastName: "Onojeta",
      passwordHash: await bcrypt.hash("Passwoerd", 10),
      userAuthToken: crypto.randomUUID(),
      roleId: role.id,
    } as Prisma.UserCreateInput,
  });

  // console.log({ user, role });
};

export const clearUser = async () => {
  const roles = await prisma.role.findMany();
  prisma.$transaction(
    roles.map((role) =>
      prisma.role.delete({
        where: { id: role.id },
      })
    )
  );

  // const users = await prisma.user.findMany();
  // prisma.$transaction(
  //   users.map((user) =>
  //     prisma.config.delete({
  //       where: { id: user.id },
  //     })
  //   )
  // );
};

export const createComment = async () => {
  const comments = bank.comments.sort((a, b) => Number(a.id) - Number(b.id));
  prisma.$transaction(
    comments.map((comment) =>
      prisma.comment.create({
        data: {
          text: comment.text,
          flagged: comment.flagged,
          type: comment.type || "unrated",
          tags: comment.tags?.join(",") || "",
        },
      })
    )
  );
};

export const clearComment = async () => {
  const comment = await prisma.comment.findMany();
  prisma.$transaction(
    comment.map((comment) =>
      prisma.comment.delete({
        where: { id: comment.id },
      })
    )
  );
};

export const createConfig = async () => {
  prisma.$transaction([
    prisma.config.create({
      data: {
        key: "comment_tags",
        value: bank.tags.map((tag) => tag.tag).join(","),
      },
    }),
  ]);
};

export const clearConfig = async () => {
  const configs = await prisma.config.findMany();
  prisma.$transaction(
    configs.map((config) =>
      prisma.config.delete({
        where: { id: config.id },
      })
    )
  );
};

async function main() {
  createUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
