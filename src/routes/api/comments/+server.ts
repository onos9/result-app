import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
  const comments = await db.comment.findMany();

  return new Response(JSON.stringify({ comments }), { status: 200});
}) satisfies RequestHandler;
