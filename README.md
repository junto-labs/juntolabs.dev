# juntolabs.dev

The site served at https://juntolabs.dev, hosted on GitHub Pages from `site/`.

It serves the homepage and the blog. Junto's source is private, and the free Community Edition ships its binaries, docs and issues from https://github.com/junto-labs/junto, so download and install links on the site point there.

This repo stays public because GitHub Pages on the free plan needs a public repo.

## Pages

- `site/index.html` is the homepage. Styles are in `site/site.css`, scripts in `site/site.js`, and the GitHub icon and logo-system marks in `site/marks.svg`.
- When a tool ships, update its row in the Tools menu and its card in the roadmap: link it to its release on junto-labs/junto and replace its status with the release version. Add the tool's header and Tools menu entry to the blog pages too.
- To preview locally, run `python3 -m http.server -d site` and open http://localhost:8000.

## Writing a blog post

1. Copy `templates/blog-post.html` to `site/blog/<slug>/index.html` and replace the title, date, summary and body.
2. Add the post to the top of the list in `site/blog/index.html`, and remove the empty state when the first post goes up.

## Adding a Go module

No modules are listed right now, because `go install` can't reach a private repo. The mechanism stays in case a module becomes public.

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
