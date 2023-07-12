import { remoteLogin } from "$lib/utils";
import type { RequestEvent, RequestHandler } from "./$types";

export const GET = (async ({ params, fetch, request }: RequestEvent) => {
  try {
    let result: any;

    const token = await remoteLogin({
      email: "onosbrown.saved@gmail.com",
      password: "#1414bruno#",
    });

    const response = await fetch(`https://llacademy.ng/api/${params.route}/${params.id}`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) result = await response.json();
    // console.log({ result });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}) satisfies RequestHandler;

export const POST = (async ({ params, fetch, request }: RequestEvent) => {
  try {
    let result: any;
    const body = await request.formData();

    const token = await remoteLogin({
      email: "onosbrown.saved@gmail.com",
      password: "#1414bruno#",
    });

    const response = await fetch(`https://llacademy.ng/api/${params.route}/${params.id}`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body,
    });

    if (response.ok) result = await response.json();
    console.log({ result });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}) satisfies RequestHandler;
