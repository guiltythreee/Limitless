// @ts-nocheck
/**
 * Original Bookkeys procedural background renderer.
 *
 * The scene definitions below are preserved from the original Bookkeys reader.
 * Keep these canvas scenes intact; CSS thumbnails are not substitutes for them.
 */
const SCENES = (() => {
function rnd(a, b) { return a + Math.random() * (b - a); }
function hexA(h, a) { var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
function vgrad(c, H, stops) {
  var g = c.createLinearGradient(0, 0, 0, H);
  stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
  return g;
}
function starField(W, H, d, per) {
  var n = Math.round(W * H / per * d), i, out = [];
  for (i = 0; i < n; i++) out.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(0.3, 1.5), p: rnd(0, 6.28), s: rnd(0.6, 2.4) });
  return out;
}
function drawStars(c, stars, t) {
  var i, s, a;
  for (i = 0; i < stars.length; i++) {
    s = stars[i];
    a = 0.5 + 0.5 * Math.sin(t * s.s + s.p);
    c.fillStyle = "rgba(255,255,255," + (0.25 + 0.7 * a).toFixed(2) + ")";
    if (s.r > 1) { c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.283); c.fill(); }
    else c.fillRect(s.x, s.y, s.r * 2, s.r * 2);
  }
}
var SCENES = {};

SCENES.night = {
  init: function (W, H, d) {
    this.stars = starField(W, H, d, 3200);
    this.shoot = null; this.next = rnd(2, 5);
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#04081a"], [0.6, "#0e1a3d"], [1, "#1d2c57"]]);
    c.fillRect(0, 0, W, H);
    var mx = W * 0.82, my = H * 0.17, mr = Math.min(W, H) * 0.045;
    var mg = c.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 6);
    mg.addColorStop(0, "rgba(190,210,255,0.28)"); mg.addColorStop(1, "rgba(190,210,255,0)");
    c.fillStyle = mg; c.fillRect(mx - mr * 6, my - mr * 6, mr * 12, mr * 12);
    c.fillStyle = "#e9efff"; c.beginPath(); c.arc(mx, my, mr, 0, 6.283); c.fill();
    drawStars(c, this.stars, t);
    this.next -= dt;
    if (this.next <= 0 && !this.shoot) {
      this.shoot = { x: rnd(W * 0.3, W * 0.95), y: rnd(0, H * 0.3), vx: -rnd(500, 800), vy: rnd(200, 340), life: 0 };
      this.next = rnd(4, 9);
    }
    if (this.shoot) {
      var s = this.shoot, a;
      s.x += s.vx * dt; s.y += s.vy * dt; s.life += dt;
      a = 1 - s.life / 0.9;
      if (a <= 0) this.shoot = null;
      else {
        var gr = c.createLinearGradient(s.x, s.y, s.x - s.vx * 0.14, s.y - s.vy * 0.14);
        gr.addColorStop(0, "rgba(255,255,255," + a.toFixed(2) + ")"); gr.addColorStop(1, "rgba(255,255,255,0)");
        c.strokeStyle = gr; c.lineWidth = 1.6; c.beginPath();
        c.moveTo(s.x, s.y); c.lineTo(s.x - s.vx * 0.14, s.y - s.vy * 0.14); c.stroke();
      }
    }
  }
};

SCENES.snow = {
  init: function (W, H, d) {
    var n = Math.round(W * H / 6500 * d), i;
    this.f = [];
    for (i = 0; i < n; i++) this.f.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(0.8, 3.6), p: rnd(0, 6.28) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#0a1422"], [0.6, "#162a40"], [1, "#2a4160"]]);
    c.fillRect(0, 0, W, H);
    var i, f;
    for (i = 0; i < this.f.length; i++) {
      f = this.f[i];
      f.y += (12 + f.r * 14) * dt;
      f.x += (Math.sin(t * 0.7 + f.p) * 10 + 6) * dt;
      if (f.y > H + 5) { f.y = -5; f.x = rnd(0, W); }
      if (f.x > W + 5) f.x = -5;
      c.fillStyle = "rgba(255,255,255," + (0.4 + f.r / 7).toFixed(2) + ")";
      c.beginPath(); c.arc(f.x, f.y, f.r, 0, 6.283); c.fill();
    }
  }
};

SCENES.aurora = {
  init: function (W, H, d) {
    this.stars = starField(W, H, d, 9000);
    this.rib = [
      { y: 0.30, amp: 0.06, h: 0.34, f: 1.6, sp: 0.25, ph: 0, a: "#2dff9a", b: "#2de2e6" },
      { y: 0.26, amp: 0.08, h: 0.36, f: 1.1, sp: 0.18, ph: 2, a: "#4dffb8", b: "#7b6bff" },
      { y: 0.34, amp: 0.05, h: 0.28, f: 2.2, sp: 0.32, ph: 4, a: "#7be8ff", b: "#c06bff" }
    ];
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#020712"], [0.6, "#06142b"], [1, "#0b2236"]]);
    c.fillRect(0, 0, W, H);
    drawStars(c, this.stars, t);
    c.globalCompositeOperation = "lighter";
    var k, r, x, u, y0, h, a, g;
    for (k = 0; k < this.rib.length; k++) {
      r = this.rib[k];
      for (x = -8; x < W + 8; x += 8) {
        u = x / W * 6.283;
        y0 = H * r.y + Math.sin(u * r.f + t * r.sp + r.ph) * H * r.amp + Math.sin(u * r.f * 2.3 - t * r.sp * 1.4) * H * r.amp * 0.35;
        h = H * r.h * (0.75 + 0.25 * Math.sin(u * 3 + t * 0.3 + r.ph));
        a = 0.1 + 0.12 * (0.5 + 0.5 * Math.sin(x * 0.045 + t * 0.8 + r.ph));
        g = c.createLinearGradient(0, y0, 0, y0 + h);
        g.addColorStop(0, hexA(r.a, 0)); g.addColorStop(0.2, hexA(r.a, a));
        g.addColorStop(0.65, hexA(r.b, a * 0.55)); g.addColorStop(1, hexA(r.b, 0));
        c.fillStyle = g; c.fillRect(x, y0, 9, h);
      }
    }
    c.globalCompositeOperation = "source-over";
  }
};

