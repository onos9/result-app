import { browser } from "$app/environment";
import { grades, results, student, subjects, comments } from "$lib/stores/data_store";
import type { PageLoad } from "./$types";

export const load = (async ({ data, fetch }) => {
  grades.set(data?.grades || []);
  results.set(data?.results || []);
  student.set(data?.student);
  subjects.set(data?.subjects || []);
  return {};
}) satisfies PageLoad;
