import { db } from "$lib/server/database";
import type { Class, Role, User } from "@prisma/client";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get("session");
  if (!session) {
    // if there is no session load page as normal
    return await resolve(event);
  }

  // find the user based on the session
  const user = await db.user.findUnique({
    where: { userAuthToken: session },
    include: { role: true, class: true },
  });

  const configs = await db.config.findMany();

  // if `user` exists set `events.local`
  if (user) {
    const { passwordHash, ...rest } = user;
    event.locals.user = rest as (User & { role: Role } & { class: Class }) | null;
  }

  if (configs.length) {
    event.locals.configs = configs;
  }

  const theme = event.url.pathname.includes("print") ? "light" : "night";
  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%theme%", theme),
  });
};

function exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