SCENES.rain = {
  init: function (W, H, d) {
    var n = Math.round(W / 5 * d), i;
    this.d = []; this.rip = [];
    for (i = 0; i < n; i++) this.d.push({ x: rnd(-120, W), y: rnd(0, H), l: rnd(10, 26), v: rnd(750, 1150) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#080e15"], [0.6, "#101a24"], [1, "#1b2836"]]);
    c.fillRect(0, 0, W, H);
    var i, p, r;
    c.strokeStyle = "rgba(190,210,230,0.32)"; c.lineWidth = 1; c.beginPath();
    for (i = 0; i < this.d.length; i++) {
      p = this.d[i];
      p.y += p.v * dt; p.x -= p.v * dt * 0.18;
      if (p.y > H) {
        if (Math.random() < 0.5 && this.rip.length < 90) this.rip.push({ x: p.x, y: H - rnd(4, H * 0.1), r: 1, a: 0.4 });
        p.y = rnd(-40, 0); p.x = rnd(0, W + 160);
      }
      c.moveTo(p.x, p.y); c.lineTo(p.x - p.l * 0.18, p.y + p.l);
    }
    c.stroke();
    for (i = this.rip.length - 1; i >= 0; i--) {
      r = this.rip[i];
      r.r += 50 * dt; r.a -= 0.8 * dt;
      if (r.a <= 0) { this.rip.splice(i, 1); continue; }
      c.strokeStyle = "rgba(190,210,230," + r.a.toFixed(2) + ")";
      c.beginPath(); c.ellipse(r.x, r.y, r.r, r.r * 0.3, 0, 0, 6.283); c.stroke();
    }
    var g = c.createLinearGradient(0, H * 0.7, 0, H);
    g.addColorStop(0, "rgba(120,150,180,0)"); g.addColorStop(1, "rgba(120,150,180,0.12)");
    c.fillStyle = g; c.fillRect(0, H * 0.7, W, H * 0.3);
  }
};

SCENES.digital = {
  fs: 16,
  chars: "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾅﾆﾇﾈﾉ0123456789ABCDEFZ",
  init: function (W, H, d) {
    var n = Math.ceil(W / this.fs), i;
    this.dr = [];
    for (i = 0; i < n; i++) this.dr.push(Math.floor(rnd(-30, H / this.fs)));
    this.acc = 0; this.ready = false;
  },
  glyph: function () { return this.chars.charAt(Math.floor(Math.random() * this.chars.length)); },
  step: function (c, W, H) {
    var fs = this.fs, i, y, x;
    c.fillStyle = "rgba(0,10,5,0.1)"; c.fillRect(0, 0, W, H);
    c.font = fs + "px 'IBM Plex Mono', monospace"; c.textBaseline = "top";
    for (i = 0; i < this.dr.length; i++) {
      y = this.dr[i]; x = i * fs;
      if (y >= 0 && y * fs < H + fs) {
        if (y > 0) {
          c.fillStyle = "#000a05"; c.fillRect(x, (y - 1) * fs, fs, fs);
          c.fillStyle = "#22c55e"; c.fillText(this.glyph(), x, (y - 1) * fs);
        }
        c.fillStyle = "#d8ffe4"; c.fillText(this.glyph(), x, y * fs);
      }
      this.dr[i] = y + 1;
      if (y * fs > H && Math.random() > 0.97) this.dr[i] = Math.floor(rnd(-25, 0));
    }
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    if (!this.ready) { c.fillStyle = "#000a05"; c.fillRect(0, 0, W, H); this.ready = true; }
    this.acc += dt;
    var k = 0;
    while (this.acc >= 0.055 && k < 4) { this.acc -= 0.055; this.step(c, W, H); k++; }
  }
};

SCENES.underwater = {
  init: function (W, H, d) {
    var n = Math.round(W * H / 26000 * d), i;
    this.b = []; this.ray = [];
    for (i = 0; i < n; i++) this.b.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(2, 9), v: rnd(22, 65), p: rnd(0, 6.28) });
    for (i = 0; i < 5; i++) this.ray.push({ x: rnd(0, W), w: rnd(70, 170), p: rnd(0, 6.28) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#0c7ea6"], [0.45, "#08507c"], [1, "#021a30"]]);
    c.fillRect(0, 0, W, H);
    var i, r, g, x0, x, y, k, b;
    c.globalCompositeOperation = "lighter";
    for (i = 0; i < this.ray.length; i++) {
      r = this.ray[i];
      x0 = r.x + Math.sin(t * 0.2 + r.p) * 40;
      g = c.createLinearGradient(0, 0, 0, H * 0.9);
      g.addColorStop(0, "rgba(200,240,255,0.16)"); g.addColorStop(1, "rgba(200,240,255,0)");
      c.fillStyle = g; c.beginPath();
      c.moveTo(x0, -10); c.lineTo(x0 + r.w * 0.3, -10);
      c.lineTo(x0 + r.w + H * 0.25, H * 0.9); c.lineTo(x0 + H * 0.25 - r.w * 0.2, H * 0.9);
      c.closePath(); c.fill();
    }
    c.globalCompositeOperation = "source-over";
    c.strokeStyle = "rgba(220,250,255,0.06)"; c.lineWidth = 1.5;
    for (k = 0; k < 6; k++) {
      c.beginPath();
      for (x = 0; x <= W; x += 14) {
        y = H * (0.05 + k * 0.055) + Math.sin(x * 0.012 + t * 0.7 + k) * 10 + Math.sin(x * 0.031 - t * 0.5 + k * 2) * 5;
        if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
    }
    for (i = 0; i < this.b.length; i++) {
      b = this.b[i];
      b.y -= b.v * dt; b.x += Math.sin(t * 1.3 + b.p) * 12 * dt;
      if (b.y < -20) { b.y = H + 10; b.x = rnd(0, W); }
      c.strokeStyle = "rgba(220,245,255,0.38)"; c.lineWidth = 1;
      c.beginPath(); c.arc(b.x, b.y, b.r, 0, 6.283); c.stroke();
      c.fillStyle = "rgba(255,255,255,0.35)";
      c.beginPath(); c.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.2, 0, 6.283); c.fill();
    }
  }
};

SCENES.shafts = {
  init: function (W, H, d) {
    var i, n = Math.round(70 * d);
    this.s = []; this.m = [];
    for (i = 0; i < 7; i++) this.s.push({ x: rnd(-W * 0.1, W * 0.9), w: rnd(W * 0.05, W * 0.16), p: rnd(0, 6.28), sp: rnd(0.5, 1.3) });
    for (i = 0; i < n; i++) this.m.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(0.6, 2), vx: rnd(-6, 6), vy: rnd(-4, 8), p: rnd(0, 6.28) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#1c150e"], [0.5, "#241b12"], [1, "#0e0a07"]]);
    c.fillRect(0, 0, W, H);
    var i, s, x0, a, g, m, bl;
    bl = c.createRadialGradient(W * 0.2, 0, 10, W * 0.2, 0, H * 0.8);
    bl.addColorStop(0, "rgba(255,210,140,0.22)"); bl.addColorStop(1, "rgba(255,210,140,0)");
    c.fillStyle = bl; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "lighter";
    for (i = 0; i < this.s.length; i++) {
      s = this.s[i];
      x0 = s.x + Math.sin(t * 0.1 * s.sp + s.p) * 30;
      a = 0.05 + 0.07 * (0.5 + 0.5 * Math.sin(t * 0.35 * s.sp + s.p));
      g = c.createLinearGradient(0, 0, 0, H * 0.95);
      g.addColorStop(0, "rgba(255,226,170," + a.toFixed(3) + ")"); g.addColorStop(1, "rgba(255,226,170,0)");
      c.fillStyle = g; c.beginPath();
      c.moveTo(x0, -20); c.lineTo(x0 + s.w * 0.35, -20);
      c.lineTo(x0 + H * 0.45 + s.w * 1.1, H); c.lineTo(x0 + H * 0.45, H);
      c.closePath(); c.fill();
    }
    for (i = 0; i < this.m.length; i++) {
      m = this.m[i];
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.x < -5) m.x = W + 5; if (m.x > W + 5) m.x = -5;
      if (m.y < -5) m.y = H + 5; if (m.y > H + 5) m.y = -5;
      c.fillStyle = "rgba(255,235,190," + (0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.8 + m.p))).toFixed(2) + ")";
      c.beginPath(); c.arc(m.x, m.y, m.r, 0, 6.283); c.fill();
    }
    c.globalCompositeOperation = "source-over";
  }
};

