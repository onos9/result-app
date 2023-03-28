import type { Prisma } from "@prisma/client";
import { redirect } from "@sveltejs/kit";
import type { Action, Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
};

export const actions: Actions = {
  async default({ cookies, locals }) {
    await db.user.update({
      where: { email: locals.user?.email } as Prisma.UserWhereUniqueInput,
      data: { userAuthToken: "" },
    });

    // eat the cookie
    cookies.delete("session", { path: "/" });

    locals.user = null;
    // redirect the user
    throw redirect(302, "/login");
  },
};
