interface Env {
    BUCKET: R2Bucket;
}

function html_bucket(id: string, name: string, expires: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="icon" href="data:,"> <!-- Ignore Favicon -->
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
  <script defer src="https://unpkg.com/alpinejs@3.10.4/dist/cdn.min.js"></script>

  <title>Fibbin | Bucket</title>
</head>

<body>
<main class="container">
  <hgroup>
    <h1>Fibbin bucket</h1>
    <h2>${id}</h2>
  </hgroup>
  <section>
      <a href="/"><- home</a>
  </section>
  <strong style="color: red;">This bucket will be deleted on <span x-data x-text="(new Date('${expires}')).toTimeString()"></span></strong>
  <article style="margin-top: 1rem;">
    <h2>${name}</h2>
    <a role="button" href="./${id}/download" download="${name}">Download</a>
  </article>
  </main>
</body>
</html>
`;
}

function html_404(id: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="icon" href="data:,"> <!-- Ignore Favicon -->
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
  <script defer src="https://unpkg.com/alpinejs@3.10.4/dist/cdn.min.js"></script>

  <title>Fibbin | 404</title>
</head>

<body>
<main class="container">
  <hgroup>
    <h1>404: Fibbin bucket not found</h1>
    <h2 style="color: red;">${id}</h2>
  </hgroup>
  <p>This bucket may have expired.</p>
  </main>
</body>
</html>
`;
}

export async function onRequestGet(context: any) {
    const key = context.params.id;
    const env: Env = context.env;
    const file_meta: R2Object | null = await env.BUCKET.head(key);

    if (file_meta === null) {
        return new Response(html_404(key), {
            status: 404,
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
            },
        });
    }

    const {name, expires} = file_meta.customMetadata;

    const html = html_bucket(key, name, expires);
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
        },
    });
}