SCENES.candle = {
  init: function (W, H, d) {
    this.cd = [{ x: 0.28, y: 0.84, s: 0.8, p: 0 }, { x: 0.5, y: 0.9, s: 1.15, p: 2 }, { x: 0.74, y: 0.82, s: 0.9, p: 4 }];
    this.j = [0, 0, 0];
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#0a0604"], [1, "#150d07"]]);
    c.fillRect(0, 0, W, H);
    var i, cd, f, x, y, R, g, lg, fg;
    for (i = 0; i < this.cd.length; i++) {
      cd = this.cd[i]; x = cd.x * W; y = cd.y * H;
      lg = c.createLinearGradient(x - 8 * cd.s, 0, x + 8 * cd.s, 0);
      lg.addColorStop(0, "rgba(90,60,40,0.9)"); lg.addColorStop(0.35, "rgba(255,225,170,0.9)"); lg.addColorStop(1, "rgba(80,52,34,0.9)");
      c.fillStyle = lg; c.fillRect(x - 8 * cd.s, y + 4, 16 * cd.s, H - y);
      c.fillStyle = "#1a0f08"; c.fillRect(x - 1, y - 2, 2, 7 * cd.s);
    }
    c.globalCompositeOperation = "lighter";
    for (i = 0; i < this.cd.length; i++) {
      cd = this.cd[i]; x = cd.x * W; y = cd.y * H;
      this.j[i] += (rnd(-0.12, 0.12) - this.j[i]) * 0.15;
      f = 0.86 + 0.1 * Math.sin(t * 7.3 + cd.p) + 0.05 * Math.sin(t * 13.1 + cd.p * 2) + 0.04 * Math.sin(t * 23 + cd.p * 3) + this.j[i];
      R = Math.min(W, H) * 0.62 * cd.s * f;
      g = c.createRadialGradient(x, y - 30 * cd.s, 4, x, y - 30 * cd.s, R);
      g.addColorStop(0, "rgba(255,176,70," + (0.34 * f).toFixed(3) + ")");
      g.addColorStop(0.35, "rgba(255,120,30," + (0.13 * f).toFixed(3) + ")");
      g.addColorStop(1, "rgba(255,100,20,0)");
      c.fillStyle = g; c.fillRect(x - R, y - 30 * cd.s - R, R * 2, R * 2);
      c.save(); c.translate(x, y); c.scale(cd.s, cd.s * f);
      fg = c.createRadialGradient(0, -14, 1, 0, -14, 22);
      fg.addColorStop(0, "rgba(255,248,210,0.95)"); fg.addColorStop(0.35, "rgba(255,190,80,0.75)"); fg.addColorStop(1, "rgba(255,120,20,0)");
      c.fillStyle = fg; c.beginPath(); c.ellipse(0, -14, 8, 20, 0, 0, 6.283); c.fill();
      c.restore();
    }
    c.globalCompositeOperation = "source-over";
  }
};

