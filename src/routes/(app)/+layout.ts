import { configs } from "$lib/stores/configs";
import { user } from "$lib/stores/user";
import type { LoadEvent } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = (async ({ data }: LoadEvent) => {
  user.set(data?.user || {});

  const cfg = data?.configs?.map((cfg: any) => [cfg.key, cfg.value]);
  configs.set(Object.fromEntries(cfg || []));
  return {};
}) satisfies LayoutLoad;
