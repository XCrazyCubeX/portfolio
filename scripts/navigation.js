document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('menu-icon');
    const overlay = document.getElementById('menu-overlay');
    const blur = document.getElementById('menu-blur');

    const menuItems = {
        home: document.getElementById('nav-home'),
        about: document.getElementById('nav-about'),
        projects: document.getElementById('nav-projects'),
        contact: document.getElementById('nav-contact'),
    };

    const sections = {
        home: document.getElementById('home-section'),
        about: document.getElementById('about-section'),
        projects: document.getElementById('projects-section'),
        contact: document.getElementById('contact-section'),
    };

    const heroSection = document.querySelector('.hero-section');

    function scrollToSection(targetSection) {
        // Close the menu upon selection
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        blur.classList.remove('active');

        // Scroll to the target section
        const section = sections[targetSection];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Optional: Trigger animations when navigating to/from home
        if (targetSection === 'home') {
            setTimeout(slideInElements, 500);
        } else if (heroSection) {
            slideOutElements();
        }
    }

    // Menu item event listeners
    menuItems.home.addEventListener('click', () => scrollToSection('home'));
    menuItems.about.addEventListener('click', () => scrollToSection('about'));
    menuItems.projects.addEventListener('click', () => scrollToSection('projects'));
    menuItems.contact.addEventListener('click', () => scrollToSection('contact'));

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        blur.classList.toggle('active');
    });

// Grab elements
const projectItems = document.querySelectorAll(".project");
const projects = document.querySelectorAll(".project");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const dots = document.querySelectorAll(".dot");
const projectsContainer = document.querySelector(".projects-container");

let currentIndex = 0; // Start with the first project
let startX = 0;
let endX = 0;
const SWIPE_THRESHOLD = 40; // px the user must swipe to trigger


/* ------------------------------------------------
   SLIDESHOW / PROJECT SWITCH
-------------------------------------------------- */
function updateProjects() {
  projects.forEach((project, index) => {
    if (index === currentIndex) {
      project.style.zIndex = "3000"; // Bring current project to front
      project.style.opacity = "1";   // Make it fully visible
    } else {
      project.style.zIndex = "2999"; // Send other projects to back
      project.style.opacity = "0";   // Make them invisible
    }
  });

  // Update active dot
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentIndex);
  });
}

// Arrow clicks (desktop)
leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  updateProjects();
});
rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % projects.length;
  updateProjects();
});

// Dot clicks
dots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    currentIndex = dotIndex;
    updateProjects();
  });
});

/* ------------------------------------------------
   SWIPE-TO-NAVIGATE (TOUCH EVENTS ON MOBILE)
-------------------------------------------------- */
// Touchstart: record initial X position
projectsContainer.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

// Touchend: compare final X position to startX
projectsContainer.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  const distance = endX - startX;

  // If negative beyond threshold -> user swiped left -> next project
  if (distance < -SWIPE_THRESHOLD) {
    currentIndex = (currentIndex + 1) % projects.length;
    updateProjects();
  }
  // If positive beyond threshold -> user swiped right -> previous project
  else if (distance > SWIPE_THRESHOLD) {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    updateProjects();
  }
});

// Initial update
updateProjects();

    
});



