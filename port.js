const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar a");
const header = document.querySelector(".header");
const menuToggle = document.querySelector("#check");
const roleText = document.querySelector(".role-text");
const projectCarousel = document.querySelector("[data-project-carousel]");
const projects = (window.portfolioProjects || []).filter((project) => project.featured !== false);

function updateActiveNavigation() {
  const scrollPosition = window.scrollY + 180;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    }
  });

  header.classList.toggle("sticky", window.scrollY > 40);
}

window.addEventListener("scroll", updateActiveNavigation);
window.addEventListener("load", updateActiveNavigation);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (menuToggle) {
      menuToggle.checked = false;
    }
  });
});

if (roleText) {
  const roles = roleText.dataset.roles.split(",").map((role) => role.trim());
  let roleIndex = 0;

  if (roles.length > 1) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.style.opacity = "0";

      setTimeout(() => {
        roleText.textContent = roles[roleIndex];
        roleText.style.opacity = "1";
      }, 220);
    }, 2600);
  }
}

function initProjectCarousel() {
  if (!projectCarousel || projects.length === 0) {
    return;
  }

  const stage = projectCarousel.querySelector("[data-carousel-stage]");
  const dots = projectCarousel.querySelector("[data-carousel-dots]");
  const prevButton = projectCarousel.querySelector("[data-carousel-prev]");
  const nextButton = projectCarousel.querySelector("[data-carousel-next]");
  const slideDelay = 4200;
  let activeIndex = 0;
  let autoSlideId;

  const normalizeIndex = (index) => (index + projects.length) % projects.length;
  const linkAttrs = (url) => (url.startsWith("#") ? "" : ' target="_blank" rel="noopener noreferrer"');

  stage.innerHTML = projects
    .map(
      (project, index) => `
        <article class="carousel-card" data-project-card aria-hidden="${index === 0 ? "false" : "true"}">
          <img src="${project.image}" alt="${project.alt}" />
          <div class="carousel-card-content">
            <div>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
            </div>
            <div class="project-tags">
              ${project.tech.map((item) => `<span>${item}</span>`).join("")}
            </div>
            <div class="project-links">
              <a href="${project.liveUrl}"${linkAttrs(project.liveUrl)} aria-label="View ${project.title}">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                View Project
              </a>
              <a href="${project.githubUrl}"${linkAttrs(project.githubUrl)} aria-label="Open ${project.title} on GitHub">
                <i class="fa-brands fa-github"></i>
                GitHub
              </a>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  dots.innerHTML = projects
    .map(
      (project, index) => `
        <button class="carousel-dot" type="button" data-carousel-dot="${index}" aria-label="Show ${project.title}"></button>
      `
    )
    .join("");

  const cards = projectCarousel.querySelectorAll("[data-project-card]");
  const dotButtons = projectCarousel.querySelectorAll("[data-carousel-dot]");

  function updateCarousel() {
    const prevIndex = normalizeIndex(activeIndex - 1);
    const nextIndex = normalizeIndex(activeIndex + 1);

    cards.forEach((card, index) => {
      card.className = "carousel-card";
      card.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");

      if (index === activeIndex) {
        card.classList.add("is-active");
      } else if (index === prevIndex) {
        card.classList.add("is-prev");
      } else if (index === nextIndex) {
        card.classList.add("is-next");
      }
    });

    dotButtons.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  }

  function goToProject(index) {
    activeIndex = normalizeIndex(index);
    updateCarousel();
  }

  function goToNextProject() {
    goToProject(activeIndex + 1);
  }

  function goToPreviousProject() {
    goToProject(activeIndex - 1);
  }

  function stopAutoSlide() {
    window.clearInterval(autoSlideId);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideId = window.setInterval(goToNextProject, slideDelay);
  }

  prevButton.addEventListener("click", () => {
    goToPreviousProject();
    startAutoSlide();
  });

  nextButton.addEventListener("click", () => {
    goToNextProject();
    startAutoSlide();
  });

  dotButtons.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToProject(Number(dot.dataset.carouselDot));
      startAutoSlide();
    });
  });

  projectCarousel.addEventListener("mouseenter", stopAutoSlide);
  projectCarousel.addEventListener("mouseleave", startAutoSlide);
  projectCarousel.addEventListener("focusin", stopAutoSlide);
  projectCarousel.addEventListener("focusout", (event) => {
    if (!projectCarousel.contains(event.relatedTarget)) {
      startAutoSlide();
    }
  });

  updateCarousel();
  startAutoSlide();
}

initProjectCarousel();

if (typeof ScrollReveal !== "undefined") {
  ScrollReveal({
    distance: "45px",
    duration: 900,
    delay: 120,
    easing: "ease-out",
    reset: false,
  });

  ScrollReveal().reveal(".home-content, .section-heading", { origin: "top" });
  ScrollReveal().reveal(".home-visual, .project-carousel", { origin: "bottom" });
  ScrollReveal().reveal(".summary-item, .skill-card", { origin: "bottom", interval: 100 });
  ScrollReveal().reveal(".about-img", { origin: "left" });
  ScrollReveal().reveal(".about-content, .contact form", { origin: "right" });
}
