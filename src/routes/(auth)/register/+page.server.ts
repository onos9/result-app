import { fail, redirect } from "@sveltejs/kit";
import type { Action, Actions, PageServerLoad } from "./$types";
import bcrypt from "bcrypt";

import { db } from "$lib/server/database";
import type { Class, Prisma } from "@prisma/client";
import { user } from "$lib/stores/user";

// using an enum for user roles to avoid typos
// if you're not using TypeScript use an object
enum Roles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export const load: PageServerLoad = async ({ locals }) => {
  // redirect user if logged in
  if (locals.user) {
    throw redirect(302, "/");
  }
};

const register: Action = async ({ request }) => {
  const { firstName, lastName, email, password } = Object.fromEntries(await request.formData());

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    !email ||
    !password
  ) {
    return fail(400, { invalid: true });
  }

  const user = await db.user.findUnique({
    where: { email } as Prisma.UserWhereUniqueInput,
  });

  if (user) {
    return fail(400, { user: true });
  }

  const role = await db.role.create({
    data: { name: Roles.USER },
  });

  await db.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash: await bcrypt.hash(password, 10),
      userAuthToken: crypto.randomUUID(),
      roleId: role.id,
    },
  });

  throw redirect(303, "/login");
};

export const actions: Actions = { register };
