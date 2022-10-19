export interface Env {
    BUCKET: R2Bucket;
}

function html_deleted(id: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="icon" href="data:,"> <!-- Ignore Favicon -->
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
  <script defer src="https://unpkg.com/alpinejs@3.10.4/dist/cdn.min.js"></script>

  <title>Fibbin | Bucket deleted</title>
</head>

<body>
<main class="container">
  <hgroup>
    <h1>Fibbin bucket has been deleted</h1>
    <h2 style="color: red;">${id}</h2>
  </hgroup>
  <section>
      <a href="/"><- home</a>
  </section>
  </main>
</body>
</html>
`;
}

export async function onRequestGet(context: any) {
    const env: Env = context.env;
    const key = context.params.id;

    await env.BUCKET.delete(key);

    return new Response(html_deleted(key), {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
        },
    });
}
