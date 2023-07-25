import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Class, Prisma, Rating, Record, Remark, Result, Student } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { Pupils } from "$lib/data/pupils";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");

  let { name, section } = locals.user.class as Class;
  name = name?.toUpperCase().trim() as string;
  section = section?.toUpperCase().trim() as string;

  const classId = locals?.user?.class?.id;
  const local_students = () =>
    db.student.findMany({
      where: { classId },
      include: { Class: true },
    });

  const grades = () => db.grade.findMany({ where: { arm: locals.user?.arm } });

  const results = () =>
    db.result.findMany({
      where: { classId },
      include: { records: true, ratings: true, remarks: true, scores: true, student: true },
    });

  let subjects = () => db.subject.findMany({ where: { arm: locals?.user?.arm } as any });
  if (locals.user.arm == "eyfs")
    subjects = () =>
      db.subject.findMany({
        where: { arm: locals?.user?.arm, classId: locals?.user?.classId } as any,
      });

  const classes = () =>
    db.class.findMany({
      where: { arm: locals.user?.arm } as any,
    });

  const resp = await fetch("/student-list.json");
  const { data } = await resp.json();

  const rStudents = data.students.filter(
    (std: any) => std.class_name == name && std.section_name == section
  );

  return {
    students: await local_students(),
    rStudents,
    grades: await grades(),
    results: await results(),
    subjects: await subjects(),
    classes: await classes(),
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
    let file = formData.get("student_photo") as File;
    formData.delete("student_photo");

    const data = Object.fromEntries(formData) as any;
    const student = Pupils.find((std) => std.id == data?.remoteId);
    const name = student?.full_name?.toLowerCase().trim().replace(" ", "_");
    const ext = file.name.split(".").pop();
    const filename = name + "_" + Date.now().toString() + "." + ext;

    try {
      if (file.size) {
        const dir = `static/uploads`;
        const ab = await file.arrayBuffer();
        data.avatarUrl = `uploads/${filename}`;
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/${filename}`, Buffer.from(ab));
      }

      data.admissionNo = `${data.admissionNo.split("-")[1].replace(/^0+/, "")}/${
        data.admissionNo
      }`;
      console.log({ id, data });
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
