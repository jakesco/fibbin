# Fibbin'

Temporary file sharing platform.

Upload a file and get a temporary link to share with anyone.
Fibbin is built on cloudflare pages and R2.

## Development

This project relies on `vite` for static asset generation,
and `wrangler` for cloudflare worker development.

To get started, run `npm install` in the root directory.

You can run `npm run workers` to start the cloudflare workers in development mode.

Point your browser to `http://localhost:8788` to interact with the app.

> Hint: Use `wrangler whoami` to get your account ID.

## Fibbin Clean Up

> Note: Building submodules fails on cloudflare pages.
> I'm removing the submodule for now until this issue is resolved.
> In the meantime, you can deploy the fibbin-cleanup worker separately.

This project uses a scheduled worker to clean up expired R2 files.
The worker is in the `cron` module from
[fibbin-cleanup](https://github.com/jakesco/fibbin-cleanup) and must be deployed separately.

Clone with `git clone --recurse-submodules <fibbin-repo-url>` to work on the cron function.

If you've already cloned the repository you can run:
```bash
$ git submodule init
$ git submodule update
```
to pull the latest `fibbin-cleaup` code.