SCENES.hearth = {
  init: function (W, H, d) {
    var n = Math.max(4, Math.round(W / 70)), i;
    this.tg = []; this.em = []; this.w = W / n * 1.4; this.d = d;
    for (i = 0; i < n; i++) this.tg.push({ x: (i + 0.5) * W / n + rnd(-20, 20), p: rnd(0, 6.28), sp: rnd(2.5, 5) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#070303"], [1, "#120504"]]);
    c.fillRect(0, 0, W, H);
    var f = 0.88 + 0.08 * Math.sin(t * 5.1) + 0.05 * Math.sin(t * 11.3), i, p, h, w, g, e, a;
    c.globalCompositeOperation = "lighter";
    g = c.createLinearGradient(0, H * 0.35, 0, H);
    g.addColorStop(0, "rgba(255,90,20,0)"); g.addColorStop(0.6, "rgba(200,50,10," + (0.2 * f).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,110,30," + (0.5 * f).toFixed(3) + ")");
    c.fillStyle = g; c.fillRect(0, H * 0.35, W, H * 0.65);
    w = this.w;
    for (i = 0; i < this.tg.length; i++) {
      p = this.tg[i];
      h = H * (0.15 + 0.12 * (0.5 + 0.5 * Math.sin(t * p.sp + p.p))) * f;
      c.save(); c.translate(p.x + Math.sin(t * 1.3 + p.p) * 8, H); c.scale(1, h / w);
      g = c.createRadialGradient(0, 0, 2, 0, 0, w);
      g.addColorStop(0, "rgba(255,225,130,0.5)"); g.addColorStop(0.4, "rgba(255,120,30,0.32)"); g.addColorStop(1, "rgba(200,40,10,0)");
      c.fillStyle = g; c.fillRect(-w, -w, w * 2, w * 1.05);
      c.restore();
    }
    var spawn = 24 * this.d * dt;
    while (spawn > 0) {
      if (Math.random() < spawn) this.em.push({ x: rnd(W * 0.1, W * 0.9), y: H - rnd(0, 40), vx: rnd(-20, 20), vy: -rnd(40, 120), life: 0, max: rnd(2, 5), r: rnd(0.8, 2.2) });
      spawn -= 1;
    }
    for (i = this.em.length - 1; i >= 0; i--) {
      e = this.em[i];
      e.life += dt; e.x += (e.vx + Math.sin(t * 2 + e.max) * 12) * dt; e.y += e.vy * dt;
      a = 1 - e.life / e.max;
      if (a <= 0) { this.em.splice(i, 1); continue; }
      c.fillStyle = "rgba(255," + Math.round(120 + 80 * a) + ",50," + (a * 0.9).toFixed(2) + ")";
      c.beginPath(); c.arc(e.x, e.y, e.r, 0, 6.283); c.fill();
    }
    c.globalCompositeOperation = "source-over";
  }
};

SCENES.crt = {
  init: function (W, H, d) { this.pat = null; },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    var g = c.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H) * 0.7), y, i;
    g.addColorStop(0, "#0b2a17"); g.addColorStop(1, "#020804");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (!this.pat) {
      var pc = document.createElement("canvas"), px;
      pc.width = 2; pc.height = 3; px = pc.getContext("2d");
      px.fillStyle = "rgba(0,0,0,0.32)"; px.fillRect(0, 2, 2, 1);
      this.pat = c.createPattern(pc, "repeat");
    }
    c.fillStyle = this.pat; c.fillRect(0, 0, W, H);
    y = ((t * 0.12) % 1.3 - 0.15) * H;
    g = c.createLinearGradient(0, y, 0, y + H * 0.18);
    g.addColorStop(0, "rgba(120,255,160,0)"); g.addColorStop(0.5, "rgba(120,255,160,0.06)"); g.addColorStop(1, "rgba(120,255,160,0)");
    c.fillStyle = g; c.fillRect(0, y, W, H * 0.18);
    c.fillStyle = "rgba(255,255,255,0.03)";
    for (i = 0; i < 3; i++) c.fillRect(0, Math.random() * H, W, 1);
    c.fillStyle = "rgba(120,255,170," + (0.015 + Math.random() * 0.02).toFixed(3) + ")"; c.fillRect(0, 0, W, H);
    g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.6)");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
};
/* ---- extra scene helpers ---- */
function glowSprite(sz, rgb, core) {
  var cv = document.createElement("canvas"), x, g;
  cv.width = cv.height = sz; x = cv.getContext("2d");
  g = x.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
  g.addColorStop(0, "rgba(" + rgb + ",1)"); g.addColorStop(core || 0.15, "rgba(" + rgb + ",0.75)"); g.addColorStop(1, "rgba(" + rgb + ",0)");
  x.fillStyle = g; x.fillRect(0, 0, sz, sz);
  return cv;
}
function discSprite(sz, rgb) {
  var cv = document.createElement("canvas"), x, g;
  cv.width = cv.height = sz; x = cv.getContext("2d");
  g = x.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
  g.addColorStop(0, "rgba(" + rgb + ",0.28)"); g.addColorStop(0.72, "rgba(" + rgb + ",0.42)"); g.addColorStop(0.93, "rgba(" + rgb + ",0.85)"); g.addColorStop(1, "rgba(" + rgb + ",0)");
  x.fillStyle = g; x.fillRect(0, 0, sz, sz);
  return cv;
}
function pines(c, list, col, base) {
  var i, tr;
  c.fillStyle = col; c.beginPath();
  for (i = 0; i < list.length; i++) {
    tr = list[i];
    c.moveTo(tr.x - tr.w / 2, base); c.lineTo(tr.x, base - tr.h); c.lineTo(tr.x + tr.w / 2, base); c.closePath();
  }
  c.fill(); c.fillRect(0, base - 1, 99999, 99999);
}
function stormBolt(W, H) {
  var out = [], pts = [], x = rnd(W * 0.2, W * 0.8), y = 0, lim = H * rnd(0.5, 0.85), bx, by, br, j;
  while (y < lim) {
    pts.push([x, y]);
    if (Math.random() < 0.18) {
      br = [[x, y]]; bx = x; by = y;
      for (j = 0; j < 4; j++) { bx += rnd(-10, 40) * (Math.random() < 0.5 ? -1 : 1); by += rnd(14, 34); br.push([bx, by]); }
      out.push(br);
    }
    x += rnd(-36, 36); y += rnd(18, 46);
  }
  pts.push([x, y]); out.push(pts);
  return out;
}
function drawLeaf(c, s) {
  c.beginPath(); c.moveTo(0, -s);
  c.quadraticCurveTo(s * 0.85, -s * 0.15, 0, s); c.quadraticCurveTo(-s * 0.85, -s * 0.15, 0, -s);
  c.fill();
}

