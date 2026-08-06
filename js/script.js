/**
 * Ali Natoura Portfolio – Script
 * Theme, TagCanvas, Scroll-Animation, Code-Typing
 */

// === THEME ===
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("preferredTheme", theme);
  restartTagCanvas();

  const btn = document.querySelector(".theme-toggle");
  if (btn) btn.textContent = theme === "light" ? "🌞" : "🌙";
}

function applyStoredTheme() {
  if (localStorage.getItem("preferredTheme") === "light") {
    document.body.classList.add("light-mode");
  }
}

function addThemeToggleButton() {
  if (document.querySelector(".theme-toggle")) return;
  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.setAttribute("aria-label", "Theme umschalten");
  btn.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
  btn.addEventListener("click", toggleTheme);
  document.body.appendChild(btn);
}

// === TAGCANVAS ===
function restartTagCanvas() {
  const canvas = document.getElementById("skillCanvas");
  if (!canvas || typeof TagCanvas === "undefined") return;

  try {
    TagCanvas.Delete("skillCanvas");
    const isLight = document.body.classList.contains("light-mode");
    TagCanvas.Start("skillCanvas", "skills", {
      textColour: isLight ? "#1a1d24" : "#e8eaed",
      outlineColour: "transparent",
      reverse: true,
      depth: 0.12,
      maxSpeed: 0.08,
      initial: [0.04, -0.01],
      wheelZoom: false,
      dragControl: true,
      textFont: "Segoe UI, system-ui, sans-serif",
      textHeight: 15,
      shadowBlur: 0,
      weight: true,
      weightMode: "size"
    });
  } catch (e) {
    console.warn("TagCanvas:", e);
  }
}

// === CODE TYPING (Programming Tricks) ===
function typeCode(elementId, code, speed = 28) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = "";
  let i = 0;
  function type() {
    if (i < code.length) {
      el.textContent += code.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

const pythonSnippet = `def automate_fttx_check(records):
    """Qualitätssicherung vor dem GIS-Export."""
    valid = []
    for r in records:
        if r.get("length_m", 0) > 0 and r.get("trasse_id"):
            valid.append(r)
        else:
            log_error(r)
    return valid

# Reduziert manuelle Prüfzeit spürbar`;

const javaSnippet = `@RestController
@RequestMapping("/api/trassen")
public class TrasseController {

  @PostMapping
  public ResponseEntity<?> create(
      @Valid @RequestBody TrasseDto dto) {
    // Validierung + Persistenz
    return ResponseEntity
        .status(201)
        .body(service.save(dto));
  }
}`;

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  addThemeToggleButton();

  // Thank-you message after form submit
  const danke = document.getElementById("danke");
  if (window.location.hash === "#danke" && danke) {
    danke.style.display = "block";
  }

  // TagCanvas
  if (document.getElementById("skillCanvas")) {
    // small delay so TagCanvas script is ready
    setTimeout(restartTagCanvas, 200);
  }

  // Code typing demos
  typeCode("pythonCode", pythonSnippet, 22);
  typeCode("javaCode", javaSnippet, 18);

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".fade-in-scroll, .edu-card").forEach((el) => {
    el.classList.add("fade-in-scroll");
    observer.observe(el);
  });
});
