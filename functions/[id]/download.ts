export interface Env {
	BUCKET: R2Bucket;
}

export async function onRequestGet(context: any) {
    const env: Env = context.env;
    const key = context.params.id;

    const object: R2ObjectBody | null = await env.BUCKET.get(key);

    if (object === null) {
        return new Response('Object Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new Response(object.body, { headers });
}
