import { db } from "$lib/server/database";
import type { Role, User } from "node_modules/.prisma/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { id } = params;
  return {
    student: await db.student.findUnique({
      where: { id },
      include: { Class: true, result: true },
    }),
    results: await db.result.findMany({
      where: { studentId: id },
      include: { records: true, ratings: true, remarks: true, scores: true },
    }),
    configs: locals.configs,
    user: locals.user as User & { role: Role },
  };
};
