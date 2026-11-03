# 2013 VW Beetle Turbo '60s Edition — sale site

Live at https://ajcadoo.github.io/beetle

## Editing

Everything you'll want to change is in the `window.SITE` block near the top of `index.html`:

| Setting | What it does |
|---|---|
| `price: 9500` | Shows "$9,500" in the hero. `null` shows `$[PRICE]`. |
| `sold: true` | Adds a red SOLD badge, strikes through the price, hides every Text button. |
| `priceDrop: { active: true, date: "Nov 20", oldPrice: 10500 }` | Shows "Price dropped on Nov 20. Was $10,500." |
| `phone` / `smsBody` | Number and prefilled message for every Text button. |

Copy lives directly in `index.html`. Flaw descriptions and photo captions are in `main.js`.

## Publishing a change

```bash
git commit -am "Update price" && git push
```

GitHub Pages redeploys in about a minute.

## Photos

`tools/build-images.py` rebuilds `img/` from `../Photos/2026_Sale/EXPORTS`:
`img/thumb` (800px WebP), `img/web` (2000px JPG), `img/full` (untouched originals).

## Preview locally

```bash
python3 -m http.server 8080
```
