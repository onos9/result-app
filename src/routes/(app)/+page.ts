import { browser } from "$app/environment";
import {
  classes,
  grades,
  results,
  rStudent,
  rStudents,
  student,
  students,
  subjects,
} from "$lib/stores/data_store";
import type { PageLoad } from "./$types";

export const load = (async ({ data, fetch }) => {

  students.set(data?.students || null);
  grades.set(data?.grades || []);
  rStudents.set(data?.rStudents || []);
  results.set(data?.results || []);
  subjects.set(data?.subjects || []);
  classes.set(data?.classes || null);

  return {};
}) satisfies PageLoad;
