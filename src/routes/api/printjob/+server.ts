import { loadRemoteStudents } from "$lib/utils";
import type { Result } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import type { RequestEvent, RequestHandler } from "./$types";

export const POST = (async ({ locals, request, fetch }: RequestEvent) => {
  const { dataUrl, id, remoteId, mimeType } = await request.json();
  const blob = await(await fetch(dataUrl)).blob();

  const student = await db.student.findUnique({
    where: { id },
    include: { result: true },
  });

  const filename = `${student?.fullName?.toUpperCase()}.pdf`;
  const file = new File([blob], filename, {
    type: mimeType,
    lastModified: new Date().getTime(),
  });
  const ab = await file.arrayBuffer();

  let dir = `static/uploads`;
  const resultUrl = `uploads/${filename}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/${filename}`, Buffer.from(ab));

  const term = locals.configs.find((cfg) => cfg.key == "term");
  const res = student?.result.find(
    (res) => res.studentId == id && res.term == term?.value
  ) as Result;
  
  const data = await db.result.update({
    where: { id: res.id },
    data: { resultUrl, remoteId: remoteId },
  });

  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}) satisfies RequestHandler;

export const GET = (async ({ locals, request, fetch, url }: RequestEvent) => {
  try {
    const { data } = await loadRemoteStudents();

    return new Response(JSON.stringify({ ...data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}) satisfies RequestHandler;
