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

interface FileMetadata {
    created_at: Date;
    expires: Date;
    name: string;
    type: string;
    size: number;
}

interface env {
    STORE: KVNamespace;
    BUCKET: R2Bucket;
}

export async function onRequestPost(context: any) {
    const env: env = context.env;

    const formData = await context.request.formData();
    const file = formData.get('file');

    let now = new Date();

    const key = uuidv4();
    const meta_data: FileMetadata = {
        created_at: now,
        expires: new Date(now.getTime() + 6 * 60 * 60 * 1000),
        name: file.name,
        type: file.type,
        size: file.size
    };
    const value = JSON.stringify(meta_data);
    console.log(value);

    await env.STORE.put(key, value);
    await env.BUCKET.put(key, file);

    return new Response(JSON.stringify({"url": key}));
}

export const onRequestPut = onRequestPost;
