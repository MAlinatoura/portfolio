/*
 * Portfolio interactions
 * Every controller is optional so sections remain functional when markup changes or JavaScript is unavailable.
 */

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    navigation.classList.toggle("open", isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("open");
    });
  });
}

/** Moves focus along a tablist with the arrow keys, as expected of the tab role. */
function bindRovingKeys(tabs, activate) {
  const offsets = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      const target = event.key in offsets ? index + offsets[event.key]
        : event.key === "Home" ? 0
        : event.key === "End" ? tabs.length - 1
        : null;
      if (target === null) return;
      event.preventDefault();
      activate((target + tabs.length) % tabs.length, { focus: true });
    });
  });
}

/**
 * Builds dot navigation for a set of panels where exactly one is visible.
 * Hidden panels are made inert so keyboard focus never lands inside them.
 */
function setupPager({ itemSelector, dotsSelector, previousSelector, nextSelector, dotClass, label }) {
  const panels = [...document.querySelectorAll(itemSelector)];
  const dotsHost = document.querySelector(dotsSelector);
  if (!panels.length || !dotsHost) return;

  let activeIndex = 0;
  const dots = panels.map((panel, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = dotClass;
    dot.id = `${panel.id}-tab`;
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-controls", panel.id);
    dot.setAttribute("aria-label", `${label} ${index + 1} von ${panels.length}`);
    dot.addEventListener("click", () => setActive(index, { focus: true }));
    dotsHost.append(dot);
    panel.setAttribute("aria-labelledby", dot.id);
    return dot;
  });

  function setActive(nextIndex, { focus = false } = {}) {
    activeIndex = (nextIndex + panels.length) % panels.length;
    panels.forEach((panel, index) => {
      const isActive = index === activeIndex;
      const distance = (index - activeIndex + panels.length) % panels.length;
      panel.classList.toggle("is-active", isActive);
      panel.classList.toggle("is-after", distance === 1);
      panel.classList.toggle("is-before", distance === panels.length - 1);
      // inert removes the panel from both the tab order and the accessibility tree,
      // so unlike aria-hidden it cannot leave focusable controls stranded in hidden content.
      panel.toggleAttribute("inert", !isActive);
    });
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
    if (focus) dots[activeIndex].focus();
  }

  dotsHost.setAttribute("aria-orientation", "horizontal");
  bindRovingKeys(dots, setActive);
  document.querySelector(previousSelector)?.addEventListener("click", () => setActive(activeIndex - 1));
  document.querySelector(nextSelector)?.addEventListener("click", () => setActive(activeIndex + 1));
  setActive(0);
}

setupPager({ itemSelector: "[data-process-model]", dotsSelector: ".process-dots", previousSelector: "[data-process-prev]", nextSelector: "[data-process-next]", dotClass: "process-dot", label: "Schwerpunkt" });
setupPager({ itemSelector: "[data-skill-card]", dotsSelector: ".skill-dots", previousSelector: "[data-skill-prev]", nextSelector: "[data-skill-next]", dotClass: "skill-dot", label: "Kompetenz" });

// Only one delivery phase is expanded at a time within each model.
document.querySelectorAll(".process-model").forEach((model) => {
  const steps = [...model.querySelectorAll("[data-process-step]")];
  steps.forEach((step) => {
    step.addEventListener("click", () => {
      steps.forEach((item) => {
        const isActive = item === step;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-expanded", String(isActive));
      });
    });
  });
});

// Career nodes update one shared spotlight instead of duplicating the same content in cards.
const careerTabs = [...document.querySelectorAll("[data-career-node]")];
const spotlight = document.querySelector(".career-spotlight");

if (careerTabs.length && spotlight) {
  const fields = {
    period: spotlight.querySelector(".spotlight-period"),
    focus: spotlight.querySelector(".spotlight-focus"),
    role: spotlight.querySelector("h3"),
    company: spotlight.querySelector(".spotlight-company"),
    copy: spotlight.querySelector(".spotlight-copy"),
    progress: spotlight.querySelector(".spotlight-progress")
  };

  function showStation(index, { focus = false } = {}) {
    const tab = careerTabs[index];
    careerTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });
    fields.period.textContent = tab.dataset.period;
    fields.focus.textContent = tab.dataset.focus;
    fields.role.textContent = tab.dataset.role;
    fields.company.textContent = tab.dataset.company;
    fields.copy.textContent = tab.dataset.copy;
    spotlight.setAttribute("aria-labelledby", tab.id);

    const position = document.createElement("span");
    position.textContent = String(index + 1).padStart(2, "0");
    const total = document.createElement("span");
    total.textContent = String(careerTabs.length).padStart(2, "0");
    fields.progress.replaceChildren(position, document.createElement("i"), total);

    if (focus) tab.focus();
  }

  careerTabs.forEach((tab, index) => tab.addEventListener("click", () => showStation(index)));
  bindRovingKeys(careerTabs, showStation);
  showStation(0);
}

// Opening sequence: binary particles converge into a data sphere, once per session and skippable.
const entrySequence = document.querySelector(".entry-sequence");

if (entrySequence && document.documentElement.dataset.entry === "seen") {
  // Already played in this session: drop it without building any particles.
  entrySequence.remove();
} else if (entrySequence) {
  const timers = [];
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    timers.forEach(window.clearTimeout);
    entrySequence.classList.add("is-exiting");
    window.setTimeout(() => entrySequence.remove(), 550);
    try {
      window.sessionStorage.setItem("entry-seen", "1");
    } catch (error) {
      // Private browsing can block storage; the sequence simply plays again.
    }
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach((type) =>
      window.removeEventListener(type, dismiss));
  };

  ["pointerdown", "keydown", "wheel", "touchstart"].forEach((type) =>
    window.addEventListener(type, dismiss, { passive: true }));

  const binaryField = entrySequence.querySelector(".entry-binary");
  const particleCount = 52;

  for (let index = 0; index < particleCount; index += 1) {
    const digit = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 112;
    digit.className = "entry-digit";
    digit.textContent = Math.random() > 0.5 ? "1" : "0";
    digit.style.setProperty("--start-x", `${Math.round((Math.random() - 0.5) * 105)}vw`);
    digit.style.setProperty("--target-x", `${Math.round(Math.cos(angle) * radius)}px`);
    digit.style.setProperty("--target-y", `${Math.round(Math.sin(angle) * radius)}px`);
    digit.style.setProperty("--delay", `${Math.round(Math.random() * 220)}ms`);
    binaryField.append(digit);
  }

  timers.push(window.setTimeout(() => entrySequence.classList.add("is-formed"), 700));
  timers.push(window.setTimeout(dismiss, 1500));
}
