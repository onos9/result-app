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
export const classes = writable<Class[]>([]);
export const subjects = writable<Subject[]>([]);
export const comments = writable<Comment[]>([]);

export const students = writable<Student[]>();
export const student = writable<Student & { Class: Class }>();

export const rStudent = writable<any>();
export const rStudents = writable<any[]>();

export const results = writable<
  (Result & {
    student: Student | null;
    ratings: Rating[];
    records: Record[];
    scores: Score[];
    remarks: Remark[];
  })[]
>([]);

export const result = writable<
  Result & {
    student: Student | null;
    ratings: Rating[];
    records: Record[];
    scores: Score[];
    remarks: Remark[];
  }
>();
