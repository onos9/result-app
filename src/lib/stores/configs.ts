import type { Config, User } from "@prisma/client";
import { writable } from "svelte/store";

type School = {
  academicYear?: string;
  resumptionDate?: string;
  rusultDesc?: string;
  schoolAddress?: string;
  schoolCity?: string;
  schoolEmail?: string;
  schoolName?: string;
  schoolPhone: string;
  schoolRegion?: string;
  schoolZipCode?: string;
  term?: string;
};

export const configs = writable<any>(null);
