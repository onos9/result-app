import { writable } from "svelte/store";
import type {
  Class,
  Result,
  Student,
  Grade,
  Subject,
  Rating,
  Score,
  Remark,
  Record,
  Comment,
} from "@prisma/client";

export const grades = writable<Grade[]>([]);
export const subjects = writable<Subject[]>([]);
export const comments = writable<Comment[]>([]);

export const student = writable<Student | null>();

export const rStudent = writable<any>();

export const results = writable<
  (Result & {
    ratings: Rating[];
    records: Record[];
    scores: Score[];
    remarks: Remark[];
  })[]
>([]);
