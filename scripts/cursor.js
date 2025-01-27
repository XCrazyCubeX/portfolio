document.addEventListener("DOMContentLoaded", function() {
    const cursor = document.querySelector(".custom-cursor");
    const links = document.querySelectorAll("a");
  
    // Make sure the cursor is visible initially
    cursor.style.opacity = "1";
  
    // Add hover effects for links (mouse only)w
    links.forEach(link => {
      link.addEventListener("mouseover", function() {
        cursor.classList.add("custom-cursor--link");
      });
      link.addEventListener("mouseout", function() {
        cursor.classList.remove("custom-cursor--link");
      });
    });
  
    // Update cursor position based on mouse movement
    function mouseMoveHandler(e) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  
    window.addEventListener("mousemove", mouseMoveHandler);
  
    // Hide cursor when the mouse leaves the window
    window.addEventListener("mouseout", function() {
      cursor.style.opacity = "0";
    });
    window.addEventListener("mouseover", function() {
      cursor.style.opacity = "1";
    });
  
    // === Detect first touch and hide cursor for the rest of the session ===

  });
  