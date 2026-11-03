(() => {
  "use strict";
  const SITE = window.SITE || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Photo data (numeric order = lightbox order) ---------- */
  const P = [
    ["01-hero-front-angle-top-down", "Front three-quarter, top down"],
    ["02-front-angle-top-up", "Front three-quarter, top up"],
    ["03-front-angle-passenger-side-top-down", "Passenger-side front, top down"],
    ["04-front-top-down", "Straight on, top down"],
    ["05-rear-angle-driver-side-top-down", "Driver-side rear, top down"],
    ["06-rear-angle-passenger-side-top-down", "Passenger-side rear, top down"],
    ["07-rear-top-down", "Rear, top down"],
    ["08-front-angle-passenger-side-top-up", "Passenger-side front, top up"],
    ["09-front-top-up", "Straight on, top up"],
    ["10-side-driver-top-up", "Driver side profile"],
    ["11-side-passenger-top-up", "Passenger side profile"],
    ["12-rear-angle-driver-side-top-up", "Driver-side rear, top up"],
    ["13-rear-angle-passenger-side-top-up", "Passenger-side rear, top up"],
    ["14-rear-top-up", "Rear, top up"],
    ["15-front-angle-lights-on-sunset", "Lights on at sunset"],
    ["16-interior-dash-wide", "Dash, wide"],
    ["17-interior-driver-seat", "Driver seat"],
    ["18-interior-front-seats", "Front seats"],
    ["19-interior-passenger-side", "Passenger side"],
    ["20-interior-rear-seats-1", "Rear seats"],
    ["21-interior-rear-seats-2", "Rear seats, other side"],
    ["22-odometer", "Odometer"],
    ["23-dash-gauges-oil-boost", "Oil temp, clock and boost gauges"],
    ["24-radio-center-stack", "Radio"],
    ["25-climate-controls", "Climate controls"],
    ["26-dsg-shifter", "DSG shifter"],
    ["27-overhead-lights", "Overhead lights"],
    ["28-engine-bay", "Engine bay"],
    ["29-trunk-open", "Trunk"],
    ["30-trunk-inside", "Inside the trunk"],
    ["31-soft-top-driver-side", "Soft top, driver side"],
    ["32-soft-top-passenger-side", "Soft top, passenger side"],
    ["33-wheel-front-passenger", "Front passenger wheel"],
    ["34-wheel-rear-passenger", "Rear passenger wheel"],
    ["35-wheel-rear-driver", "Rear driver wheel"],
    ["36-wheel-front-driver", "Front driver wheel"],
    ["37-flaw-front-bumper-paint", "Front bumper paint"],
    ["38-flaw-headlight-haze", "Headlight haze"],
    ["39-flaw-front-fender-chip", "Front fender"],
    ["40-flaw-dent-by-door", "Dent behind the door"],
    ["41-flaw-lower-door-crease", "Rocker panel crease"],
    ["42-flaw-soft-top-wear", "Soft top wear"],
  ].map(([file, cap], i) => ({
    i, file, cap,
    thumb: `img/thumb/${file}.webp`,
    web: `img/web/${file}.jpg`,
    full: `img/full/${file}.jpg`,
  }));
  const byNum = n => P[n - 1];

  const FLAW_TEXT = {
    37: "Paint is peeling along the lower front bumper below the fog light, and that fog light lens is cracked.",
    38: "One headlight lens is cloudy, with some condensation inside.",
    39: "A small chip and a slightly uneven gap where the front fender meets the bumper.",
    40: "A shallow dent in the rear fender, just behind the door. The paint looks intact.",
    41: "A crease and some scuffs along the rocker panel below the door, just ahead of the rear wheel.",
    42: "The fabric shows fading, fold marks and a few light scuffs from years of opening and closing.",
  };

  /* ---------- Render gallery ---------- */
  const SIZES = "(min-width: 1100px) 360px, (min-width: 760px) 33vw, 50vw";
  function card(p, sizes = SIZES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card";
    b.dataset.i = p.i;
    b.innerHTML = `<img loading="lazy" decoding="async" width="800" height="600" alt="${p.cap}"
      src="${p.thumb}" srcset="${p.thumb} 800w, ${p.web} 2000w" sizes="${sizes}"><span class="cap">${p.cap}</span>`;
    return b;
  }
  function fill(group, nums, sizes) {
    const el = $(`[data-group="${group}"]`);
    nums.forEach(n => el.appendChild(card(byNum(n), sizes)));
    return el;
  }

  // Exterior: pairs swap with the top toggle
  const PAIRS = [[1, 2], [3, 8], [4, 9], [5, 12], [6, 13], [7, 14]];
  const ext = $('[data-group="exterior"]');
  PAIRS.forEach(([down, up], k) => {
    const c = card(byNum(down), k === 0 ? "(min-width: 1100px) 730px, (min-width: 760px) 66vw, 50vw" : SIZES);
    c.dataset.down = down;
    c.dataset.up = up;
    ext.appendChild(c);
  });
  [10, 11, 15].forEach(n => ext.appendChild(card(byNum(n))));

  fill("interior", [16, 17, 18, 19, 20, 21, 27]);
  fill("details", [22, 23, 24, 25, 26, 28, 29, 30, 31, 32], "(min-width: 900px) 25vw, (min-width: 560px) 33vw, 50vw");
  fill("wheels", [33, 34, 35, 36], "(min-width: 900px) 25vw, (min-width: 560px) 33vw, 50vw");

  const flaws = $('[data-group="flaws"]');
  [37, 38, 39, 40, 41, 42].forEach(n => {
    const p = byNum(n);
    const art = document.createElement("article");
    art.className = "flaw";
    const c = card(p, "(min-width: 960px) 340px, (min-width: 640px) 50vw, 100vw");
    c.querySelector(".cap").remove();
    art.appendChild(c);
    art.insertAdjacentHTML("beforeend", `<div class="flaw-body"><h3>${p.cap}</h3><p>${FLAW_TEXT[n]}</p></div>`);
    flaws.appendChild(art);
  });

  /* ---------- Top toggle ---------- */
  const toggle = $(".toggle");
  toggle.dataset.state = "down";
  function setTop(state) {
    if (toggle.dataset.state === state) return;
    toggle.dataset.state = state;
    $$(".toggle-btn", toggle).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.top === state)));
    $$("[data-down]", ext).forEach(c => {
      const p = byNum(+c.dataset[state]);
      const img = c.querySelector("img");
      c.classList.add("swapping");
      setTimeout(() => {
        img.onload = () => c.classList.remove("swapping");
        img.srcset = `${p.thumb} 800w, ${p.web} 2000w`;
        img.src = p.thumb;
        img.alt = p.cap;
        c.querySelector(".cap").textContent = p.cap;
        c.dataset.i = p.i;
        if (img.complete) c.classList.remove("swapping");
      }, 180);
    });
  }
  $$(".toggle-btn", toggle).forEach(b => b.addEventListener("click", () => setTop(b.dataset.top)));
  // Warm the cache for the "top up" thumbs so the swap is instant
  const warm = () => PAIRS.forEach(([, up]) => { new Image().src = byNum(up).thumb; });
  ("requestIdleCallback" in window) ? requestIdleCallback(warm) : setTimeout(warm, 1500);

  /* ---------- Config: price, sold, price drop, SMS ---------- */
  const money = n => "$" + Number(n).toLocaleString("en-US");
  if (SITE.price != null) $$("[data-price]").forEach(el => (el.textContent = money(SITE.price)));
  if (SITE.sold) document.body.classList.add("is-sold");
  const drop = SITE.priceDrop || {};
  if (drop.active && drop.oldPrice) {
    const el = $("[data-price-drop]");
    el.textContent = `Price dropped${drop.date ? " on " + drop.date : ""}. Was ${money(drop.oldPrice)}.`;
    el.hidden = false;
  }
  const digits = String(SITE.phone || "").replace(/\D/g, "");
  const e164 = digits.length === 10 ? "+1" + digits : "+" + digits;
  const sms = `sms:${e164}?&body=${encodeURIComponent(SITE.smsBody || "")}`;
  $$("[data-sms]").forEach(a => (a.href = sms));
  $$("[data-phone]").forEach(s => (s.textContent = SITE.phone));

  /* ---------- Sticky CTA ---------- */
  const sticky = $(".sticky-cta");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => sticky.classList.toggle("show", !e.isIntersecting), { threshold: 0.15 })
      .observe($(".hero"));
  }

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), stage = $("#lb-stage"), img = $("#lb-img");
  const cap = $("#lb-cap"), count = $("#lb-count"), spin = $("#lb-spin");
  const zoomBtn = $("#lb-zoom"), dl = $("#lb-dl");
  let cur = 0, zoomed = false, lastFocus = null, loadToken = 0;

  function show(i) {
    cur = (i + P.length) % P.length;
    const p = P[cur];
    setZoom(false, null, true);
    img.style.opacity = ".35";
    const tok = ++loadToken;
    const pre = new Image();
    pre.onload = () => { if (tok === loadToken) { img.src = p.web; img.style.opacity = "1"; } };
    pre.src = p.web;
    if (pre.complete) { img.src = p.web; img.style.opacity = "1"; }
    img.alt = p.cap;
    cap.textContent = p.cap;
    count.textContent = `${cur + 1} / ${P.length}`;
    dl.href = p.full;
    dl.setAttribute("download", `beetle-${p.file}.jpg`);
    [cur - 1, cur + 1].forEach(j => { new Image().src = P[(j + P.length) % P.length].web; });
  }
  function open(i) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.documentElement.style.overflow = "hidden";
    show(i);
    $("#lb-close").focus();
  }
  function close() {
    setZoom(false, null, true);
    lb.hidden = true;
    document.documentElement.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  // fx, fy: point (0..1) of the image to center on when zooming in
  function setZoom(on, pt, silent) {
    if (on === zoomed) return;
    const p = P[cur];
    if (!on) {
      zoomed = false;
      loadToken++;
      spin.hidden = true;
      stage.classList.remove("zoomed");
      lb.classList.remove("is-zoomed");
      zoomBtn.setAttribute("aria-pressed", "false");
      zoomBtn.textContent = "100%";
      if (!silent) img.src = p.web;
      return;
    }
    zoomed = true;
    zoomBtn.setAttribute("aria-pressed", "true");
    zoomBtn.textContent = "Fit";
    lb.classList.add("is-zoomed");
    spin.hidden = false;
    const tok = ++loadToken;
    const full = new Image();
    full.onload = () => {
      if (tok !== loadToken) return;
      spin.hidden = true;
      img.src = p.full;
      stage.classList.add("zoomed");
      const [fx, fy] = pt || [0.5, 0.5];
      requestAnimationFrame(() => {
        stage.scrollLeft = fx * img.naturalWidth - stage.clientWidth / 2;
        stage.scrollTop = fy * img.naturalHeight - stage.clientHeight / 2;
      });
    };
    full.onerror = () => { if (tok === loadToken) setZoom(false); };
    full.src = p.full;
  }
  // Map a click to a point on the picture itself (object-fit: contain leaves letterbox bars)
  function pointOnImage(e) {
    const r = img.getBoundingClientRect();
    const s = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    const x = r.left + (r.width - w) / 2, y = r.top + (r.height - h) / 2;
    const clamp = v => Math.min(1, Math.max(0, v));
    return [clamp((e.clientX - x) / w), clamp((e.clientY - y) / h)];
  }

  document.addEventListener("click", e => {
    const c = e.target.closest(".card");
    if (c) open(+c.dataset.i);
  });
  $("#lb-close").addEventListener("click", close);
  $("#lb-prev").addEventListener("click", () => show(cur - 1));
  $("#lb-next").addEventListener("click", () => show(cur + 1));
  zoomBtn.addEventListener("click", () => setZoom(!zoomed));

  // Pointer handling: swipe to navigate, tap to zoom, drag to pan
  let down = null;
  stage.addEventListener("pointerdown", e => {
    down = { x: e.clientX, y: e.clientY, sl: stage.scrollLeft, st: stage.scrollTop, type: e.pointerType, moved: false };
    if (zoomed && e.pointerType === "mouse") { stage.classList.add("dragging"); stage.setPointerCapture(e.pointerId); }
  });
  stage.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) down.moved = true;
    if (zoomed && down.type === "mouse") {
      stage.scrollLeft = down.sl - dx;
      stage.scrollTop = down.st - dy;
    }
  });
  stage.addEventListener("pointerup", e => {
    if (!down) return;
    const d = down; down = null;
    stage.classList.remove("dragging");
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (zoomed) { if (!d.moved) setZoom(false); return; }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { show(cur + (dx < 0 ? 1 : -1)); return; }
    if (d.moved) return;
    if (e.target === img) setZoom(true, pointOnImage(e));
    else close();
  });
  stage.addEventListener("pointercancel", () => { down = null; stage.classList.remove("dragging"); });

  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") { zoomed ? setZoom(false) : close(); }
    else if (e.key === "ArrowRight" && !zoomed) show(cur + 1);
    else if (e.key === "ArrowLeft" && !zoomed) show(cur - 1);
    else if (e.key === "z" || e.key === "Z") setZoom(!zoomed);
  });
})();
