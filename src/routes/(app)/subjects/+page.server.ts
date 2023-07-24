import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Subject, Prisma } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  return {
    subjects: await db.subject.findMany({ where: { arm: locals.user.arm } as any }),
    classes: await db.class.findMany({ where: { arm: locals.user.arm } as any }),
    user: locals.user,
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const data = Object.fromEntries(await request.formData()) as any;

    try {
      await db.subject.create({ data: { ...data, arm: locals.user?.arm } });
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Could not create the article." });
    }

    return {
      status: 201,
    };
  },

  update: async ({ request, locals, url }) => {
    const id = url.searchParams.get("id") as string;
    const data = Object.fromEntries(await request.formData()) as any;

    try {
      await db.subject.update({ where: { id }, data });
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
      await db.subject.delete({
        where: {
          id: id,
        },
      });
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
};
