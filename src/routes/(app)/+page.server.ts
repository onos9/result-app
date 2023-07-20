import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Class, Prisma, Rating, Record, Remark, Result, Student } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { Pupils } from "$lib/data/pupils";
import { mkdirSync, writeFileSync } from "fs";

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  let { name, section } = locals.user.class as Class;
  name = name?.toUpperCase().trim() as string;
  section = section?.toUpperCase().trim() as string;

  const classId = locals.user.class?.id;
  const local_students = await db.student.findMany({
    where: { classId },
    include: { Class: true },
  });

  const grades = await db.grade.findMany({ where: { arm: locals.user?.arm } });

  const results = await db.result.findMany({
    where: { classId },
    include: { records: true, ratings: true, remarks: true, scores: true, student: true },
  });

  const subjects = await db.subject.findMany({
    where: { arm: locals.user?.arm, classId } as any,
  });

  const classes = await db.class.findMany({
    where: { arm: locals.user?.arm } as any,
  });

  const rStudents = Pupils.filter(
    (pupil) => pupil.class_name == name && pupil.section_name == section
  );

  return {
    students: local_students,
    rStudents,
    grades,
    results,
    subjects,
    classes,
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
      const hasRe = await db.result.count({ where: { id, term, academicYear } });
      if (hasRe && !id) return fail(500, { message: `${term} term result already exists` });

      if (id) {
        result = await db.result.delete({ where: { id } });
        return { deleted: result.id };
      } else result = await db.result.create({ data });
      return { ...result };
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
    const formData = await request.formData();
    const photo_url = formData.get("photo_url") as string;
    let file = formData.get("student_photo") as File;

    formData.delete("photo_url");
    formData.delete("student_photo");

    const data = Object.fromEntries(formData) as any;
    const student = Pupils.find((std) => std.id == data?.remoteId);
    const name = student?.full_name?.toLowerCase().trim().replace(" ", "_");
    const ext = file.name.split(".").pop();
    const filename = name + "_" + Date.now().toString() + "." + ext;
    let ab: ArrayBuffer;

    try {
      if (!file.size) {
        const blob = await (await fetch(photo_url)).blob();
        file = new File([blob], filename, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });
        ab = await file.arrayBuffer();
      } else {
        ab = await file.arrayBuffer();
      }

      let dir = `static/uploads`;
      data.avatarUrl = `uploads/${filename}`;
      mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}/${filename}`, Buffer.from(ab));

      const result = await db.student.update({ where: { id }, data });
      return { result };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },

  upload: async ({ fetch, url, request, locals }) => {
    const id = url.searchParams.get("id") as string;
    const result = await db.result.findUnique({
      where: { id },
      include: { student: true },
    });
    if (!result) return fail(500, { message: "Could not find result." });

    const remoteId = Number(result?.student?.remoteId);
    const student = Pupils.find((std) => std.id == remoteId);
    const body = await request.formData();

    let cfgEntries = locals?.configs?.map((cfg: any) => [cfg.key, cfg.value]);
    let cfg = Object.fromEntries(cfgEntries);
    const photo_url = result?.student?.avatarUrl as string;

    body.append("id", student?.id as any);
    body.append("full_name", student?.full_name as any);

    try {
      const date = new Date(cfg.resumptionDate);
      const filename = photo_url?.split("/")[1] as string;

      let blob = await (await fetch(photo_url)).blob();
      let file = new File([blob], filename, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
      body.append("student_photo", file);

      blob = await (await fetch(result?.resultUrl as string)).blob();
      file = new File([blob], filename, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
      body.append("title", `${cfg.rusultDesc}, ${date.toDateString()}`);
      body.append("doc", blob, `${student?.full_name}.pdf`);

      const resp = await fetch(`/api/update-student`, { method: "POST", body });
      const data = await resp.json();

      if (data.success) {
        await db.student.update({
          where: { id: result?.student?.id as string },
          data: { remoteId: student?.id as any },
        });
        await db.result.update({
          where: { id: result?.id },
          data: { remoteId: student?.id as any, status: "uploaded" },
        });
      }

      return { data };
    } catch (err: any) {
      console.error(err);
      return fail(500, { error: err.code });
    }
  },
};