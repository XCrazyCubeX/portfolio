document.addEventListener("DOMContentLoaded", function() {
    const customCursor = document.querySelector(".custom-cursor");
    let isTouchDevice = false;

    // Function to hide custom cursor for touch devices permanently
    function hideCursorForTouch() {
        customCursor.style.display = "none";
        isTouchDevice = true;
    }

    // Function to show custom cursor for mouse devices if not a touch device
    function showCursorForMouse() {
        if (!isTouchDevice) {
            customCursor.style.display = "block";
        }
    }

    // Initial detection for touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        hideCursorForTouch();
    } else {
        showCursorForMouse();
    }

    // Detect mouse movement to show cursor if not a touch device
    window.addEventListener("mousemove", function() {
        showCursorForMouse();
    });

    // Detect touchstart event to hide cursor permanently on touch devices
    window.addEventListener("touchstart", function() {
        hideCursorForTouch();
    });

});


