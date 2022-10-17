import { v4 as uuidv4 } from 'uuid';

interface FileMetaData {
	filename: string,
	content_type: string,
	ttl: number,
}

export interface Env {
	KV_FIBBIN: KVNamespace;
	R2_FIBBIN: R2Bucket;
}

export async function onRequest(context: any) {
  // Contents of context object
  const {
    request: Request, // same as existing Worker API
    env: Env,
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  return new Response("Hello, world!");
}
