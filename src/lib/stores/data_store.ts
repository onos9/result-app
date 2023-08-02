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
import { browser } from "$app/environment";

export const grades = writable<Grade[]>([]);
export const classes = writable<Class[]>([]);
export const subjects = writable<Subject[]>([]);
export const comments = writable<Comment[]>([]);

// const defaultValue: any = null;
// const initialStudent = JSON.parse(browser ? localStorage.rStudent ?? defaultValue : defaultValue);
// const initialResult = JSON.parse(browser ? localStorage.result ?? defaultValue : defaultValue);

export const students = writable<Student[]>();
export const student = writable<(Student & { Class: Class }) | null>();

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
  | (Result & {
      student: Student | null;
      ratings: Rating[];
      records: Record[];
      scores: Score[];
      remarks: Remark[];
    })
  | null
>();

// rStudent.subscribe((value) => {
//   if (browser) {
//     localStorage.student = JSON.stringify(value);
//   }
// });

// result.subscribe((value) => {
//   if (browser) {
//     localStorage.result = JSON.stringify(value);
//   }
// });
