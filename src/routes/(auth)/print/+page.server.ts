import { Pupils } from "$lib/data/pupils";
import { db } from "$lib/server/database";
import type { user } from "$lib/stores/user";
import type { Role, User } from "@prisma/client";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const id = url.searchParams.get("id") as string;
  const remoteId = url.searchParams.get("remoteId") as string;
  const term = locals.configs.find((cfg) => cfg.key == "term");
  const year = locals.configs.find((cfg) => cfg.key == "academicYear");
  const rStudent = Pupils.find((std) => std.id === Number(remoteId));

  const student = await db.student.findUnique({
    where: { id },
    include: { Class: true, result: true },
  });

  const result = await db.result.findMany({
    where: { studentId: id, term: term?.value, academicYear: year?.value },
    include: { records: true, ratings: true, remarks: true, scores: true },
  });

  return {
    student,
    rStudent,
    result: result[0],
    configs: locals.configs,
    user: locals.user,
  };
};
