import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Subject, Prisma, Objective } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  const term = locals.configs.find((cfg) => cfg.key == "term");
  let objectives = () => db.objective.findMany({ where: { term: term?.value } });

  return {
    objectives: await objectives(),
  };
};

export const actions: Actions = {
  objective: async ({ request, locals, url }) => {
    const id = url.searchParams.get("id") as string;
    const data = Object.fromEntries(await request.formData()) as any;
    const term = locals.configs.find((cfg) => cfg.key == "term");

    let objective: Objective;
    try {
      if (!id)
        objective = await db.objective.create({
          data: { ...data, arm: locals.user?.arm, term: term?.value },
        });
      else objective = await db.objective.update({ where: { id }, data });
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Could not create the article." });
    }

    return { status: 200, objective };
  },

  delete: async ({ url }) => {
    const id = url.searchParams.get("id");
    if (!id) {
      return fail(400, { message: "Invalid request" });
    }

    try {
      await db.objective.delete({ where: { id } });
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
