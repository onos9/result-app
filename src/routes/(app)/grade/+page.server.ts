import { db } from "$lib/server/database";
import type { Grade, Prisma } from "@prisma/client";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");
  
  return {
    grades: await db.grade.findMany({ where: { arm: locals.user?.arm } }),
    subjects: await db.subject.findMany({ where: { arm: locals.user?.arm as any } }),
    user: locals.user,
  };
};

export const actions: Actions = {
  create: async ({ request, locals, url }) => {
    const id = url.searchParams.get("id");
    const data = Object.fromEntries(await request.formData());
    const { point } = data;
    let grade: Grade;

    try {
      const exist = await db.grade.count({ where: { point } as any });
      if (exist > 0) {
        grade = await db.grade.update({ data, where: { id } as Prisma.GradeWhereUniqueInput });
      } else grade = await db.grade.create({ data: { ...data, arm: locals.user?.arm } });
      return { grade };
    } catch (err: any) {
      console.error(err);
      return fail(500, { message: err.message, code: err.code });
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
      await db.grade.delete({
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
