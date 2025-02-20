document.addEventListener("DOMContentLoaded", function () {
  // Detect if it's mobile / small screen
  const isMobile = window.innerWidth < 768;

  // Speed factors
  const aboutTitleSpeed    = isMobile ? 0.6 : 0.3;
  const projectsTitleSpeed = isMobile ? 1.2 : 0.5;

  // Query elements once
  const aboutTitle = document.querySelector('.about-title');
  const projectsTitle = document.querySelector('.projects-title');
  const skills = document.querySelectorAll('.skill');
  const continualLearning = document.querySelector('.continual-learning');
  const educationContainer = document.querySelector(".education-container");
  
  const socialIcons = document.querySelector(".social-icons");
  const icons = document.querySelectorAll(".icon-link svg");

  let skillState = false;

  // The single scroll handler
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // ---------- 1) ABOUT-TITLE PARALLAX ----------
    aboutTitle.style.transform = `translateY(${-scrollY * aboutTitleSpeed}px)`;

    // ---------- 2) SKILL BARS LOGIC ----------
    if (scrollY >= 600 && !skillState) {
      skillState = true;
      skills.forEach(skill => {
        const level = skill.getAttribute('data-level') || '50';
        skill.style.width = level + '%';
      });
    } else if (scrollY <= 600 && skillState) {
      skillState = false;
      skills.forEach(skill => {
        skill.style.width = '0';
      });
    }

    // ---------- 3) .continual-learning BLUR ----------
    if (scrollY >= 1450) {
      continualLearning.style.filter = "blur(0px)";
    } else {
      continualLearning.style.filter = "blur(10px)";
    }

    // ---------- 4) PROJECTS-TITLE PARALLAX ----------
    const startScroll = 1100;
    const endScroll   = 1950;
    const maxDistance = (endScroll - startScroll) * projectsTitleSpeed;

    if (scrollY < startScroll) {
      projectsTitle.style.transform = 'translateY(0px)';
    } else if (scrollY > endScroll) {
      projectsTitle.style.transform = `translateY(${maxDistance}px)`;
    } else {
      const distance = (scrollY - startScroll) * projectsTitleSpeed;
      projectsTitle.style.transform = `translateY(${distance}px)`;
    }

    // ---------- 5) SOCIAL ICONS ANIMATION ----------
    const scrollThreshold = isMobile ? 2900 : 2900;
    console.log("window.innerWidth =", window.innerWidth);
    console.log("isMobile =", isMobile);
    if (scrollY >= scrollThreshold) {
      // Move social-icons to top 50%
      socialIcons.style.top = "50%";
      // Enlarge icons
      icons.forEach(icon => {
        icon.style.transform = "scale(2)";
        icon.style.transition = "transform 1.5s ease, margin 1.5s ease";
        icon.style.margin = "0px 30px";
      });
    } else {
      socialIcons.style.top = "80%";
      socialIcons.style.transform = "translateY(0)";
      icons.forEach(icon => {
        icon.style.transform = "scale(1)";
        icon.style.margin = "0px 10px";
      });
    }
  })
  // ========== EDUCATION CONTAINER TOGGLE ==========
  educationContainer.addEventListener("click", function () {
    // Toggle "active" class
    this.classList.toggle("active");
    // Remove pulse if present
    if (this.classList.contains("pulse")) {
      this.classList.remove("pulse");
    }
  });
});
