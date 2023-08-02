import { configs } from "$lib/stores/configs";
import { result, rStudent, student } from "$lib/stores/data_store";
import { user } from "$lib/stores/user";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  const cfg = data?.configs.map((cfg: any) => [cfg.key, cfg.value]);

  configs.set(Object.fromEntries(cfg) || {});
  user.set(data?.user);
  student.set(data.student);
  rStudent.set(data?.rStudent);
  result.set(data.result);
}) satisfies PageLoad;
