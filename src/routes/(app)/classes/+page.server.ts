import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Class, Prisma } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");
  
  return {
    classes: await db.class.findMany({ where: { arm: locals.user?.arm } }),
    user: locals.user,
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const { name, section } = Object.fromEntries(await request.formData());

    try {
      await db.class.create({
        data: {
          userId: locals.user?.id,
          arm: locals.user?.arm,
          name,
          section,
        } as Prisma.ClassCreateInput,
      });
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Could not create the article." });
    }

    return {
      status: 201,
    };
  },

  delete: async ({ url }) => {
    const id = url.searchParams.get("id");
    if (!id) {
      return fail(400, { message: "Invalid request" });
    }

    try {
      await db.class.delete({ where: { id } });
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: "Something went wrong deleting the class",
      });
    }

    return {
      status: 200,
    };
  },
};
