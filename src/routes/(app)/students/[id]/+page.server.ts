import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type {
  Prisma,
  Rating,
  Record,
  Remark,
  Student,
} from "node_modules/.prisma/client";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  const { id } = params;
  const student = await db.student.findUnique({
    where: { id },
    include: { Class: true, result: true },
  });

  const classId = locals.user.arm == "eyfs" ? student?.classId : {};
  return {
    student,
    grades: await db.grade.findMany({ where: { arm: locals.user?.arm } }),
    results: await db.result.findMany({
      where: { classId: student?.classId },
      include: { records: true, ratings: true, remarks: true, scores: true },
    }),
    subjects: await db.subject.findMany({
      where: { arm: locals.user?.arm, classId } as any,
    }),
  };
};

export const actions: Actions = {
  student: async ({ request, url }) => {
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    let result: Student;

    try {
      if (id) result = await db.student.update({ where: { id }, data });
      result = await db.student.create({ data });

      return { result };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Could not create the student." });
    }
  },

  result: async ({ request, url }) => {
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    try {
      if (id) {
        const record = await db.result.update({ data, where: { id } });
        return { ...record };
      }
      const record = await db.result.create({ data });
      return { ...record };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Could not create the student." });
    }
  },

  record: async ({ request, url }) => {
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    if (!data.subject && !id) {
      return fail(500, { error: "R001" });
    }

    let record: Record;
    try {
      if (id) {
        record = await db.record.delete({ where: { id } });
        return { id: record.id };
      } else record = await db.record.create({ data });
      return { record };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },

  rating: async ({ url, request }) => {
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    let rating: Rating;
    if (!data.attribute && !id) {
      return fail(500, { error: "R001" });
    }

    try {
      if (id) {
        rating = await db.rating.delete({ where: { id } });
        return { id: rating.id };
      } else rating = await db.rating.create({ data });
      return { rating };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },

  remark: async ({ url, request }) => {
    const id = url.searchParams.get("id") as string;
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    let remark: Remark;

    if (!data.comment && !data.name && !id) {
      return fail(500, { error: "R001" });
    }

    try {
      if (id) {
        remark = await db.remark.delete({ where: { id } });
        return { id: remark.id };
      } else remark = await db.remark.create({ data });
      return { remark };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },
};
