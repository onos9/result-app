import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/database";
import { fail } from "@sveltejs/kit";
import type { Subject, Prisma } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  const classes = await db.class.findMany();
  return {
    user: locals.user,
    classes,
  };
};

export const actions: Actions = {
  user: async ({ url, request }) => {
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    if (!id) {
      return fail(400, { message: "Invalid request" });
    }

    try {
      const user = await db.user.update({ where: { id }, data });
      return { user };
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: "Something went wrong deleting your article",
      });
    }

    return {
      status: 200,
    };
  },

  school: async ({ url, request }) => {
    const formData = await request.formData();
    const data = Object.entries(Object.fromEntries(formData));
    try {
      const hasData = await db.config.count({});
      if (hasData) {
        const configs = await db.$transaction(
          data.map(([key, value]: any) => db.config.update({ where: { key }, data: { value } }))
        );

        return { configs: JSON.stringify(configs), status: 200 };
      }

      const configs = db.$transaction(
        data.map(([key, value]: any) => db.config.create({ data: { key, value } }))
      );

      return { configs: JSON.stringify(configs), status: 200 };
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: "Something went wrong deleting your article",
      });
    }
  },
};
