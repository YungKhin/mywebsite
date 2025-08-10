# BizFinder (static site)

A simple, modern website with:
- Homepage with search bar and categories
- Listings page showing all businesses
- Search results page showing relevant businesses

## Run locally

From the repository root:

```bash
# Option 1: Python http server
cd site
python3 -m http.server 5500
# then open http://localhost:5500/index.html

# Option 2: Node http-server (if installed)
# npx http-server -p 5500 site
```

No build step is required. All data is in `site/assets/js/data.js` and can be edited directly.