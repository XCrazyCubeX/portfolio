document.addEventListener("DOMContentLoaded", function() {
    const cursor = document.querySelector(".custom-cursor");
    const links = document.querySelectorAll("a");

    // Make sure the cursor is visible initially
    cursor.style.opacity = "1";

    // Add event listeners for hover effects on links
    links.forEach(link => {
        link.addEventListener("mouseover", function() {
            cursor.classList.add("custom-cursor--link");
        });
        link.addEventListener("mouseout", function() {
            cursor.classList.remove("custom-cursor--link");
        });
    });

    // Update cursor position based on mouse movement
    window.addEventListener("mousemove", function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Update the cursor's position
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    });

    // Hide cursor when the mouse leaves the window
    window.addEventListener("mouseout", function() {
        cursor.style.opacity = "0";
    });
    window.addEventListener("mouseover", function() {
        cursor.style.opacity = "1";
    });
});
