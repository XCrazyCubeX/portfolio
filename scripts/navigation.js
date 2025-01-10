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
    let currentSection = 'home'; // Track currently active section

    function hideSection(sectionKey) {
        const section = sections[sectionKey];
        section.classList.remove('active');
        section.style.visibility = 'hidden';
    }

    function showSection(sectionKey) {
        const section = sections[sectionKey];
        section.style.visibility = 'visible';
        section.classList.add('active');
    }

    function slideOutElements() {
        // If you have any slide-out animations for hero/nav when leaving home, trigger them here
        heroSection.classList.add('animate-slide-out');
    }

    function slideInElements() {
        // If you have any slide-in animations for hero/nav when arriving back home, trigger them here
        heroSection.classList.remove('animate-slide-out');
        heroSection.classList.add('animate-slide-in');
    }

    function handleMenuClick(targetSection) {
        if (currentSection === targetSection) return;
    
        // Close the menu upon selection
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        blur.classList.remove('active');
    
        // Handle leaving home
        if (currentSection === 'home' && targetSection !== 'home') {
            // Slide out hero elements if desired
            slideOutElements();
        }
    
        // Handle returning to home
        if (targetSection === 'home' && currentSection !== 'home') {
            setTimeout(slideInElements, 500);
        }
    
        // Hide current section and show target section after a short delay for animations
        hideSection(currentSection);
        setTimeout(() => {
            showSection(targetSection);
            currentSection = targetSection;
    
            // Update the 3D scene section
            window.setCurrentSection(targetSection);
    
    
        }, 500); // Match with your CSS animation duration
    }
    
    
    // Menu item event listeners
    menuItems.home.addEventListener('click', () => handleMenuClick('home'));
    menuItems.about.addEventListener('click', () => handleMenuClick('about'));
    menuItems.projects.addEventListener('click', () => handleMenuClick('projects'));
    menuItems.contact.addEventListener('click', () => handleMenuClick('contact'));

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        blur.classList.toggle('active');
    });
});
