const loader = document.querySelector(".loader");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const typedText = document.querySelector("#typed-text");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const spotlight = document.querySelector(".spotlight");

const roles = [
  "Data Analyst",
  "Machine Learning Enthusiast",
  "Python Developer",
  "Business Intelligence Learner"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("loaded"), 850);
});

function typeRole() {
  const current = roles[roleIndex];
  typedText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeRole, 58);
    return;
  }
  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }
  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 32);
    return;
  }
  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 180);
}
typeRole();

function updateScrollState() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (scrollTop / max) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("scrolled", scrollTop > 28);
  backToTop.classList.toggle("visible", scrollTop > 700);
}
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("vk-theme", document.body.classList.contains("light") ? "light" : "dark");
});

if (localStorage.getItem("vk-theme") === "light") {
  document.body.classList.add("light");
}

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll(".btn, .project-actions a, .project-actions button, .contact-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const number = entry.target.querySelector("[data-count]");
    const target = Number(number.dataset.count);
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      number.textContent = Math.round(target * eased).toLocaleString();
      if (progressValue < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    statObserver.unobserve(entry.target);
  });
}, { threshold: .45 });

document.querySelectorAll(".stat").forEach((stat) => statObserver.observe(stat));

const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-40% 0px -50% 0px" });
sections.forEach((section) => activeObserver.observe(section));

let ringX = 0;
let ringY = 0;
let dotX = 0;
let dotY = 0;
window.addEventListener("pointermove", (event) => {
  dotX = event.clientX;
  dotY = event.clientY;
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
  if (cursorDot) {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
  }
});

function animateCursor() {
  ringX += (dotX - ringX) * .16;
  ringY += (dotY - ringY) * .16;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursorRing?.style.setProperty("width", "48px");
    cursorRing?.style.setProperty("height", "48px");
  });
  element.addEventListener("mouseleave", () => {
    cursorRing?.style.setProperty("width", "34px");
    cursorRing?.style.setProperty("height", "34px");
  });
});

window.addEventListener("scroll", () => {
  const offset = window.scrollY * .08;
  spotlight.style.transform = `translateY(${offset}px)`;
}, { passive: true });
