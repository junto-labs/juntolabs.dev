# juntolabs.dev

The site served at https://juntolabs.dev, hosted on GitHub Pages from `site/`.

For now it only serves Go vanity import paths, so `go install juntolabs.dev/knowtorious/cmd/kt@latest` resolves to `github.com/junto-labs/knowtorious`. Docs, Helm charts and the Claude Code plugin marketplace can go here later (see RFC 0001).

## Adding a Go module

1. Add a line to `modules.txt`: the module path under `juntolabs.dev`, the repo URL, and any package dirs people install, e.g. `baton https://github.com/junto-labs/baton cmd/baton`.
2. Run `./generate.sh` and commit `site/`.

CI fails if `site/` is out of date with `modules.txt`.

## DNS

`juntolabs.dev` is on Cloudflare. The apex needs these records, set to DNS only (grey cloud) so GitHub can issue the HTTPS certificate:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `junto-labs.github.io` |

Go only fetches import paths over HTTPS, so **Enforce HTTPS** must be on in the repo's Pages settings.
