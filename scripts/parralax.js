document.addEventListener("DOMContentLoaded", function () {
  // On scroll, move the .about-title upward
  window.addEventListener('scroll', () => {
    const aboutTitle = document.querySelector('.about-title');

    // Get how far down the page we've scrolled
    const scrollY = window.scrollY || window.pageYOffset;

    // Adjust this speed factor to taste; 0.5 means it moves half as fast as scroll
    const speed = 0.3;

    // Move the title up by some fraction of the scroll
    aboutTitle.style.transform = `translateY(${-scrollY * speed}px)`;
  });


});

document.addEventListener("DOMContentLoaded", function () {
    // Parallax on the .about-title
    window.addEventListener('scroll', () => {
      const aboutTitle = document.querySelector('.about-title');
  
      // How far down the page we've scrolled
      const scrollY = window.scrollY || window.pageYOffset;
  
      // Parallax speed for the title
      const speed = 0.3;
      // Move the title up
      aboutTitle.style.transform = `translateY(${-scrollY * speed}px)`;
    });
  
    // Skill bars fill/reset based on scrolling past/above 1000px
    const skills = document.querySelectorAll('.skill');
    let skillState = false; // false = not filled, true = filled
  
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
  
      // If we've scrolled past 1000px and skillState = false, fill them
      if (scrollY >= 700 && !skillState) {
        skillState = true;
        skills.forEach(skill => {
          const level = skill.getAttribute('data-level') || '50';
          skill.style.width = level + '%';
        });
      }
      // If we've gone back above 1000px and skillState = true, reset them
      else if (scrollY <= 700 && skillState) {
        skillState = false;
        skills.forEach(skill => {
          skill.style.width = '0';
        });
        
      }
          

      if (scrollY >= 1200) {
        document.querySelector(".continual-learning").style.filter = "blur(0px)"
      }

      // If we've gone back above 1000px and skillState = true, reset them
      else if (scrollY <= 1200 ){
        document.querySelector(".continual-learning").style.filter = "blur(10px)"

        
      }
    });


  const educationContainer = document.querySelector(".education-container");

  educationContainer.addEventListener("click", function () {
    // Toggle the "active" class
    this.classList.toggle("active");

    // Remove the pulse effect once clicked
    if (this.classList.contains("pulse")) {
      this.classList.remove("pulse");
    }
  });


    
  });
