// @ts-nocheck
/**
 * Bookkeys' original synthesized key sounds and mistake thud.
 * Audio is created only after the user types, preserving browser autoplay rules.
 */
export function createBookkeysSoundEngine(getSettings) {
  const SND = (() => {
        var ctx = null, buf = null;
        function ac() {
          if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
          if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
          return ctx;
        }
        function noise(a) {
          if (!buf) {
            buf = a.createBuffer(1, Math.round(a.sampleRate * 0.08), a.sampleRate);
            var d = buf.getChannelData(0), i;
            for (i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          }
          return buf;
        }
        function vol() { return getSettings().volume / 100; }
        function tone(a, f, type, dur, g0) {
          var o = a.createOscillator(), g = a.createGain(), n = a.currentTime;
          o.type = type; o.frequency.value = f;
          g.gain.setValueAtTime(g0 * vol(), n); g.gain.exponentialRampToValueAtTime(0.001, n + dur);
          o.connect(g); g.connect(a.destination); o.start(n); o.stop(n + dur + 0.02);
        }
        function key(nl) {
          if (getSettings().sound === "off") return;
          var a = ac(); if (!a) return;
          var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), n = a.currentTime, kind = getSettings().sound;
          s.buffer = noise(a); f.type = "bandpass";
          f.frequency.value = kind === "click" ? 2300 + Math.random() * 400 : kind === "soft" ? 900 + Math.random() * 150 : 1500 + Math.random() * 300;
          f.Q.value = kind === "soft" ? 0.8 : 1.6;
          g.gain.setValueAtTime((kind === "soft" ? 0.5 : 1) * vol(), n);
          g.gain.exponentialRampToValueAtTime(0.001, n + (kind === "soft" ? 0.06 : 0.045));
          s.connect(f); f.connect(g); g.connect(a.destination); s.start(n); s.stop(n + 0.08);
          if (kind === "typewriter") tone(a, 150, "sine", 0.05, 0.5);
          if (kind === "typewriter" && nl) { tone(a, 2093, "sine", 0.9, 0.22); tone(a, 2637, "sine", 0.7, 0.12); }
        }
        function err() {
          if (getSettings().sound === "off" || !getSettings().errSound) return;
          var a = ac(); if (a) tone(a, 110, "triangle", 0.1, 0.5);
        }
        return {
          key: key,
          err: err,
          destroy: function () {
            if (ctx && ctx.state !== "closed") void ctx.close();
            ctx = null;
            buf = null;
          },
        };
  })();
  return SND;
}
