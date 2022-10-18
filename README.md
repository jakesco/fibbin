# Fibbin'

Temporary file sharing.

## Development

This project uses a scheduled worker to cleanup expired R2 files.
This worker is in the `fibbin-cleanup` module and must be deployed separately.

Clone with `git clone --recurse-submodules <url>` to work on the cron function.

If you've already cloned the repository you can run:
```bash
$ git submodule init
$ git submodule update
```
to pull the latest `fibbin-cleaup` code.

Cloudflare workers are managed using `wrangler`.

Use `wrangler whoami` to get your account ID.

Use `npm run preview` to enable testing workers.


