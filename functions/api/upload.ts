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

interface env {
    BUCKET: R2Bucket;
}

function hours_to_ms(hours: number) {
    return hours * 60 * 60 * 1000;
}

export async function onRequestPost(context: any) {
    const env: env = context.env;

    const formData = await context.request.formData();
    const file = formData.get('file');

    const key = uuidv4();
    let now = new Date();
    const expires = new Date(now.getTime() + hours_to_ms(1)).toISOString();
    const options: R2PutOptions = {
        customMetadata: {
            'name': file.name,
            'expires': expires,
        }
    }
    console.log("Meta: ", options);

    await env.BUCKET.put(key, file, options);
    return new Response(JSON.stringify({"url": key}));
}

export const onRequestPut = onRequestPost;
