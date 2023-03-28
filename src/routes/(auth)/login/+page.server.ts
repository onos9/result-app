import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import type { Action, Actions, PageServerLoad } from "./$types";

import { db } from "$lib/server/database";
import type { Prisma } from "@prisma/client";
import { user } from "$lib/stores/user";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/");
  }
};

const login: Action = async ({ cookies, request }) => {
  const { email, password } = Object.fromEntries(await request.formData());

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return fail(400, { invalid: true, email, password });
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return fail(400, { credentials: true });
  }

  const userPassword = await bcrypt.compare(
    password,
    user.passwordHash as string
  );

  if (!userPassword) {
    return fail(400, { credentials: true, email, password });
  }

  const authenticatedUser = await db.user.update({
    where: { email: user.email } as Prisma.UserWhereUniqueInput,
    data: { userAuthToken: crypto.randomUUID() },
  });

  cookies.set("session", authenticatedUser.userAuthToken, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 60 * 60 * 24 * 30,
  });

  throw redirect(302, "/settings");
};

export const actions: Actions = { login };
