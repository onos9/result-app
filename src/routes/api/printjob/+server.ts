import type { RequestEvent, RequestHandler } from "./$types";
import { loadRemoteStudents } from "$lib/utils";
import { error } from "@sveltejs/kit";

export const POST = (async ({ locals, request, fetch }: RequestEvent) => {
  const { result, studentId, mimeType } = await request.json();
  const blob = await (await fetch(result)).blob();
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: { result: true },
  });
  const admissionNo = student?.admissionNo?.split("/")[0];

  let cfgEntries = locals?.configs?.map((cfg: any) => [cfg.key, cfg.value]);
  let cfg = Object.fromEntries(cfgEntries);

  let response = await fetch(`https://llacademy.ng/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: "onosbrown.saved@gmail.com",
      password: "#1414bruno#",
    }),
  });

  const { data } = await response.json();
  const formData = new FormData();
  const date = new Date(cfg.resumptionDate);
  formData.append("title", `${cfg.rusultDesc}, ${date.toDateString()}`);
  formData.append("doc", blob, `${studentId}.pdf);`)
  // console.log(data.token);

  response = await fetch(`https://llacademy.ng/api/student-documents/${admissionNo}`, {
    method: "POST",
    headers: {
      Authorization: data.token,
    },
    body: formData,
  });

  if (response.ok) {
    const result = student?.result?.find(
      (result) =>
        result?.studentId == studentId &&
        result.term == cfg.term &&
        result.academicYear == cfg.academicYear
    );

    db.result.update({
      where: { id: result?.id },
      data: { status: "uploaded" },
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}) satisfies RequestHandler;

export const GET = (async ({ locals, request, fetch }: RequestEvent) => {
  try {
    const { data } = await loadRemoteStudents();
    return new Response(JSON.stringify({ ...data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}) satisfies RequestHandler;
