import type { RequestHandler } from "./$types";

export const POST = (async ({ params, request }) => {
  const data = await request.json();
  const { id } = params;
  const result = await db.result.update({ where: { id }, data });

  return new Response(JSON.stringify({ result }), { status: 200 });
}) satisfies RequestHandler;
