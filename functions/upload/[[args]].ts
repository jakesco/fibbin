// Contents of context object
// const {
//   request: Request, // same as existing Worker API
//   env: Env,
//   params, // if filename includes [id] or [[path]]
//   waitUntil, // same as ctx.waitUntil in existing Worker API
//   next, // used for middleware or to fetch assets
//   data, // arbitrary space for passing data between middlewares
// } = context;

import { v4 as uuidv4 } from 'uuid';

interface Env {
    BUCKET: R2Bucket;
}

function hours_to_ms(hours: number) {
    return hours * 60 * 60 * 1000;
}

// Expects https://example.com/{duration}/{filename} and a Readable stream as body.
export async function onRequestPost(context: any) {
    const env: Env = context.env;
    const request: Request = context.request

    const args = context.params.args.slice(0, 2);
    const duration = args[0];
    const name = args[1];
    const expires_in = Math.min(24, duration);

    const key = uuidv4();
    let now = new Date();
    const expires = new Date(now.getTime() + hours_to_ms(expires_in)).toISOString();

    const options: R2PutOptions = {
        httpMetadata: request.headers,
        customMetadata: {
            'name': name,
            'expires': expires,
        }
    }

    const status = await env.BUCKET.put(key, request.body, options)
        .then((response) => {return response;})
        .catch((error) => {console.error(error);});

    if (typeof status !== 'object') {
        return new Response(JSON.stringify({"error": "File upload failed."}), {
            status: 500
        });
    }
    return new Response(JSON.stringify({"url": key}));
}

export const onRequestPut = onRequestPost;