SCENES.warp = {
  init: function (W, H, d) {
    var n = Math.round(260 * d), i; this.s = [];
    for (i = 0; i < n; i++) this.s.push({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(0.05, 1) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#02030a"], [1, "#0a1030"]]); c.fillRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2, k = Math.max(W, H) * 0.12, i, s, z2, a;
    c.lineCap = "round";
    for (i = 0; i < this.s.length; i++) {
      s = this.s[i]; s.z -= dt * 0.4;
      if (s.z <= 0.03) { s.x = rnd(-1, 1); s.y = rnd(-1, 1); s.z = 1; }
      z2 = s.z + 0.04 + dt * 0.5; a = 1 - s.z;
      c.strokeStyle = "rgba(200,220,255," + Math.min(1, a * 1.3).toFixed(2) + ")"; c.lineWidth = 0.5 + a * 1.8;
      c.beginPath(); c.moveTo(cx + s.x / z2 * k, cy + s.y / z2 * k); c.lineTo(cx + s.x / s.z * k, cy + s.y / s.z * k); c.stroke();
    }
  }
};

SCENES.nebula = {
  init: function (W, H, d) {
    var i, hues = [270, 300, 330, 200, 180, 250, 290]; this.stars = starField(W, H, d, 4200); this.b = [];
    for (i = 0; i < 7; i++) this.b.push({ x: rnd(0, W), y: rnd(0, H), r: Math.max(W, H) * rnd(0.22, 0.4), h: hues[i], vx: rnd(-6, 6), vy: rnd(-4, 4), p: rnd(0, 6.28) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = "#04030c"; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "lighter";
    var i, b, g, a;
    for (i = 0; i < this.b.length; i++) {
      b = this.b[i]; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < -b.r) { b.x = W + b.r; } else if (b.x > W + b.r) { b.x = -b.r; }
      if (b.y < -b.r) { b.y = H + b.r; } else if (b.y > H + b.r) { b.y = -b.r; }
      a = 0.17 + 0.05 * Math.sin(t * 0.4 + b.p);
      g = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, "hsla(" + b.h + ",80%,55%," + a.toFixed(3) + ")");
      g.addColorStop(0.5, "hsla(" + b.h + ",80%,40%," + (a * 0.5).toFixed(3) + ")");
      g.addColorStop(1, "hsla(" + b.h + ",80%,30%,0)");
      c.fillStyle = g; c.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
    c.globalCompositeOperation = "source-over";
    drawStars(c, this.stars, t);
  }
};

SCENES.fireflies = {
  init: function (W, H, d) {
    var n = Math.round(46 * d), i; this.f = []; this.spr = glowSprite(64, "214,255,110", 0.12);
    for (i = 0; i < n; i++) this.f.push({ x: rnd(0, W), y: rnd(H * 0.2, H * 0.95), a: rnd(0, 6.28), v: rnd(10, 30), p: rnd(0, 6.28), s: rnd(1.2, 3), r: rnd(7, 15) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#040b10"], [0.6, "#08201a"], [1, "#0d2d20"]]); c.fillRect(0, 0, W, H);
    var i, f, k, x;
    c.fillStyle = "#03090a"; c.beginPath(); c.moveTo(0, H);
    for (x = 0; x <= W + 20; x += 20) c.lineTo(x, H * 0.86 + Math.sin(x * 0.006) * H * 0.04 + Math.sin(x * 0.017 + 2) * H * 0.015);
    c.lineTo(W + 20, H); c.closePath(); c.fill();
    c.globalCompositeOperation = "lighter";
    for (i = 0; i < this.f.length; i++) {
      f = this.f[i]; f.a += rnd(-1.5, 1.5) * dt * 2;
      f.x += Math.cos(f.a) * f.v * dt; f.y += Math.sin(f.a) * f.v * dt * 0.7 - 2 * dt;
      if (f.x < -20) { f.x = W + 20; } else if (f.x > W + 20) { f.x = -20; }
      if (f.y < H * 0.12) { f.y = H * 0.95; } else if (f.y > H) { f.y = H * 0.2; }
      k = 0.5 + 0.5 * Math.sin(t * f.s + f.p); k = k * k;
      c.globalAlpha = 0.15 + 0.85 * k; c.drawImage(this.spr, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
    }
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  }
};

SCENES.synthwave = {
  init: function (W, H, d) { this.stars = starField(W, H * 0.5, d, 5000); },
  draw: function (c, W, H, t, dt) {
    var hy = H * 0.56, cx = W / 2, R = Math.min(W, H) * 0.2, sy = hy - R * 0.55, sky, g, i, j, y, p, f, M = 9;
    c.globalCompositeOperation = "source-over";
    sky = vgrad(c, hy, [[0, "#090120"], [0.55, "#2a0a52"], [0.85, "#8a1a86"], [1, "#ff3e9a"]]);
    c.fillStyle = sky; c.fillRect(0, 0, W, hy);
    drawStars(c, this.stars, t);
    g = c.createLinearGradient(0, sy - R, 0, sy + R);
    g.addColorStop(0, "#ffe66d"); g.addColorStop(0.5, "#ff9a5c"); g.addColorStop(1, "#ff2e93");
    c.fillStyle = g; c.beginPath(); c.arc(cx, sy, R, 0, 6.283); c.fill();
    c.fillStyle = sky;
    for (j = 0; j < 6; j++) { y = sy + R * (0.12 + j * 0.15); c.fillRect(cx - R, y, R * 2, 1.5 + j * 1.6); }
    c.fillStyle = vgrad(c, H, [[0, "#2b0a45"], [hy / H, "#2b0a45"], [1, "#0a0218"]]); c.fillRect(0, hy, W, H - hy);
    g = c.createLinearGradient(0, hy - 2, 0, hy + 14); g.addColorStop(0, "rgba(255,90,200,0.9)"); g.addColorStop(1, "rgba(255,90,200,0)");
    c.fillStyle = g; c.fillRect(0, hy - 2, W, 16);
    c.lineCap = "round";
    c.strokeStyle = "rgba(255,70,200,0.22)"; c.lineWidth = 4; c.beginPath();
    for (i = -14; i <= 14; i++) { c.moveTo(cx + i * W * 0.012, hy); c.lineTo(cx + i * W * 0.13, H); }
    c.stroke();
    c.strokeStyle = "rgba(255,110,225,0.85)"; c.lineWidth = 1.2; c.beginPath();
    for (i = -14; i <= 14; i++) { c.moveTo(cx + i * W * 0.012, hy); c.lineTo(cx + i * W * 0.13, H); }
    c.stroke();
    f = (t * 0.35) % 1;
    for (j = 0; j < M; j++) {
      p = (j + f) / M; y = hy + (H - hy) * p * p;
      c.strokeStyle = "rgba(90,230,255," + (0.2 + 0.7 * p).toFixed(2) + ")"; c.lineWidth = 0.8 + p * 1.4;
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke();
    }
  }
};

SCENES.sakura = {
  init: function (W, H, d) {
    var n = Math.round(W * H / 14000 * d), i; this.p = [];
    for (i = 0; i < n; i++) this.p.push(this.mk(W, H, true));
  },
  mk: function (W, H, any) {
    var cols = ["#FFC2D4", "#FFB3C8", "#FFD6E2", "#F9A8C4", "#FFE4EC"];
    return { x: rnd(-80, W), y: any ? rnd(-20, H) : -20, vy: rnd(24, 55), vx: rnd(8, 30), rot: rnd(0, 6.28), vr: rnd(-2, 2), s: rnd(5, 10), sw: rnd(0.8, 2), p: rnd(0, 6.28), fl: rnd(1, 3), c: cols[Math.floor(Math.random() * cols.length)] };
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#1b0f2e"], [0.55, "#5a2a5e"], [1, "#c4658a"]]); c.fillRect(0, 0, W, H);
    var mx = W * 0.78, my = H * 0.2, mr = Math.min(W, H) * 0.06, g, i, p;
    g = c.createRadialGradient(mx, my, mr * 0.7, mx, my, mr * 5);
    g.addColorStop(0, "rgba(255,225,235,0.35)"); g.addColorStop(1, "rgba(255,225,235,0)");
    c.fillStyle = g; c.fillRect(mx - mr * 5, my - mr * 5, mr * 10, mr * 10);
    c.fillStyle = "#fff0f5"; c.beginPath(); c.arc(mx, my, mr, 0, 6.283); c.fill();
    c.globalAlpha = 0.9;
    for (i = 0; i < this.p.length; i++) {
      p = this.p[i];
      p.x += (p.vx + Math.sin(t * p.sw + p.p) * 22) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.y > H + 20 || p.x > W + 40) { this.p[i] = p = this.mk(W, H, false); }
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, 0.55 + 0.45 * Math.cos(t * p.fl + p.p));
      c.fillStyle = p.c; c.beginPath(); c.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, 6.283); c.fill();
      c.restore();
    }
    c.globalAlpha = 1;
  }
};

SCENES.autumn = {
  init: function (W, H, d) {
    var n = Math.round(W * H / 18000 * d), i; this.p = [];
    for (i = 0; i < n; i++) this.p.push(this.mk(W, H, true));
  },
  mk: function (W, H, any) {
    var cols = ["#C2410C", "#EA580C", "#D97706", "#B45309", "#991B1B", "#CA8A04"];
    return { x: rnd(-80, W), y: any ? rnd(-30, H) : -30, vy: rnd(30, 70), vx: rnd(10, 40), rot: rnd(0, 6.28), vr: rnd(-1.8, 1.8), s: rnd(7, 15), sw: rnd(0.7, 1.8), p: rnd(0, 6.28), fl: rnd(1, 2.5), c: cols[Math.floor(Math.random() * cols.length)] };
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#1d0e04"], [0.6, "#4a2108"], [1, "#8a3f10"]]); c.fillRect(0, 0, W, H);
    var g = c.createRadialGradient(W / 2, H * 1.05, 10, W / 2, H * 1.05, Math.max(W, H) * 0.7), i, p;
    g.addColorStop(0, "rgba(255,160,60,0.38)"); g.addColorStop(1, "rgba(255,160,60,0)");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (i = 0; i < this.p.length; i++) {
      p = this.p[i];
      p.x += (p.vx + Math.sin(t * p.sw + p.p) * 30) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.y > H + 30 || p.x > W + 60) { this.p[i] = p = this.mk(W, H, false); }
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(0.35 + 0.65 * Math.abs(Math.cos(t * p.fl + p.p)), 1);
      c.fillStyle = p.c; drawLeaf(c, p.s);
      c.strokeStyle = "rgba(0,0,0,0.25)"; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -p.s); c.lineTo(0, p.s); c.stroke();
      c.restore();
    }
  }
};

SCENES.lava = {
  init: function (W, H, d) {
    var n = Math.round(8 * Math.min(1.5, d)) + 2, i; this.b = [];
    for (i = 0; i < n; i++) this.b.push({ x: rnd(0.15, 0.85), r: rnd(0.09, 0.2), sp: rnd(0.06, 0.16), ph: rnd(0, 6.28) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#1a0535"], [1, "#3a0a30"]]); c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "lighter";
    var i, b, xx, yy, r, g, h;
    for (i = 0; i < this.b.length; i++) {
      b = this.b[i];
      yy = H * (0.5 + 0.55 * Math.sin(t * b.sp + b.ph)); xx = W * (b.x + 0.05 * Math.sin(t * b.sp * 1.7 + b.ph));
      r = Math.min(W, H) * b.r * (1 + 0.15 * Math.sin(t * b.sp * 3 + b.ph)); h = 345 + 50 * Math.sin(t * 0.1 + b.ph);
      c.save(); c.translate(xx, yy); c.scale(1, 1.4);
      g = c.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, "hsla(" + h.toFixed(0) + ",95%,58%,0.7)"); g.addColorStop(0.6, "hsla(" + h.toFixed(0) + ",95%,50%,0.3)"); g.addColorStop(1, "hsla(" + h.toFixed(0) + ",95%,45%,0)");
      c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2);
      c.restore();
    }
    c.globalCompositeOperation = "source-over";
  }
};

SCENES.storm = {
  init: function (W, H, d) {
    var n = Math.round(W * H / 7000 * d), i; this.r = []; this.cl = []; this.fl = 0; this.next = rnd(1.5, 4); this.bolt = null;
    for (i = 0; i < n; i++) this.r.push({ x: rnd(0, W + 150), y: rnd(0, H), l: rnd(10, 22), v: rnd(700, 1100) });
    for (i = 0; i < 6; i++) this.cl.push({ x: rnd(0, W), y: rnd(-0.05, 0.2) * H, r: Math.max(W, H) * rnd(0.2, 0.35), v: rnd(6, 16) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#04060b"], [1, "#182234"]]); c.fillRect(0, 0, W, H);
    var i, d, g, cl, j, pl;
    for (i = 0; i < this.cl.length; i++) {
      cl = this.cl[i]; cl.x += cl.v * dt; if (cl.x > W + cl.r) cl.x = -cl.r;
      g = c.createRadialGradient(cl.x, cl.y, 0, cl.x, cl.y, cl.r);
      g.addColorStop(0, "rgba(62,74,98,0.55)"); g.addColorStop(1, "rgba(62,74,98,0)");
      c.fillStyle = g; c.fillRect(cl.x - cl.r, cl.y - cl.r, cl.r * 2, cl.r * 2);
    }
    this.next -= dt;
    if (this.next <= 0) { this.fl = 1; this.bolt = stormBolt(W, H); this.next = rnd(3, 8); }
    if (this.fl > 0) {
      c.fillStyle = "rgba(190,210,255," + (this.fl * 0.26).toFixed(3) + ")"; c.fillRect(0, 0, W, H);
      c.lineJoin = "round"; c.strokeStyle = "rgba(235,242,255," + this.fl.toFixed(2) + ")";
      for (j = 0; j < this.bolt.length; j++) {
        pl = this.bolt[j];
        c.lineWidth = 2; c.beginPath(); c.moveTo(pl[0][0], pl[0][1]);
        for (i = 1; i < pl.length; i++) c.lineTo(pl[i][0], pl[i][1]);
        c.stroke();
      }
      this.fl -= dt * 3.2;
      if (this.fl <= 0) { this.fl = 0; this.bolt = null; }
    }
    c.strokeStyle = "rgba(170,190,225,0.32)"; c.lineWidth = 1; c.beginPath();
    for (i = 0; i < this.r.length; i++) {
      d = this.r[i]; d.y += d.v * dt; d.x -= d.v * 0.18 * dt;
      if (d.y > H) { d.y = -20; d.x = rnd(0, W + 150); }
      c.moveTo(d.x, d.y); c.lineTo(d.x + d.l * 0.18, d.y - d.l);
    }
    c.stroke();
  }
};

SCENES.bokeh = {
  init: function (W, H, d) {
    var n = Math.round(26 * d), i, cols = ["76,201,240", "244,114,182", "250,204,21", "167,139,250", "52,211,153", "251,146,60"];
    this.sp = cols.map(function (rgb) { return discSprite(128, rgb); }); this.b = [];
    for (i = 0; i < n; i++) this.b.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(18, 80), vx: rnd(-8, 8), vy: -rnd(4, 18), a: rnd(0.25, 0.7), s: rnd(0.3, 1.1), p: rnd(0, 6.28), c: Math.floor(rnd(0, cols.length)) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#070b1a"], [1, "#1a0f2e"]]); c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "lighter";
    var i, b;
    for (i = 0; i < this.b.length; i++) {
      b = this.b[i]; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y < -b.r) { b.y = H + b.r; b.x = rnd(0, W); }
      if (b.x < -b.r) { b.x = W + b.r; } else if (b.x > W + b.r) { b.x = -b.r; }
      c.globalAlpha = b.a * (0.6 + 0.4 * Math.sin(t * b.s + b.p));
      c.drawImage(this.sp[b.c], b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  }
};

SCENES.mesh = {
  init: function (W, H, d) {
    var i, hues = [250, 320, 190, 280, 340]; this.b = [];
    for (i = 0; i < 5; i++) this.b.push({ h: hues[i], sp: rnd(0.05, 0.11), ph: rnd(0, 6.28), ax: rnd(0.25, 0.4), ay: rnd(0.2, 0.35) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = "#10082a"; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "lighter";
    var i, b, x, y, r = Math.max(W, H) * 0.5, g;
    for (i = 0; i < this.b.length; i++) {
      b = this.b[i];
      x = W * (0.5 + b.ax * Math.sin(t * b.sp + b.ph)); y = H * (0.5 + b.ay * Math.cos(t * b.sp * 1.3 + b.ph * 2));
      g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "hsla(" + b.h + ",85%,55%,0.38)"); g.addColorStop(1, "hsla(" + b.h + ",85%,45%,0)");
      c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    c.globalCompositeOperation = "source-over";
  }
};

SCENES.constellation = {
  init: function (W, H, d) {
    var n = Math.min(110, Math.round(W * H / 14000 * d)), i; this.n = [];
    for (i = 0; i < n; i++) this.n.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-14, 14), vy: rnd(-14, 14), r: rnd(0.8, 2) });
    this.L = Math.min(170, Math.max(W, H) * 0.14);
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#050816"], [1, "#0c1233"]]); c.fillRect(0, 0, W, H);
    var i, j, a, b, dx, dy, dd, L2 = this.L * this.L;
    for (i = 0; i < this.n.length; i++) {
      a = this.n[i]; a.x += a.vx * dt; a.y += a.vy * dt;
      if (a.x < 0 || a.x > W) a.vx = -a.vx;
      if (a.y < 0 || a.y > H) a.vy = -a.vy;
    }
    c.lineWidth = 1;
    for (i = 0; i < this.n.length; i++) {
      a = this.n[i];
      for (j = i + 1; j < this.n.length; j++) {
        b = this.n[j]; dx = a.x - b.x; dy = a.y - b.y; dd = dx * dx + dy * dy;
        if (dd < L2) {
          c.strokeStyle = "rgba(150,175,255," + ((1 - dd / L2) * 0.38).toFixed(3) + ")";
          c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
        }
      }
    }
    c.fillStyle = "rgba(200,215,255,0.9)";
    for (i = 0; i < this.n.length; i++) { a = this.n[i]; c.beginPath(); c.arc(a.x, a.y, a.r, 0, 6.283); c.fill(); }
  }
};

SCENES.mist = {
  init: function (W, H, d) {
    var i, x; this.t1 = []; this.t2 = []; this.f = [];
    for (x = -20; x < W + 40; x += rnd(18, 34)) this.t1.push({ x: x, h: H * rnd(0.12, 0.26), w: rnd(30, 52) });
    for (x = -20; x < W + 40; x += rnd(26, 46)) this.t2.push({ x: x, h: H * rnd(0.16, 0.34), w: rnd(44, 72) });
    for (i = 0; i < 8; i++) this.f.push({ x: rnd(0, W), y: H * rnd(0.45, 0.95), rx: W * rnd(0.25, 0.5), ry: H * rnd(0.08, 0.16), v: rnd(5, 16) * (Math.random() < 0.5 ? -1 : 1), a: rnd(0.07, 0.15) });
  },
  draw: function (c, W, H, t, dt) {
    c.globalCompositeOperation = "source-over";
    c.fillStyle = vgrad(c, H, [[0, "#0a1318"], [0.6, "#1e3038"], [1, "#2d4650"]]); c.fillRect(0, 0, W, H);
    var i, f, g;
    pines(c, this.t1, "#12222a", H * 0.86);
    for (i = 0; i < this.f.length; i++) {
      f = this.f[i]; f.x += f.v * dt;
      if (f.x > W + f.rx) { f.x = -f.rx; } else if (f.x < -f.rx) { f.x = W + f.rx; }
      c.save(); c.translate(f.x, f.y); c.scale(1, f.ry / f.rx);
      g = c.createRadialGradient(0, 0, 0, 0, 0, f.rx);
      g.addColorStop(0, "rgba(200,220,230," + f.a.toFixed(3) + ")"); g.addColorStop(1, "rgba(200,220,230,0)");
      c.fillStyle = g; c.fillRect(-f.rx, -f.rx, f.rx * 2, f.rx * 2);
      c.restore();
    }
    pines(c, this.t2, "#070d10", H * 0.97);
  }
};
  return SCENES;
})();

export const BOOKKEYS_SCENE_IDS = Object.keys(SCENES);

export function createBookkeysBackgroundEngine(canvas) {
  const context = canvas?.getContext?.("2d");
  if (!context) {
    return { set() {}, pause() {}, resume() {}, destroy() {} };
  }

  let width = 0;
  let height = 0;
  let frame = 0;
  let last = 0;
  let time = 0;
  let sceneName = "none";
  let density = 1;
  let animate = true;
  let resizeHandle = 0;

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function loop(timestamp) {
    frame = requestAnimationFrame(loop);
    const delta = Math.min(0.05, (timestamp - last) / 1000 || 0.016);
    last = timestamp;
    time += delta;
    SCENES[sceneName].draw(context, width, height, time, delta, density);
  }

  function drawStill() {
    for (let index = 0; index < 90; index += 1) {
      SCENES[sceneName].draw(context, width, height, 3 + index * 0.05, 0.05, density);
    }
  }

  function set(name, nextDensity = 1, shouldAnimate = true) {
    stop();
    sceneName = name;
    canvas.dataset.scene = name;
    density = nextDensity;
    animate = shouldAnimate;
    if (!SCENES[name]) {
      canvas.hidden = true;
      sceneName = "none";
      return;
    }
    canvas.hidden = false;
    size();
    SCENES[name].init(width, height, density);
    if (animate) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    } else {
      drawStill();
    }
  }

  function onResize() {
    window.clearTimeout(resizeHandle);
    resizeHandle = window.setTimeout(() => {
      if (sceneName !== "none") set(sceneName, density, animate);
    }, 150);
  }

  function pause() {
    stop();
  }

  function resume() {
    if (sceneName !== "none" && animate && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }
  }

  function onVisibilityChange() {
    if (document.hidden) pause();
    else resume();
  }

  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return {
    set,
    pause,
    resume,
    destroy() {
      stop();
      window.clearTimeout(resizeHandle);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.hidden = true;
    },
  };
}
