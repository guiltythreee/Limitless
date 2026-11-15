// @ts-nocheck
/**
 * Bookkeys' original per-keystroke canvas effects.
 * Ported without replacing the original particle/effect definitions.
 */
export function createBookkeysEffectsEngine(canvas, getIntensity, isReducedMotion) {
  const context = canvas?.getContext?.("2d");
  if (!context) {
    return {
      has: () => false,
      effect() {},
      sparks() {},
      ripple() {},
      confetti() {},
      destroy() {},
    };
  }

  function rnd(a, b) { return a + Math.random() * (b - a); }

  const FX = (() => {
        var cv = canvas, c = context, P = [], raf = 0, last = 0, W = 0, H = 0, MAXP = 900;
        var CONF = ["#F43F5E", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6"];
        var FIRE = ["#FFF3B0", "#FFD24D", "#FF9F1C", "#FF5A1F", "#E63B0E"];
        var FWC = ["#FF4D6D", "#FFD166", "#06D6A0", "#4CC9F0", "#B388FF", "#FF9F1C"];
        var DK = true;
        var NAMES = { crunch: 1, explode: 1, fireworks: 1, shatter: 1, sparkle: 1, burn: 1, float: 1, shock: 1, ink: 1, pixelate: 1, embers: 1 };
        function size() {
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          W = window.innerWidth; H = window.innerHeight;
          cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        size(); window.addEventListener("resize", size);
        function css(n, fb) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb; }
        function col() { return css("--caret", "#1F6F78"); }
        function isDark() {
          var h = css("--bg", "#EDF0F3"), n;
          if (h.charAt(0) !== "#" || h.length < 7) return false;
          n = parseInt(h.slice(1, 7), 16);
          return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) < 128;
        }
        function hi(light, dark) { return DK ? dark : light; }
        function pc(a) { return a[Math.floor(Math.random() * a.length)]; }
        function cnt(k) { return Math.max(1, Math.round(k * (getIntensity() || 1))); }
        function add(o) { if (P.length < MAXP) { o.life = -(o.dl || 0); P.push(o); } }
        function dot(x, y, vx, vy, o) { o.k = "d"; o.x = x; o.y = y; o.vx = vx; o.vy = vy; add(o); }
        function ascent(font, h) { c.font = font; var m = c.measureText("Mg"); return m.fontBoundingBoxAscent || h * 0.8; }
        function trace(pts) {
          var i;
          c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
          for (i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
        }
        function starPath(x, y, R, rot) {
          var i, a, r;
          c.beginPath();
          for (i = 0; i < 8; i++) {
            a = rot + i * Math.PI / 4; r = i % 2 ? R * 0.2 : R;
            if (i) c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); else c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
          }
          c.closePath();
        }
        function bolt(x, y, ang, len, colr, w, max, glow, n) {
          var pts = [[x, y]], i, seg, jit, j;
          n = n || 6; seg = len / n; jit = len * 0.18;
          for (i = 1; i <= n; i++) {
            j = rnd(-jit, jit);
            x += Math.cos(ang) * seg - Math.sin(ang) * j; y += Math.sin(ang) * seg + Math.cos(ang) * j;
            pts.push([x, y]);
          }
          add({ k: "ln", pts: pts, col: colr, w: w, max: max, glow: glow });
        }
    
        function run() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
        function tick(ts) {
          var dt = Math.min(0.05, (ts - last) / 1000 || 0.016), i, p, a, u, rr, sc, stg;
          last = ts;
          c.clearRect(0, 0, W, H);
          for (i = P.length - 1; i >= 0; i--) {
            p = P[i]; p.life += dt;
            if (p.life < 0) continue;
            u = p.life / p.max; a = 1 - u;
            if (a <= 0) { if (p.end) p.end(p); P.splice(i, 1); continue; }
            c.globalAlpha = Math.min(1, a * 1.5);
            c.globalCompositeOperation = p.glow && DK ? "lighter" : "source-over";
            switch (p.k) {
              case "s":
                p.vy += 420 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
                c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
                break;
              case "r":
                c.strokeStyle = p.col; c.lineWidth = 1.5; c.beginPath(); c.arc(p.x, p.y, 4 + 24 * u, 0, 6.283); c.stroke();
                break;
              case "d":
                p.vx -= p.vx * (p.dr || 0) * dt; p.vy += ((p.g || 0) - p.vy * (p.dr || 0)) * dt;
                p.x += (p.vx + (p.sw ? Math.sin(p.life * 6 + p.ph) * p.sw : 0)) * dt; p.y += p.vy * dt;
                rr = p.r * (p.shr ? 1 - u * 0.7 : 1) * (p.grow ? 1 + u * p.grow : 1);
                c.globalAlpha = (p.al == null ? 1 : p.al) * Math.min(1, a * 1.6) * (p.fl ? 0.65 + 0.35 * Math.sin(p.life * 30 + p.ph) : 1);
                c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, Math.max(0.2, rr), 0, 6.283); c.fill();
                break;
              case "k":
                p.vx -= p.vx * (p.dr || 0) * dt; p.vy += (p.g || 0) * dt;
                p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
                c.globalAlpha = Math.min(1, a * 1.6);
                c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.col; c.fillRect(-p.r, -p.r * 0.7, p.r * 2, p.r * 1.4); c.restore();
                break;
              case "rk":
                p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
                add({ k: "d", x: p.x, y: p.y, vx: 0, vy: 0, r: 1.4, max: 0.3, col: p.col, glow: true, shr: true });
                c.globalAlpha = 1; c.fillStyle = hi(p.col, "#FFFFFF"); c.beginPath(); c.arc(p.x, p.y, 1.8, 0, 6.283); c.fill();
                break;
              case "ln":
                c.lineJoin = "round"; c.lineCap = "round"; c.strokeStyle = p.col;
                if (p.glow) { c.globalAlpha = 0.25 * a; c.lineWidth = p.w * 4; trace(p.pts); c.stroke(); }
                c.globalAlpha = a; c.lineWidth = p.w; trace(p.pts); c.stroke();
                break;
              case "st":
                c.globalAlpha = 1; c.fillStyle = p.col;
                starPath(p.x, p.y, p.r * Math.sin(Math.PI * u), p.rot + u * 0.8); c.fill();
                break;
              case "g":
                p.y += p.vy * dt; sc = 1 + 0.35 * u;
                c.globalAlpha = 0.85 * a;
                c.save(); c.translate(p.cx + Math.sin(p.life * 4 + p.ph) * p.sw, p.by - p.y); c.scale(sc, sc);
                c.font = p.font; c.textAlign = "center"; c.textBaseline = "alphabetic"; c.fillStyle = p.col; c.fillText(p.ch, 0, 0);
                c.restore();
                break;
              case "sh":
                p.vy += p.g * dt; p.dx += p.vx * dt; p.dy += p.vy * dt; p.rot += p.vr * dt;
                c.globalAlpha = Math.min(1, a * 1.6);
                c.save(); c.translate(p.ox + p.dx + p.cx, p.oy + p.dy + p.cy); c.rotate(p.rot); c.translate(-p.cx, -p.cy);
                c.beginPath(); c.moveTo(p.tri[0][0], p.tri[0][1]); c.lineTo(p.tri[1][0], p.tri[1][1]); c.lineTo(p.tri[2][0], p.tri[2][1]); c.closePath(); c.clip();
                c.font = p.font; c.textAlign = "left"; c.textBaseline = "alphabetic"; c.fillStyle = p.col; c.fillText(p.ch, 0, p.asc);
                c.restore();
                break;
              case "gs":
                c.globalAlpha = 0.9;
                c.save(); c.beginPath(); c.rect(p.ox - 16, p.oy + p.s0, p.w + 32, p.sh); c.clip();
                c.font = p.font; c.textAlign = "left"; c.textBaseline = "alphabetic"; c.fillStyle = p.col; c.fillText(p.ch, p.ox + p.dx, p.oy + p.asc);
                c.restore();
                break;
              case "bl":
                c.globalAlpha = 0.4 * a; c.fillStyle = p.col;
                c.beginPath(); c.arc(p.x, p.y, p.r * (0.35 + 0.65 * Math.min(1, u * 3)), 0, 6.283); c.fill();
                break;
              case "px":
                stg = Math.min(2, Math.floor(u * 3));
                c.globalAlpha = 0.9 * (1 - u * 0.6); c.imageSmoothingEnabled = false;
                c.drawImage(p.cvs[stg], p.ox, p.oy, p.w, p.h);
                c.imageSmoothingEnabled = true;
                break;
              default:
                p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
                c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
            }
          }
          c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
          if (P.length) raf = requestAnimationFrame(tick); else { raf = 0; c.clearRect(0, 0, W, H); }
        }
    
        // One spawner per typing effect. g = { ch, x0, y0, w, h, cx, cy, font } in viewport pixels.
        var EFX = {
          crunch: function (g) {
            var ink = css("--typed", "#222"), dim = css("--dim", "#888"), by = g.y0 + g.h, k, a;
            for (k = 0; k < cnt(5); k++) bolt(g.cx + rnd(-g.w * 0.3, g.w * 0.3), by, Math.PI * rnd(0.1, 0.9), rnd(8, 20), ink, 1.2, 0.35, false, 3);
            for (k = 0; k < cnt(9); k++) add({ k: "k", x: g.cx + rnd(-g.w / 2, g.w / 2), y: by - 2, vx: rnd(-150, 150), vy: -rnd(60, 200), g: 760, dr: 0.3, rot: rnd(0, 6.28), vr: rnd(-12, 12), r: rnd(1.2, 3), col: k % 2 ? ink : dim, max: rnd(0.4, 0.8) });
            for (k = 0; k < 2; k++) dot(g.cx + rnd(-g.w / 2, g.w / 2), by, rnd(-30, 30), -rnd(10, 30), { r: rnd(3, 5), max: rnd(0.5, 0.8), col: "#8D939B", al: 0.25, grow: 1.8 });
          },
          explode: function (g) {
            var ac = css("--accent", "#3B82F6"), ink = css("--typed", "#222"), cols = [ac, ac, "#FFD166", "#FF6B6B", ink], k, a, s;
            add({ k: "r", x: g.cx, y: g.cy, max: 0.45, col: ac });
            dot(g.cx, g.cy, 0, 0, { r: g.h * 0.7, max: 0.16, col: hi(ac, "#FFFFFF"), glow: true, al: 0.6 });
            for (k = 0; k < cnt(16); k++) {
              a = rnd(0, 6.283); s = rnd(120, 380);
              dot(g.cx, g.cy, Math.cos(a) * s, Math.sin(a) * s, { r: rnd(1.4, 3.4), max: rnd(0.45, 0.9), col: pc(cols), g: 320, dr: 2.4, glow: true, shr: true });
            }
          },
          fireworks: function (g) {
            var colr = pc(FWC);
            add({ k: "rk", x: g.cx, y: g.y0, vx: rnd(-25, 25), vy: -rnd(260, 360), g: 520, max: rnd(0.32, 0.42), col: colr, end: function (p) {
              var k, a, s, n = cnt(24), c2 = pc(FWC);
              for (k = 0; k < n; k++) {
                a = (k / n) * 6.283 + rnd(-0.1, 0.1); s = rnd(60, 190);
                dot(p.x, p.y, Math.cos(a) * s, Math.sin(a) * s, { r: rnd(1.2, 2.2), max: rnd(0.7, 1.15), col: k % 3 ? colr : c2, g: 150, dr: 1.7, glow: true, shr: true });
              }
              dot(p.x, p.y, 0, 0, { r: 16, max: 0.14, col: hi(colr, "#FFFFFF"), glow: true, al: 0.5 });
            } });
          },
          shatter: function (g) {
            var asc = ascent(g.font, g.h), ink = css("--typed", "#222"), n, i, a, b, mx, my, d, s, vx, vy;
            var px = g.w * rnd(0.4, 0.6), py = g.h * rnd(0.4, 0.6);
            var E = [[0, 0], [g.w / 2, 0], [g.w, 0], [g.w, g.h / 2], [g.w, g.h], [g.w / 2, g.h], [0, g.h], [0, g.h / 2]];
            n = E.length;
            for (i = 0; i < n; i++) {
              a = E[i]; b = E[(i + 1) % n];
              mx = (px + a[0] + b[0]) / 3; my = (py + a[1] + b[1]) / 3;
              d = Math.atan2(my - g.h / 2, mx - g.w / 2); s = rnd(70, 190);
              vx = Math.cos(d) * s; vy = Math.sin(d) * s - 60;
              add({ k: "sh", ox: g.x0, oy: g.y0, dx: 0, dy: 0, vx: vx, vy: vy, g: 620, rot: 0, vr: rnd(-8, 8), tri: [[px, py], a, b], cx: mx, cy: my, ch: g.ch, font: g.font, asc: asc, col: ink, max: rnd(0.55, 0.9) });
            }
          },
          sparkle: function (g) {
            var cols = hi(["#F59E0B", "#FF6B9D", "#8B5CF6", css("--accent", "#3B82F6")], ["#FFFFFF", "#FFF3B0", "#FFD166", css("--accent", "#3B82F6")]), k;
            for (k = 0; k < cnt(5); k++) add({ k: "st", x: g.x0 + rnd(-0.5, 1.5) * g.w, y: g.y0 + rnd(-0.4, 1.3) * g.h, r: rnd(5, 11), rot: rnd(0, 1.5), max: rnd(0.4, 0.8), col: pc(cols), glow: true, dl: rnd(0, 0.15) });
          },
          burn: function (g) {
            var k;
            for (k = 0; k < cnt(6); k++) dot(g.x0 + rnd(0, g.w), g.y0 + g.h * rnd(0.1, 0.6), rnd(-12, 12), -rnd(40, 120), { r: rnd(0.9, 2), max: rnd(0.6, 1.2), col: pc(DK ? FIRE : FIRE.slice(1)), g: -30, glow: true, shr: true, sw: 14, ph: rnd(0, 6) });
            dot(g.cx, g.y0 + g.h * 0.25, 0, -30, { r: g.h * 0.55, max: 0.3, col: "#FF7A18", glow: true, al: DK ? 0.35 : 0.22, shr: true });
            for (k = 0; k < cnt(2); k++) dot(g.cx + rnd(-4, 4), g.y0 + g.h * 0.1, rnd(-8, 8), -rnd(18, 40), { r: rnd(3, 5), max: rnd(0.9, 1.4), col: "#8D939B", al: 0.28, grow: 2.2, dl: 0.12 });
          },
          float: function (g) {
            add({ k: "g", cx: g.cx, by: g.y0 + ascent(g.font, g.h), y: 0, vy: rnd(45, 75), sw: rnd(4, 9), ph: rnd(0, 6), ch: g.ch, font: g.font, col: css("--accent", "#3B82F6"), max: 1.25 });
          },
          shock: function (g) {
            var k, a;
            for (k = 0; k < cnt(4); k++) bolt(g.cx, g.cy, rnd(0, 6.283), rnd(24, 52), pc(hi(["#2563EB", "#0EA5E9", "#6366F1"], ["#BDF4FF", "#7DF9FF", "#FFFFFF"])), rnd(1.1, 1.8), rnd(0.16, 0.3), true, 6);
            dot(g.cx, g.cy, 0, 0, { r: g.h * 0.6, max: 0.12, col: hi("#0EA5E9", "#7DF9FF"), glow: true, al: 0.5 });
            for (k = 0; k < cnt(4); k++) { a = rnd(0, 6.283); dot(g.cx, g.cy, Math.cos(a) * 140, Math.sin(a) * 140, { r: 1.2, max: 0.25, col: hi("#2563EB", "#BDF4FF"), glow: true, dr: 3 }); }
          },
          ink: function (g) {
            var ink = css("--typed", "#222"), asc = ascent(g.font, g.h), k;
            add({ k: "bl", x: g.cx + rnd(-3, 3), y: g.cy + g.h * 0.2, r: g.h * rnd(0.55, 0.9), col: ink, max: 0.5 });
            for (k = 0; k < cnt(6); k++) dot(g.cx + rnd(-g.w / 2, g.w / 2), g.cy + rnd(0, g.h * 0.3), rnd(-30, 30), rnd(-20, 60), { r: rnd(1, 2.6), max: rnd(0.5, 1.0), col: ink, g: 520, dr: 0.6 });
            for (k = 0; k < cnt(3); k++) add({ k: "gs", ox: g.x0, oy: g.y0, w: g.w, s0: rnd(0, g.h * 0.7), sh: rnd(g.h * 0.15, g.h * 0.35), dx: rnd(-1, 1) * 12, ch: g.ch, font: g.font, asc: asc, col: k % 2 ? "#FF2E63" : "#08D9D6", max: rnd(0.14, 0.26), dl: k * 0.05 });
          },
          pixelate: function (g) {
            var ink = css("--typed", "#222"), ac = css("--accent", "#3B82F6"), asc = ascent(g.font, g.h), cells = [4, 7, 12], cvs = [], i, oc, x, sw, sh, k;
            for (i = 0; i < 3; i++) {
              sw = cells[i]; sh = Math.max(2, Math.round(cells[i] * g.h / g.w));
              oc = document.createElement("canvas"); oc.width = sw; oc.height = sh;
              x = oc.getContext("2d"); x.setTransform(sw / g.w, 0, 0, sh / g.h, 0, 0);
              x.font = g.font; x.fillStyle = ink; x.textAlign = "left"; x.textBaseline = "alphabetic"; x.fillText(g.ch, 0, asc);
              cvs.push(oc);
            }
            add({ k: "px", ox: g.x0, oy: g.y0, w: g.w, h: g.h, cvs: cvs, max: 0.34 });
            for (k = 0; k < cnt(5); k++) add({ k: "k", x: g.x0 + rnd(0, g.w), y: g.y0 + rnd(0, g.h), vx: rnd(-80, 80), vy: -rnd(20, 120), g: 300, dr: 1, rot: 0, vr: 0, r: rnd(1.5, 2.6), col: k % 2 ? ink : ac, max: rnd(0.35, 0.6) });
          },
          embers: function (g) {
            var k;
            for (k = 0; k < cnt(9); k++) dot(g.x0 + rnd(0, g.w), g.y0 + g.h * rnd(0.3, 1), rnd(-18, 18), -rnd(25, 100), { r: rnd(0.9, 2.4), max: rnd(0.9, 1.9), col: pc(DK ? FIRE : FIRE.slice(1)), g: -15, dr: 0.4, glow: true, shr: true, sw: rnd(8, 22), ph: rnd(0, 6.28), fl: true });
          }
        };
    
        return {
          destroy: function () {
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
            P.length = 0;
            window.removeEventListener("resize", size);
            c.clearRect(0, 0, W, H);
          },
          has: function (n) { return !!NAMES[n]; },
          effect: function (n, g) {
            if (isReducedMotion() || document.hidden || !NAMES[n] || !g.w || !g.h) return;
            g.cx = g.x0 + g.w / 2; g.cy = g.y0 + g.h / 2; DK = isDark();
            EFX[n](g); run();
          },
          sparks: function (x, y) {
            if (isReducedMotion()) return;
            var k, cl = col();
            for (k = 0; k < 6; k++) P.push({ k: "s", x: x, y: y, vx: rnd(-90, 90), vy: -rnd(60, 190), life: 0, max: rnd(0.35, 0.6), r: rnd(1.2, 2.4), col: cl });
            run();
          },
          ripple: function (x, y) { if (isReducedMotion()) return; P.push({ k: "r", x: x, y: y, life: 0, max: 0.5, col: col() }); run(); },
          confetti: function () {
            if (isReducedMotion()) return;
            var k;
            for (k = 0; k < 110; k++) P.push({ k: "c", x: rnd(0, W), y: -10 - rnd(0, H * 0.2), vx: rnd(-40, 40), vy: rnd(140, 280), rot: rnd(0, 6.28), vr: rnd(-6, 6), life: 0, max: rnd(2.2, 3.4), w: rnd(5, 9), h: rnd(3, 6), col: CONF[Math.floor(Math.random() * CONF.length)] });
            run();
          }
        };
  })();

  return FX;
}
