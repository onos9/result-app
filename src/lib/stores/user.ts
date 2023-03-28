import type { Config, Role, User } from "@prisma/client";
import { writable } from "svelte/store";

export const user = writable<User & { role: Role }>({} as User & { role: Role });
