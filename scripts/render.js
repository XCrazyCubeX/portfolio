document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('background-network');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Configure renderer's style
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100vw";
    renderer.domElement.style.height = "100vh";
    renderer.domElement.style.zIndex = "1900";

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Basic lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 50, 10);
    scene.add(light);

    const nodes = [];
    const connections = [];
    const nodeCount = 20;

    // Helper to get a CSS variable
    function getCSSVariable(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    // Scene color references
    let nodeColor = getCSSVariable('--scene-node-color-dark');
    let connectionColor = getCSSVariable('--scene-connection-color-dark');

    // Create some nodes (spheres)
    for (let i = 0; i < nodeCount; i++) {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: nodeColor,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.3
        });
        const node = new THREE.Mesh(geometry, material);
        node.position.x = (Math.random() - 0.5) * 10;
        node.position.y = (Math.random() - 0.5) * 10;
        node.position.z = (Math.random() - 0.5) * 10;
        scene.add(node);
        nodes.push(node);
    }

    // Start the camera at z=50
    camera.position.z = 50;

    let currentNode = 0;
    const nodeLightingDelay = 150;

    // Light up nodes in sequence
    function lightUpNodes() {
        if (currentNode < nodes.length) {
            nodes[currentNode].material.opacity = 1;
            animateConnectionsFromNode(nodes[currentNode]);
            currentNode++;
            setTimeout(lightUpNodes, nodeLightingDelay);
        } else {
            // Once all nodes are lit, wait, then do full-screen transition
            setTimeout(transitionToFullScreen, 2000);
        }
    }
    lightUpNodes();

    // Connect randomly chosen nodes
    function animateConnectionsFromNode(startNode) {
        for (let i = 0; i < nodes.length; i++) {
            if (Math.random() > 0.97 && nodes[i] !== startNode) {
                const endNode = nodes[i];
                const points = [startNode.position, endNode.position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                const material = new THREE.LineBasicMaterial({
                    color: connectionColor,
                    transparent: true,
                    opacity: 0.3
                });

                const connection = new THREE.Line(geometry, material);
                geometry.setDrawRange(0, 0);
                scene.add(connection);
                connections.push(connection);

                let length = 0;
                const maxLength = geometry.attributes.position.count;

                // Animate the line “growing”
                function growConnection() {
                    if (length < maxLength) {
                        length += 1;
                        geometry.setDrawRange(0, length);
                        requestAnimationFrame(growConnection);
                    }
                }
                growConnection();
            }
        }
    }

    // Variables for section transitions
    let currentSection = 'home';
    let focusedNode = null;
    let isFocused = false;

    // Just a reference if you ever want to move camera
    const homeCameraPosition = { x: 0, y: 0, z: 10 };

    // Smooth camera move helper
    function moveCameraTo(targetX, targetY, targetZ, duration, onComplete) {
        const startX = camera.position.x;
        const startY = camera.position.y;
        const startZ = camera.position.z;
        const startTime = performance.now();

        function animateMove() {
            const now = performance.now();
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);

            camera.position.x = startX + (targetX - startX) * t;
            camera.position.y = startY + (targetY - startY) * t;
            camera.position.z = startZ + (targetZ - startZ) * t;

            renderer.render(scene, camera);

            if (t < 1) {
                requestAnimationFrame(animateMove);
            } else {
                if (onComplete) onComplete();
            }
        }
        requestAnimationFrame(animateMove);
    }

    // Always rotate the scene a bit
    function animateFrame() {
        requestAnimationFrame(animateFrame);
        scene.rotation.y += 0.001;
        scene.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }
    animateFrame();

    // Called after nodes are fully lit
    function transitionToFullScreen() {
        const targetRotation = Math.PI * 1.02;
        const targetZ = 10;
        const totalFrames = 120;

        const rotationIncrement = (targetRotation - scene.rotation.y) / totalFrames;
        const zoomIncrement = (camera.position.z - targetZ) / totalFrames;

        let frame = 0;
        function animateTransition() {
            if (frame < totalFrames) {
                scene.rotation.y += rotationIncrement;
                camera.position.z -= zoomIncrement;
                frame++;
                requestAnimationFrame(animateTransition);
            } else {
                finalizeTransition();
            }
        }
        animateTransition();
    }

    // Final step: hide loading, show header, reveal all sections
    function finalizeTransition() {
        document.querySelectorAll('section').forEach((sec) => {
            sec.classList.add('visible');
        });
        document.querySelector('.loading-screen').style.opacity = 0;
        document.querySelector('.header').style.opacity = 1;

        document.querySelector('.hero-section').classList.add('animate-slide-in');
        document.querySelector('.navigation-container').classList.add('animate-slide-in');

        setupScrollZoom();
    }

    // Scroll-based zoom
    function setupScrollZoom() {
        const minZ = 10;
        const maxZ = 50;
        const scrollRange = 5000;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            let factor = scrollY / scrollRange; 
            factor = Math.max(0, Math.min(1, factor)); 
            camera.position.z = minZ + (maxZ - minZ) * factor;
            renderer.render(scene, camera);
        });
    }

    // Optional: update 3D node/connection colors if you have a theme toggle
    function updateSceneColors() {
        nodeColor = getCSSVariable('--scene-node-color');
        connectionColor = getCSSVariable('--scene-connection-color');
        nodes.forEach(node => node.material.color.set(nodeColor));
        connections.forEach(connection => connection.material.color.set(connectionColor));
    }

    window.toggleTheme = function () {
        const root = document.documentElement;
        const currentPrimaryColor = getCSSVariable('--primary-color'); // helper function you have
        const logo = document.getElementById('logo');
        const vistaLogo = document.getElementById('vistaLogo');
        const icons = document.querySelectorAll(".icon-link svg");
        const projectGit = document.querySelectorAll(".project svg");
      
        // If currently in light mode (primary is white), switch to dark mode
        if (currentPrimaryColor === '#ffffff') {
          // Dark mode settings
          root.style.setProperty('--primary-color', '#0c0c0e');
          root.style.setProperty('--secondary-color', '#EDC9AF');
          root.style.setProperty('--tertiary-color', '#ffffff');
          root.style.setProperty('--quatro-color', '#EDC9AF');
          
          root.style.setProperty('--scene-node-color', '#EDC9AF');
          root.style.setProperty('--scene-connection-color', 'black');
          
          logo.src = 'assets/images/JT_light.png';
          vistaLogo.style.filter = "invert(1)";
          
          icons.forEach(icon => {
            icon.style.filter = "invert(1)";
          });
          
          projectGit.forEach(git => {
            git.style.filter = "invert(1)";
          });
        } else {
          // Light mode settings
          root.style.setProperty('--primary-color', '#ffffff');
          root.style.setProperty('--secondary-color', '#0c0c0e');
          root.style.setProperty('--tertiary-color', '#2b2b33');
          root.style.setProperty('--quatro-color', '#ffffff');
          
          root.style.setProperty('--scene-node-color', '#4a4a4a');
          root.style.setProperty('--scene-connection-color', '#0c0c0e');
          
          logo.src = 'assets/images/JT_dark.png';
          vistaLogo.style.filter = "invert(0)";
          
          projectGit.forEach(git => {
            git.style.filter = "invert(0)";
          });
          
          icons.forEach(icon => {
            icon.style.filter = "invert(0)";
          });
        }
        
        updateSceneColors(); // Update your 3D scene if needed
      };
      
      

    // Adjust camera on resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Ensure scene rendering on scroll to handle visibility
    setupScrollZoom();
});
