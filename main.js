/* Prévia do site do visitante no mockup do celular */
function initVisitorPreview() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl =
    params.get("empresa") || params.get("marca") || params.get("nome") || "";

  let brand = fromUrl.trim();
  if (!brand) brand = "Sua Empresa";

  const slug = brandToSlug(brand);
  const initials = brandToInitials(brand);
  const displayHero =
    brand === "Sua Empresa" ? "sua empresa" : brand;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("previewBrand", brand);
  setText("previewHintBrand", displayHero);
  setText("previewFooterBrand", brand);
  setText("previewFooterCopyBrand", brand);
  setText("previewLogoIcon", initials);
  setText("previewUrl", `${slug}.com.br`);
  setText("previewFooterEmail", `contato@${slug}.com.br`);

  const isDefault = brand === "Sua Empresa";

  setText(
    "previewEyebrow",
    isDefault ? "Site profissional" : `Site oficial · ${brand}`
  );

  setText(
    "previewSub",
    isDefault
      ? "Converta visitantes em clientes com um site rápido, moderno e sob medida."
      : `Fortaleça a ${brand} com presença digital moderna, rápida e focada em resultados.`
  );

  setText(
    "previewQuote",
    isDefault
      ? '"Entrega rápida, visual impecável e suporte de verdade."'
      : `"O site da ${brand} ficou profissional e trouxe mais contatos."`
  );

  setText(
    "previewQuoteMeta",
    isDefault ? "Projeto entregue em 2025" : "Parceiro Lowcodee"
  );

  const headline = document.getElementById("previewHeadline");
  if (headline) {
    if (isDefault) {
      headline.innerHTML = `Sua marca em destaque no <em>digital</em>`;
    } else {
      headline.innerHTML = `<em>${escapeHtml(brand)}</em> com presença digital de alto nível`;
    }
  }
}

function brandToSlug(brand) {
  if (brand === "Sua Empresa") return "seunegocio";
  return brand
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24) || "seunegocio";
}

function brandToInitials(brand) {
  if (brand === "Sua Empresa") return "SE";
  const parts = brand.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

initVisitorPreview();

/* Carrossel de tecnologias — loop contínuo sem buracos */
function initTechMarquee() {
  const track = document.getElementById("techTrack");
  const template = track?.querySelector("[data-tech-set]");
  if (!track || !template) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const gap = parseFloat(getComputedStyle(track).gap) || 18;

  const measureSet = () => template.getBoundingClientRect().width + gap;

  const fillTrack = () => {
    track.querySelectorAll(".tech-list:not([data-tech-set])").forEach((el) => el.remove());

    const setWidth = measureSet();
    const minTrackWidth = window.innerWidth * 2 + setWidth;

    let clone = template.cloneNode(true);
    clone.removeAttribute("data-tech-set");
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);

    while (track.scrollWidth < minTrackWidth) {
      clone = template.cloneNode(true);
      clone.removeAttribute("data-tech-set");
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
  };

  const updateAnimation = () => {
    const shift = measureSet();
    track.style.setProperty("--tech-shift", `-${shift}px`);
    const speed = 30;
    const duration = Math.max(20, shift / speed);
    track.style.setProperty("--tech-duration", `${duration}s`);
  };

  fillTrack();
  updateAnimation();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      fillTrack();
      updateAnimation();
    }, 150);
  });
}

initTechMarquee();

const header = document.getElementById("header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobileNav");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let scrollY = 0;

function closeMobileMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.classList.remove("is-open");
  mobileNav.classList.remove("is-open");
  mobileNav.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

function openMobileMenu() {
  if (!menuToggle || !mobileNav) return;
  scrollY = window.scrollY;
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.classList.add("is-open");
  mobileNav.classList.add("is-open");
  mobileNav.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
}

/* Header ao rolar */
const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Menu mobile */
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  if (open) closeMobileMenu();
  else openMobileMenu();
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMobileMenu());
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 960) closeMobileMenu();
});

/* Revelar seções ao rolar */
const revealEls = document.querySelectorAll(".reveal");
const revealRootMargin =
  window.innerWidth < 768 ? "0px 0px -24px 0px" : "0px 0px -40px 0px";

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: window.innerWidth < 768 ? 0.08 : 0.12,
    rootMargin: revealRootMargin,
  }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* Smooth scroll para âncoras (respeita header fixo) */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});
