import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  return {
    users: await db.user.findMany(),
    user: locals.user,
  };
};
