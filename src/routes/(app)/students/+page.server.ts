import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit";
import type { Student, Prisma } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import { customAlphabet } from "nanoid";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.arm) throw redirect(302, "/settings");
  
  return {
    students: await db.student.findMany({
      where: { userId: locals.user?.id },
      include: { Class: true },
    }),
    classes: await db.class.findMany({ where: { arm: locals.user?.arm } as any }),
    user: locals.user,
  };
};

export const actions: Actions = {
  create: async ({ request, url, locals }) => {
    const id = url.searchParams.get("id");
    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    const data = Object.fromEntries(formData);
    let fullName = formData.get("fullName") as string;
    let avatarUrl = "";
    let dir = `static/uploads`;
    let year = new Date().getFullYear().toString().substring(2);
    let nanoid = customAlphabet("0123456789", 4);
    let admissionNo = data.admissionNo + "/" + "01" + year + "-" + nanoid();

    try {
      if (file) {
        let ext = file.name.split(".").pop();
        let name = fullName?.toLowerCase().trim().replace(" ", "_");
        let filename = name + "_" + Date.now().toString() + "." + ext;
        let ab = await file.arrayBuffer();

        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/${filename}`, Buffer.from(ab));
        avatarUrl = `uploads/${filename}`;
      }
      delete data.avatar;
      let student:Student
      if (id) {
        student = await db.student.update({
           where:{id},
           data: {
             ...data,
             avatarUrl,
             admissionNo,
           } as Prisma.StudentCreateInput,
         });
      }
      student = await db.student.create({
        data: {
          ...data,
          avatarUrl,
          admissionNo,
        } as Prisma.StudentCreateInput,
      });
      return { student };
    } catch (err: any) {
      console.error(err);
      return fail(500, { message: err.message });
    }

    return {
      status: 201,
    };
  },

  delete: async ({ url }) => {
    const id = url.searchParams.get("id");
    if (!id) {
      return fail(400, { message: "Invalid request" });
    }

    try {
      await db.student.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: "Something went wrong deleting your student",
      });
    }

    return {
      status: 200,
    };
  },
};
