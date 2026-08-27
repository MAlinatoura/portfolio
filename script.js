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

/** Creates accessible dot navigation for a single active item at a time. */
function setupPager({ itemSelector, dotsSelector, previousSelector, nextSelector, dotClass }) {
  const items = [...document.querySelectorAll(itemSelector)];
  const dotsHost = document.querySelector(dotsSelector);
  if (!items.length || !dotsHost) return;

  let activeIndex = 0;
  const dots = items.map((item, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = dotClass;
    dot.setAttribute("aria-label", `Eintrag ${index + 1} anzeigen`);
    dot.addEventListener("click", () => setActive(index));
    dotsHost.append(dot);
    return dot;
  });

  function setActive(nextIndex) {
    activeIndex = (nextIndex + items.length) % items.length;
    items.forEach((item, index) => {
      const distance = (index - activeIndex + items.length) % items.length;
      item.classList.toggle("is-active", index === activeIndex);
      item.classList.toggle("is-after", distance === 1);
      item.classList.toggle("is-before", distance === items.length - 1);
      item.setAttribute("aria-hidden", String(index !== activeIndex));
    });
    dots.forEach((dot, index) => dot.setAttribute("aria-selected", String(index === activeIndex)));
  }

  document.querySelector(previousSelector)?.addEventListener("click", () => setActive(activeIndex - 1));
  document.querySelector(nextSelector)?.addEventListener("click", () => setActive(activeIndex + 1));
  setActive(0);
}

setupPager({ itemSelector: "[data-process-model]", dotsSelector: ".process-dots", previousSelector: "[data-process-prev]", nextSelector: "[data-process-next]", dotClass: "process-dot" });
setupPager({ itemSelector: "[data-skill-card]", dotsSelector: ".skill-dots", previousSelector: "[data-skill-prev]", nextSelector: "[data-skill-next]", dotClass: "skill-dot" });

// Only one delivery phase is expanded at a time within each model.
document.querySelectorAll(".process-model").forEach((model) => {
  model.querySelectorAll("[data-process-step]").forEach((step) => {
    step.addEventListener("click", () => {
      model.querySelectorAll("[data-process-step]").forEach((item) => item.classList.toggle("is-active", item === step));
    });
  });
});

// Career nodes update one shared spotlight instead of duplicating the same content in cards.
const careerNodes = [...document.querySelectorAll("[data-career-node]")];
const spotlight = document.querySelector(".career-spotlight");

if (careerNodes.length && spotlight) {
  const fields = {
    period: spotlight.querySelector(".spotlight-period"),
    focus: spotlight.querySelector(".spotlight-focus"),
    role: spotlight.querySelector("h3"),
    company: spotlight.querySelector(".spotlight-company"),
    copy: spotlight.querySelector(".spotlight-copy"),
    progress: spotlight.querySelector(".spotlight-progress")
  };

  careerNodes.forEach((node, index) => {
    node.addEventListener("click", () => {
      careerNodes.forEach((item) => {
        const isSelected = item === node;
        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-selected", String(isSelected));
      });
      fields.period.textContent = node.dataset.period;
      fields.focus.textContent = node.dataset.focus;
      fields.role.textContent = node.dataset.role;
      fields.company.textContent = node.dataset.company;
      fields.copy.textContent = node.dataset.copy;
      fields.progress.replaceChildren();
      ["0" + (index + 1), "04"].forEach((label, position) => {
        const element = document.createElement(position === 1 ? "span" : "span");
        element.textContent = label;
        fields.progress.append(element);
        if (position === 0) fields.progress.append(document.createElement("i"));
      });
    });
  });
}


// Opening sequence: lightweight binary particles converge into a data sphere before the hero appears.
const entrySequence = document.querySelector(".entry-sequence");

if (entrySequence && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    digit.style.setProperty("--delay", `${Math.round(Math.random() * 420)}ms`);
    binaryField.append(digit);
  }

  window.setTimeout(() => entrySequence.classList.add("is-formed"), 1450);
  window.setTimeout(() => entrySequence.classList.add("is-exiting"), 3450);
  window.setTimeout(() => entrySequence.remove(), 4100);
}
