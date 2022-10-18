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

export async function onRequestPost(context: any) {
    const env: Env = context.env;

    const formData = await context.request.formData();
    const expires_in = Math.min(24, formData.get('expires'));
    const file = formData.get('file');

    const key = uuidv4();
    let now = new Date();
    const expires = new Date(now.getTime() + hours_to_ms(expires_in)).toISOString();
    const options: R2PutOptions = {
        customMetadata: {
            'name': file.name,
            'expires': expires,
        }
    }

    const status = await env.BUCKET.put(key, file, options)
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
