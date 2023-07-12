import type { Config, Prisma, PrismaClient, Role, User, Class } from "@prisma/client";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare global {
  declare namespace App {
    interface Locals {
      user: (User & { role: Role | null } & { class: Class | null }) | null;
      configs: Config[];
    }

    // interface Error {}
    // interface PageData {}
    // interface Platform {}
  }
  var db: PrismaClient;
}
