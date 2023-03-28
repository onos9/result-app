import { redirect } from "@sveltejs/kit";
import type { Action, Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
  async default({ cookies, locals }) {
    // eat the cookie
    cookies.delete("session", { path: "/" });
    console.log("LOGOUT")

    locals.user = null;
    // redirect the user
    throw redirect(302, "/login");
  },
};
