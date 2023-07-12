import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Prisma, Rating, Record, Remark, Result, Student } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { getFirstName, getLastName } from "$lib/utils";

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  const { id } = params;
  const res = await fetch(`/api/student-view/${id}`);

  const {
    data: { rStudent },
  } = await res.json();

  let name = rStudent.class_name as string;
  let section = rStudent.section_name as string;

  name = name.charAt(0) + name.slice(1).toLowerCase();
  section = section.charAt(0) + section.slice(1).toLowerCase();

  const cls = await db.class.findFirst({
    where: { name, section, arm: locals.user?.arm },
  });

  const classId = cls?.id;
  const students = await db.student.findMany({
    where: { classId },
  });

  const grades = await db.grade.findMany({ where: { arm: locals.user?.arm } });

  const results = await db.result.findMany({
    where: { classId },
    include: { records: true, ratings: true, remarks: true, scores: true },
  });
  const subjects = await db.subject.findMany({
    where: { arm: locals.user?.arm, classId } as any,
  });

  return {
    rStudent,
    students,
    grades,
    results,
    subjects,
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
    const { term, academicYear } = data;
    let result: Result;
    try {
      const hasRe = await db.result.count({ where: { term, academicYear } });
      if (hasRe && !id) return fail(500, { message: `${term} term result already exists` });
      if (hasRe && id) return fail(500, { message: `Result has some data` });

      if (id) {
        result = await db.result.delete({ where: { id } });
        return { deleted: result.id };
      } else result = await db.result.create({ data });
      return { result };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Could not create the student." });
    }
  },

  record: async ({ request, url }) => {
    const id = url.searchParams.get("id") as string;
    const edit = url.searchParams.get("edit");
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    if (!data.subject && !id) {
      return fail(500, { error: "R001" });
    }

    let record: Record;

    try {
      if (id && !edit) {
        record = await db.record.delete({ where: { id } });
        return { id: record.id };
      } else if (id && edit) {
        record = await db.record.update({ where: { id }, data });
        return { edit: true, record };
      } else record = await db.record.create({ data });
      return { record };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },

  rating: async ({ url, request }) => {
    const id = url.searchParams.get("id") as string;
    const edit = url.searchParams.get("edit");
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    let rating: Rating;
    if (!data.attribute && !id) {
      return fail(500, { error: "R001" });
    }

    try {
      if (id && !edit) {
        rating = await db.rating.delete({ where: { id } });
        return { id: rating.id };
      } else if (id && edit) {
        rating = await db.rating.update({ where: { id }, data });
        return { edit: true, rating };
      } else rating = await db.rating.create({ data });
      return { rating };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },

  remark: async ({ url, request }) => {
    const id = url.searchParams.get("id") as string;
    const edit = url.searchParams.get("edit");
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as any;
    let remark: Remark;

    if (!data.comment && !data.name && !id) {
      return fail(500, { error: "R001" });
    }

    try {
      if (id && !edit) {
        remark = await db.remark.delete({ where: { id } });
        return { id: remark.id };
      } else if (id && edit) {
        remark = await db.remark.update({ where: { id }, data });
        return { edit: true, remark };
      } else remark = await db.remark.create({ data });
      return { remark };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },

  confirm: async ({ fetch, url, request }) => {
    const id = url.searchParams.get("id") as string;
    const body = await request.formData();
    const { photo_url, student_photo, remoteId, studentId } = Object.fromEntries(body);
    body.set("id", id);
    try {
      const file = student_photo as File;
      if (!file.size) {
        const filename = (photo_url as string).split("/")[1];
        const res = await fetch(`/${photo_url}`);
        const blob = await res.blob();
        let file = new File([blob], filename, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        body.set("student_photo", file);
      }
      const res = await fetch(`/api/update-student`, { method: "POST", body });
      const result = await res.json();

      if (result.success) {
        await db.student.update({ where: { id: studentId as string }, data: { remoteId } as any });
      }

      return { result };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },
};
