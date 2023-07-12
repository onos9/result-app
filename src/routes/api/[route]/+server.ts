import { remoteLogin } from "$lib/utils";
import type { RequestEvent, RequestHandler } from "./$types";

export const GET = (async ({ params, fetch, url }: RequestEvent) => {
  try {
    let result: any;
    const token = await remoteLogin({
      email: "onosbrown.saved@gmail.com",
      password: "#1414bruno#",
    });

    const response = await fetch(`https://llacademy.ng/api/${params.route}${url.search}`, {
      headers: {
        Authorization: token,
      },
    });

    result = await response.json();
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

    const response = await fetch(`https://llacademy.ng/api/${params.route}`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body,
    });

    result = await response.json();
    // console.log({ result });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.log(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}) satisfies RequestHandler;
