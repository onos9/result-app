import { configs } from "$lib/stores/configs";
import { user } from "$lib/stores/user";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
  const cfg = data?.configs.map((cfg: any) => [cfg.key, cfg.value]);
  configs.set(Object.fromEntries(cfg) || {});
  user.set(data?.user);
  return {
    student: data?.student,
    result: data?.result,
    rStudent: data?.rStudent
  };
}) satisfies PageLoad;
