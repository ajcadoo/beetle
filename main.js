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

  /* ---------- Lightbox ----------
     The image element is sized to its "fit" box, then moved with
     translate() + scale(). Pinch, double-tap, drag, swipe, trackpad pinch
     and the 100% button all drive the same view state. Once you zoom
     past ~1.25x the untouched original is swapped in for full detail. */
  const lb = $("#lightbox"), stage = $("#lb-stage"), img = $("#lb-img");
  const cap = $("#lb-cap"), count = $("#lb-count"), spin = $("#lb-spin");
  const zoomBtn = $("#lb-zoom"), dl = $("#lb-dl");
  const PAD = 12;
  let cur = 0, lastFocus = null, loadToken = 0;
  const v = { W: 0, H: 0, fw: 0, fh: 0, ox: 0, oy: 0, s: 1, tx: 0, ty: 0, ar: 4 / 3, fullW: 5168, hires: false };

  function layout() {
    const r = stage.getBoundingClientRect();
    v.W = r.width; v.H = r.height;
    const maxW = Math.max(1, v.W - PAD * 2), maxH = Math.max(1, v.H);
    if (maxW / maxH > v.ar) { v.fh = maxH; v.fw = maxH * v.ar; } else { v.fw = maxW; v.fh = maxW / v.ar; }
    v.ox = (v.W - v.fw) / 2; v.oy = (v.H - v.fh) / 2;
    Object.assign(img.style, { left: v.ox + "px", top: v.oy + "px", width: v.fw + "px", height: v.fh + "px" });
  }
  // 100% = one original pixel per CSS pixel
  const maxScale = () => Math.max(2, v.fullW / v.fw);
  const zoomedIn = () => v.s > 1.01;

  // Keep the picture covering the stage when bigger than it, centered when smaller
  function clampT(s, tx, ty) {
    const sw = v.fw * s, sh = v.fh * s;
    tx = sw <= v.W ? (v.W - sw) / 2 - v.ox : Math.min(-v.ox, Math.max(v.W - sw - v.ox, tx));
    ty = sh <= v.H ? (v.H - sh) / 2 - v.oy : Math.min(-v.oy, Math.max(v.H - sh - v.oy, ty));
    return [tx, ty];
  }
  function apply(animate) {
    img.classList.toggle("anim", !!animate);
    img.style.transform = `translate(${v.tx}px, ${v.ty}px) scale(${v.s})`;
    const z = zoomedIn();
    lb.classList.toggle("is-zoomed", z);
    zoomBtn.setAttribute("aria-pressed", String(z));
    zoomBtn.textContent = z ? "Fit" : "100%";
    if (v.s > 1.25) loadFull();
  }
  // Zoom to scale s, keeping the stage point (px, py) under the same spot of the picture
  function zoomAt(s, px, py, animate) {
    const u = (px - v.ox - v.tx) / v.s, w = (py - v.oy - v.ty) / v.s;
    v.s = s;
    [v.tx, v.ty] = clampT(s, px - v.ox - u * s, py - v.oy - w * s);
    apply(animate);
  }
  function reset(animate) { v.s = 1; v.tx = 0; v.ty = 0; apply(animate); }
  function settle() {
    if (v.s <= 1.01) return reset(true);
    const mx = maxScale();
    if (v.s > mx) return zoomAt(mx, v.W / 2, v.H / 2, true);
    [v.tx, v.ty] = clampT(v.s, v.tx, v.ty);
    apply(true);
  }
  function loadFull() {
    if (v.hires) return;
    v.hires = true;
    const p = P[cur], tok = loadToken;
    spin.hidden = false;
    const full = new Image();
    full.onload = () => {
      if (tok !== loadToken) return;
      spin.hidden = true;
      v.fullW = full.naturalWidth;
      img.src = p.full;
    };
    full.onerror = () => { if (tok === loadToken) spin.hidden = true; };
    full.src = p.full;
  }

  function show(i) {
    cur = (i + P.length) % P.length;
    const p = P[cur], tok = ++loadToken;
    v.hires = false;
    spin.hidden = true;
    reset(false);
    img.style.opacity = ".35";
    const pre = new Image();
    pre.onload = () => {
      if (tok !== loadToken) return;
      v.ar = pre.naturalWidth / pre.naturalHeight;
      layout();
      reset(false);
      img.src = p.web;
      img.style.opacity = "1";
    };
    pre.src = p.web;
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
    layout();
    show(i);
    $("#lb-close").focus();
  }
  function close() {
    loadToken++;
    reset(false);
    lb.hidden = true;
    document.documentElement.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  document.addEventListener("click", e => {
    const c = e.target.closest(".card");
    if (c) open(+c.dataset.i);
  });
  $("#lb-close").addEventListener("click", close);
  $("#lb-prev").addEventListener("click", () => show(cur - 1));
  $("#lb-next").addEventListener("click", () => show(cur + 1));
  zoomBtn.addEventListener("click", () => zoomedIn() ? reset(true) : zoomAt(maxScale(), v.W / 2, v.H / 2, true));
  window.addEventListener("resize", () => { if (!lb.hidden) { layout(); reset(false); } });

  /* ----- Gestures ----- */
  const pts = new Map();          // active pointers -> [x, y] in stage coords
  let g = null;                   // current gesture baseline
  let pinched = false;            // any pinch since the first finger went down
  let lastTap = 0, tapTimer = 0;
  const stagePt = e => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

  function baseline() {
    const arr = [...pts.values()];
    if (arr.length >= 2) {
      pinched = true;
      g = { type: "pinch", d: dist(arr[0], arr[1]) || 1, mid: midpoint(arr[0], arr[1]), s: v.s, tx: v.tx, ty: v.ty };
    } else if (arr.length === 1) {
      g = { type: "pan", p: arr[0], tx: v.tx, ty: v.ty, tap: false };
    } else g = null;
  }

  stage.addEventListener("dragstart", e => e.preventDefault());
  stage.addEventListener("pointerdown", e => {
    e.preventDefault();
    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    const first = pts.size === 0;
    if (first) pinched = false;
    pts.set(e.pointerId, stagePt(e));
    img.classList.remove("anim");
    baseline();
    if (first) Object.assign(g, { tap: true, start: pts.get(e.pointerId), kind: e.pointerType, onImg: e.target === img });
  });

  stage.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId) || !g) return;
    pts.set(e.pointerId, stagePt(e));
    if (g.type === "pinch" && pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const mid = midpoint(a, b);
      const s = Math.min(maxScale() * 1.3, Math.max(0.6, g.s * dist(a, b) / g.d));
      const u = (g.mid[0] - v.ox - g.tx) / g.s, w = (g.mid[1] - v.oy - g.ty) / g.s;
      v.s = s;
      v.tx = mid[0] - v.ox - u * s;
      v.ty = mid[1] - v.oy - w * s;
      apply(false);
    } else if (g.type === "pan") {
      const p = pts.get(e.pointerId), dx = p[0] - g.p[0], dy = p[1] - g.p[1];
      if (Math.hypot(dx, dy) > 8) g.tap = false;
      if (g.tap) return;
      if (zoomedIn()) {
        // Pan, with a little rubber band past the edges
        const tx = g.tx + dx, ty = g.ty + dy, [cx, cy] = clampT(v.s, tx, ty);
        v.tx = cx + (tx - cx) * 0.35;
        v.ty = cy + (ty - cy) * 0.35;
      } else if (!pinched) {
        v.tx = dx; // swipe preview
        v.ty = 0;
      }
      apply(false);
    }
  });

  function onTap(t) {
    const [px, py] = t.start;
    if (t.kind === "mouse") {
      if (zoomedIn()) reset(true);
      else if (t.onImg) zoomAt(maxScale(), px, py, true);
      else close();
      return;
    }
    const now = performance.now();
    if (now - lastTap < 300) {                       // double-tap
      lastTap = 0;
      clearTimeout(tapTimer);
      zoomedIn() ? reset(true) : zoomAt(Math.min(3, maxScale()), px, py, true);
      return;
    }
    lastTap = now;
    if (!t.onImg && !zoomedIn()) tapTimer = setTimeout(close, 300); // tap the backdrop to close
  }

  function onUp(e) {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    const was = g;
    if (pts.size > 0) { baseline(); return; } // pinch -> one finger: re-baseline so nothing jumps
    g = null;
    if (!was) return;
    if (e.type === "pointercancel") return settle();
    if (was.type === "pan" && was.tap && !pinched) return onTap(was);
    if (was.type === "pan" && !pinched && !zoomedIn() && Math.abs(v.tx) > 60) return show(cur + (v.tx < 0 ? 1 : -1));
    settle();
  }
  stage.addEventListener("pointerup", onUp);
  stage.addEventListener("pointercancel", onUp);

  // Trackpad pinch (ctrl+wheel) zooms; two-finger scroll pans when zoomed
  stage.addEventListener("wheel", e => {
    e.preventDefault();
    const [px, py] = stagePt(e);
    if (e.ctrlKey) {
      const s = Math.min(maxScale(), Math.max(1, v.s * Math.exp(-e.deltaY * 0.01)));
      s <= 1.0001 ? reset(false) : zoomAt(s, px, py, false);
    } else if (zoomedIn()) {
      [v.tx, v.ty] = clampT(v.s, v.tx - e.deltaX, v.ty - e.deltaY);
      apply(false);
    }
  }, { passive: false });
  // iOS Safari: keep the page itself from zooming while the viewer is open
  ["gesturestart", "gesturechange", "gestureend"].forEach(t => lb.addEventListener(t, e => e.preventDefault()));

  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") zoomedIn() ? reset(true) : close();
    else if (e.key === "ArrowRight" && !zoomedIn()) show(cur + 1);
    else if (e.key === "ArrowLeft" && !zoomedIn()) show(cur - 1);
    else if (e.key === "z" || e.key === "Z") zoomBtn.click();
  });
})();
