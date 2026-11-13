/* What makes the service report phone move, copied unchanged from poolnautics-service-report.html
   (Desktop, 2026-11-13): draws each ruler's marks, lets a finger or mouse slide them, keeps each
   reading's status and the LSI current, and works the switches and ticks. The in-range rules and
   the LSI are the app's own (a saltwater, plaster pool). Wrapped to run once per phone, inside
   `scope`, after the page has hydrated (TechniciansSection.jsx), instead of at page load. */
export default function initPnPhones(scope) {
  var IW = 18;            // one mark on a ruler, in px
  var BASELINE_PSI = 16;  // this customer's clean-filter pressure
  // In range between `l` and `h`; critical outside `cl` / `ch`; `ah` = fine, but getting high.
  var BANDS = {
    salt: { cl: 2000, l: 2700, h: 3400, ch: 4500 },
    ta: { cl: 40, l: 60, h: 80, ch: 120 },
    ph: { cl: 6.8, l: 7.2, ah: 7.6, h: 7.8, ch: 8.2 },
    cya: { l: 60, h: 80, ch: 100 },
    ch: { cl: 100, l: 200, h: 400, ch: 500 }
  };
  var TEMP_F = [[32, 0], [37, 0.1], [46, 0.2], [53, 0.3], [60, 0.4], [66, 0.5], [76, 0.6], [84, 0.7], [94, 0.8], [105, 0.9]];
  var CALCIUM_F = [[25, 1], [50, 1.3], [75, 1.5], [100, 1.6], [125, 1.7], [150, 1.8], [200, 1.9], [250, 2], [300, 2.1], [400, 2.2], [800, 2.5]];
  var ALK_F = [[25, 1.4], [50, 1.7], [75, 1.9], [100, 2], [125, 2.1], [150, 2.2], [200, 2.3], [250, 2.4], [300, 2.5], [400, 2.6], [800, 2.9]];
  var ICON = { "In Range": "check", "Acceptable": "check", "High": "arrow-up", "Low": "arrow-down", "Critical": "alert" };
  var TONE = { "In Range": "is-ok", "Acceptable": "is-acc", "High": "is-bad", "Low": "is-bad", "Critical": "is-crit" };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lookup(table, v) {
    var n = table.length - 1;
    if (v <= table[0][0]) return table[0][1];
    if (v >= table[n][0]) return table[n][1];
    for (var i = 0; i < n; i++) {
      if (v <= table[i + 1][0]) return table[i][1] + ((v - table[i][0]) / (table[i + 1][0] - table[i][0])) * (table[i + 1][1] - table[i][1]);
    }
    return table[n][1];
  }
  function flag(v, b) {
    if (b.cl !== undefined && v < b.cl) return "Critical";
    if (b.l !== undefined && v < b.l) return "Low";
    if (b.ch !== undefined && v > b.ch) return "Critical";
    if (b.h !== undefined && v > b.h) return "High";
    if (b.ah !== undefined && v > b.ah) return "Acceptable";
    return "In Range";
  }

  Array.prototype.forEach.call(scope.querySelectorAll(".pn-phone"), function (root) {
    if (root.pnReady) return;
    root.pnReady = true;
    var readings = {};

    /** A reading's number; null while it's not recorded (the ruler's first mark). */
    function val(key) {
      var r = readings[key];
      return r && r.index > 0 ? r.values[r.index] : null;
    }

    function statusOf(key) {
      var v = val(key);
      if (v === null) return "";
      if (BANDS[key]) return flag(v, BANDS[key]);
      if (key === "fc") {
        var cya = val("cya");
        if (cya) return v < cya * 0.075 ? "Critical" : v < cya * 0.125 ? "Acceptable" : v > cya * 0.15 ? "High" : "In Range";
        return v < 1 ? "Critical" : v < 2 ? "Low" : v > 5 ? "High" : "In Range";
      }
      if (key === "tc") {
        var fc = val("fc");
        if (fc === null) return "";
        return v - fc >= 1 ? "Critical" : v - fc > 0.4 ? "High" : "In Range";
      }
      if (key === "pressure") return v >= BASELINE_PSI + 8 ? "High" : "In Range";
      return "";
    }

    function paintLsi() {
      var card = root.querySelector("[data-pn-lsi]");
      if (!card) return;
      var ph = val("ph"), ta = val("ta"), ch = val("ch"), temp = val("temp"), salt = val("salt"), cya = val("cya") || 0;
      var missing = [];
      if (ph === null) missing.push("pH");
      if (!ta) missing.push("Total Alkalinity");
      if (!ch) missing.push("Calcium Hardness");
      if (temp === null) missing.push("Water Temperature");
      if (!salt) missing.push("Salt Level");
      var valueEl = card.querySelector("[data-pn-lsi-value]");
      var needle = card.querySelector("[data-pn-lsi-needle]");
      var note = card.querySelector("[data-pn-lsi-note]");
      card.classList.toggle("is-missing", missing.length > 0);
      if (missing.length) {
        card.classList.remove("is-acc", "is-bad");
        valueEl.textContent = "Incomplete";
        needle.style.left = "50%";
        note.textContent = "Still needed to calculate LSI: " + missing.join(", ");
        return;
      }
      // Carbonate alkalinity: the part of the alkalinity reading that isn't the stabilizer's.
      var carbonate = Math.max(0, ta - (cya > 0 ? (cya * 0.38772) / (1 + Math.pow(10, 6.83 - ph)) : 0));
      var lsi = ph + lookup(CALCIUM_F, ch) + lookup(ALK_F, Math.max(carbonate, 25)) + lookup(TEMP_F, temp) - 12.2;
      lsi = Math.round(lsi * 100) / 100;
      var label = lsi < -0.5 ? "Corrosive" : lsi < -0.3 ? "Slightly Corrosive" : lsi <= 0.3 ? "Balanced" : lsi <= 0.5 ? "Slightly Scaling" : "Scale Forming";
      card.classList.toggle("is-bad", lsi < -0.5 || lsi > 0.5);
      card.classList.toggle("is-acc", (lsi >= -0.5 && lsi < -0.3) || (lsi > 0.3 && lsi <= 0.5));
      valueEl.textContent = (lsi > 0 ? "+" : "") + lsi.toFixed(2);
      card.querySelector("[data-pn-lsi-label]").textContent = label;
      needle.style.left = clamp(((lsi + 1.5) / 3) * 100, 0, 100) + "%";
      note.innerHTML = "Ideal range: <b>−0.3 to +0.3</b>";
    }

    function paint() {
      Object.keys(readings).forEach(function (key) {
        var r = readings[key];
        var text = r.index > 0 ? r.values[r.index].toFixed(r.decimals) : "";
        var status = statusOf(key);
        r.out.textContent = text || "–";
        r.el.classList.toggle("is-empty", !text);
        r.el.classList.toggle("is-warn", status === "High" || status === "Low" || status === "Critical");
        r.strip.setAttribute("aria-valuenow", r.values[r.index]);
        r.strip.setAttribute("aria-valuetext", text || "Not recorded");
        if (r.status !== status) {
          r.status = status;
          r.flag.innerHTML = status
            ? '<span class="pn-flag ' + TONE[status] + '"><svg width="12" height="12"><use href="#pn-' + ICON[status] + '"/></svg>' + status + "</span>"
            : "";
        }
      });
      paintLsi();
    }

    // ── The rulers ──
    Array.prototype.forEach.call(root.querySelectorAll(".pn-reading"), function (el) {
      var min = +el.dataset.min, max = +el.dataset.max, step = +el.dataset.step;
      var majorEvery = +(el.dataset.major || 5);
      var decimals = step < 1 ? 1 : 0;
      var values = [];
      for (var i = 0; i < 2000; i++) {
        var v = +(min + i * step).toFixed(decimals);
        if (v > max + 1e-9) break;
        values.push(v);
      }
      var last = values.length - 1;
      var index = 0;
      if (el.dataset.value !== undefined) {
        values.forEach(function (v, i) { if (Math.abs(v - +el.dataset.value) < Math.abs(values[index] - +el.dataset.value)) index = i; });
      }

      var strip = el.querySelector(".pn-strip");
      strip.setAttribute("aria-valuemin", min);
      strip.setAttribute("aria-valuemax", values[last]);
      strip.innerHTML = '<div class="pn-strip__view"><div class="pn-strip__ruler"></div></div>';
      var ruler = strip.firstChild.firstChild;
      ruler.innerHTML = values.map(function (v, i) {
        var at = ' style="left:' + i * IW + 'px"';
        if (i % majorEvery === 0) return "<b" + at + "><i></i>" + v.toFixed(decimals) + "</b>";
        return "<i" + (i % 2 === 0 ? ' class="m"' : "") + at + "></i>";
      }).join("");

      var r = readings[el.dataset.key] = {
        el: el, strip: strip, values: values, decimals: decimals, index: index, status: null,
        out: el.querySelector(".pn-reading__val span"), flag: el.querySelector(".pn-reading__flag")
      };
      var pos = index;

      /** Put mark `p` under the needle (it can sit between two marks mid-drag). */
      function place(p, glide) {
        pos = p;
        ruler.style.transition = glide ? "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
        ruler.style.transform = "translateX(" + -p * IW + "px)";
        var nearest = clamp(Math.round(p), 0, last);
        if (nearest !== r.index) { r.index = nearest; paint(); }
      }
      place(index, false);

      strip.addEventListener("pointerdown", function (down) {
        if (down.button) return;
        // The phone may be drawn smaller or larger than life (--pn-zoom): a finger's travel is in page px.
        var zoom = parseFloat(getComputedStyle(root).zoom) || 1;
        var startX = down.clientX, startPos = pos, lastX = startX, lastT = down.timeStamp, speed = 0;
        function move(e) {
          if (e.pointerId !== down.pointerId) return;
          var dt = e.timeStamp - lastT;
          if (dt > 0) { speed = clamp(0.6 * speed + 0.4 * ((e.clientX - lastX) / dt), -3, 3); lastX = e.clientX; lastT = e.timeStamp; }
          place(clamp(startPos - (e.clientX - startX) / zoom / IW, 0, last), false);
        }
        function up(e) {
          if (e.pointerId !== down.pointerId) return;
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
          // Let go: it glides a little the way it was moving, then rests on a mark.
          var coast = e.timeStamp - lastT < 80 ? (speed * 140) / zoom / IW : 0;
          place(clamp(Math.round(pos - coast), 0, last), true);
        }
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
      });
      strip.addEventListener("keydown", function (e) {
        var by = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
        if (!by) return;
        e.preventDefault();
        place(clamp(r.index + by, 0, last), true);
      });
    });
    paint();

    // ── Switches, ticks, sections, the water level ──
    root.addEventListener("click", function (e) {
      var flip = e.target.closest("[data-pn-flip]");
      if (flip) {
        var on = flip.closest("[data-pn-item]").classList.toggle("is-on");
        ["aria-checked", "aria-pressed", "aria-expanded"].forEach(function (a) {
          if (flip.hasAttribute(a)) flip.setAttribute(a, String(on));
        });
        return;
      }
      var stop = e.target.closest("[data-pn-level]");
      if (stop) {
        var block = stop.closest("[data-level]");
        block.dataset.level = stop.dataset.pnLevel;
        Array.prototype.forEach.call(block.querySelectorAll("[data-pn-level]"), function (b, i) {
          b.setAttribute("aria-pressed", String(b === stop));
          block.querySelectorAll(".pn-level__labels span")[i].classList.toggle("is-on", b === stop);
        });
      }
    });
  });
}
