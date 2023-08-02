import { Pupils } from "$lib/data/pupils";
import { db } from "$lib/server/database";
import type { user } from "$lib/stores/user";
import type { Role, User } from "@prisma/client";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, locals, url }) => {
  const id = url.searchParams.get("id") as string;
  const remoteId = url.searchParams.get("remoteId") as string;
  const term = locals.configs.find((cfg) => cfg.key == "term");
  const year = locals.configs.find((cfg) => cfg.key == "academicYear");

  const resp = await fetch("/student-list.json");
  const { data } = await resp.json();
  const rStudent = data.students.find((std: any) => std.id == remoteId);

  const student = await db.student.findUnique({
    where: { id },
    include: { Class: true },
  });

  const result = await db.result.findFirst({
    where: { studentId: id, term: term?.value, academicYear: year?.value },
    include: { records: true, ratings: true, remarks: true, scores: true, student:true },
  });

  return {
    student,
    rStudent,
    result: result,
    configs: locals.configs,
    user: locals.user,
  };
};
