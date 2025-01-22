document.addEventListener("DOMContentLoaded", function() {
    const cursor = document.querySelector(".custom-cursor");
    const links = document.querySelectorAll("a");
  
    // Make sure the cursor is visible initially
    cursor.style.opacity = "1";
  
    // Add hover effects for links (mouse only)
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
    window.addEventListener(
      "touchstart",
      function hideCursorOnTouch() {
        // Hide the custom cursor
        cursor.style.display = "none";
  
        // Remove all mousemove / mouseover listeners if you like,
        // since we no longer need them:
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseout", () => {});
        window.removeEventListener("mouseover", () => {});
  
        // Optionally remove the hover effects from links:
        links.forEach(link => {
          link.removeEventListener("mouseover", () => {});
          link.removeEventListener("mouseout", () => {});
        });
  
        // This listener should only run once:
        window.removeEventListener("touchstart", hideCursorOnTouch);
      },
      { once: true }
    );
  });
  