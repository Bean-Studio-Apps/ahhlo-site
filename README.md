# tinytriumphs-site

Public site hosting the **Privacy Policy**, **Terms of Use**, and **Support** page
for the Tiny Triumphs app. Served via GitHub Pages.

## Live URLs

- Landing: https://bean-studio-apps.github.io/tinytriumphs-site/
- Privacy: https://bean-studio-apps.github.io/tinytriumphs-site/privacy/
- Terms: https://bean-studio-apps.github.io/tinytriumphs-site/terms/
- Support: https://bean-studio-apps.github.io/tinytriumphs-site/support/

## Editing

Each page is a Markdown file at the repo root (`privacy.md`, `terms.md`,
`support.md`, `index.md`). Edit the content, commit, and push — GitHub Pages
rebuilds automatically, usually within a minute. The shared look lives in
`_layouts/default.html` and `assets/style.css`.

When you change a legal document, update the `Last updated:` date at the top of
that page.

## Local preview (optional)

Not required — pushing and checking the live URL is usually enough. If you want a
local preview you'll need Ruby + Bundler, then:

```bash
gem install bundler jekyll
jekyll serve   # http://localhost:4000/tinytriumphs-site/
```

## GitHub Pages setting

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder
`/ (root)`.

## Custom domain (future)

To move to a custom domain, add a `CNAME` file containing the domain, set
`baseurl: ""` in `_config.yml`, configure DNS, and update the URLs in the store
listings.
