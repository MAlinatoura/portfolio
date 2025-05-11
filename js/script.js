// === THEME MANAGEMENT ===
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("preferredTheme", theme);
  restartTagCanvas();

  const toggleBtn = document.querySelector(".theme-toggle");
  if (toggleBtn) {
    toggleBtn.innerText = theme === "light" ? "🌞" : "🌙";
  }
}

function applyStoredTheme() {
  const storedTheme = localStorage.getItem("preferredTheme");
  if (storedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

function addThemeToggleButton() {
  if (document.querySelector('.theme-toggle')) return;

  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.innerText = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
  button.addEventListener("click", toggleTheme);
  document.body.appendChild(button);
}

// === TAGCANVAS ===
function restartTagCanvas() {
  try {
    TagCanvas.Delete("skillCanvas");
    const isLight = document.body.classList.contains("light-mode");

    TagCanvas.Start("skillCanvas", "skills", {
      textColour: isLight ? "#121212" : "#f0f0f0",
      outlineColour: "transparent",
      reverse: true,
      depth: 0.10,
      maxSpeed: 0.1,
      initial: [0.05, -0.01],
      wheelZoom: false,
      dragControl: true,
      textFont: 'Segoe UI, Tahoma, sans-serif',
      textHeight: 16,
      shadowBlur: 0,
    });
  } catch (e) {
    console.warn("TagCanvas konnte nicht gestartet werden:", e);
  }
}

// === INIT ===
document.addEventListener("DOMContentLoaded", function () {
  applyStoredTheme();
  addThemeToggleButton();

  // Zeige #danke Hinweis
  const danke = document.getElementById("danke");
  if (window.location.hash === "#danke" && danke) {
    danke.style.display = "block";
  }

  // TagCanvas initialisieren (wenn vorhanden)
  const canvas = document.getElementById("skillCanvas");
  if (canvas) restartTagCanvas();

  // Scroll-Animation für .fade-in-scroll & .timeline-entry
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  // Kombiniert beide Selektoren
  document.querySelectorAll(".fade-in-scroll, .timeline-entry").forEach(el => {
    observer.observe(el);
  });

  // Falls .edu-card noch keine fade-in-scroll hat
  document.querySelectorAll(".edu-card").forEach(card => {
    card.classList.add("fade-in-scroll");
  });
});
function typeCode(id, code, speed = 50) {
  const el = document.getElementById(id);
  let i = 0;
  function type() {
    if (i < code.length) {
      el.innerHTML += code.charAt(i) === "\n" ? "<br>" : code.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

document.addEventListener("DOMContentLoaded", function () {
  const javaSnippet = `
public class Main {
  public static void main(String[] args) {
    System.out.println("Ich liebe Open Source! ❤️");
  }
}`;
  typeCode("javaCode", javaSnippet, 35);
});
