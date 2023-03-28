import { redirect } from "@sveltejs/kit";
import { URL, URLSearchParams } from "url";
import type { LayoutServerLoad } from "./$types";

// get `locals.user` and pass it to the `page` store
export const load: LayoutServerLoad = async ({ locals }) => {
  // redirect user if not logged in
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  return {
    user: locals.user,
    configs: locals.configs,
  };
};
