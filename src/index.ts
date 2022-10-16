/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { v4 as uuidv4 } from 'uuid';

interface FileMetaData {
	filename: string,
	content_type: string,
	ttl: number,
}

export interface Env {
	KV_STORE: KVNamespace;
	FIBBIN_BUCKET: R2Bucket;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		switch (request.method) {
			case 'PUT':
				console.log("Handling PUT");
				const id = uuidv4();
				const formData = await request.formData();
				console.log(formData.keys());
				// await env.FIBBIN_BUCKET.put(key, request.body);
				break;
			case 'GET':
				console.log("Handling GET");
				const object = await env.FIBBIN_BUCKET.get(key);

				if (object === null) {
					return new Response('Object Not Found', {
						status: 404,
						headers: {
							'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD,POST,PUT',
							'Access-Control-Allow-Origin': '*'
						}
					});
				}

				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set('etag', object.httpEtag);
				headers.append('Content-Type', 'application/download');
				headers.append('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,POST,PUT');
				headers.append('Access-Control-Allow-Origin', '*');
				return new Response(object.body, {
					headers,
				});
			case 'OPTIONS':
				console.log("In OPTIONS Branch");
				return new Response(null, {
					status: 204,
					headers: {
						'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD,POST,PUT',
						'Access-Control-Allow-Origin': '*'
					}
				})
			default:
				console.log("Unsupported Method");
				return new Response(
					JSON.stringify({"error": `${request.method} is not allowed.`}), {
					status: 405,
					headers: {
						'Allow': 'OPTIONS,PUT,GET,HEAD,POST',
						'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD,POST,PUT',
						'Access-Control-Allow-Origin': '*'
					}
				})
		}

		console.log("Success");
		return new Response(JSON.stringify({"link": key}), {
			headers: {
				'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT',
				'Access-Control-Allow-Origin': '*'
			}
		});
	},
};
