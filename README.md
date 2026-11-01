# juntolabs.dev

The site served at https://juntolabs.dev, hosted on GitHub Pages from `site/`.

It serves the homepage, the blog, and Go vanity import paths, so `go install juntolabs.dev/knowtorious/cmd/kt@latest` resolves to `github.com/junto-labs/knowtorious`. Docs, Helm charts and the Claude Code plugin marketplace can go here later.

## Pages

- `site/index.html` is the homepage. Styles are in `site/site.css`, scripts in `site/site.js`, and the GitHub icon and logo-system marks in `site/marks.svg`.
- When a tool ships, update its row in the Tools menu and its card in the roadmap: make it a link and replace its status with the release version. Add the tool's header and Tools menu entry to the blog pages too.
- To preview locally, run `python3 -m http.server -d site` and open http://localhost:8000.

## Writing a blog post

1. Copy `templates/blog-post.html` to `site/blog/<slug>/index.html` and replace the title, date, summary and body.
2. Add the post to the top of the list in `site/blog/index.html`, and remove the empty state when the first post goes up.

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
