import { grades, results, rStudent, student, subjects } from "$lib/stores/data_store";
import type { Student } from "@prisma/client";
import type { PageLoad } from "./$types";

export const load = (async ({ data, fetch }) => {
  const std = data.students.find(
    (std) => std.admissionNo?.split("/")[0] == data.rStudent.admission_no
  ) as Student;

  student.set(std);
  grades.set(data?.grades || []);
  results.set(data?.results || []);
  subjects.set(data?.subjects || []);
  rStudent.set(data?.rStudent || null);

  return {};
}) satisfies PageLoad;
