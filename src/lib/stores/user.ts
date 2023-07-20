import type { Class, Config, Role, User } from "@prisma/client";
import { writable } from "svelte/store";

export const user = writable<(User & { role: Role | null } & { class: Class | null }) | null>(
  {} as User & { role: Role | null } & { class: Class | null }
);
