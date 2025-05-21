// main.js
document.addEventListener("DOMContentLoaded", () => {

    

    // —— CUSTOM CURSOR —— 
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) {
      cursor.style.opacity = "1";
      document.querySelectorAll("a").forEach(link => {
        link.addEventListener("mouseover", () => cursor.classList.add("custom-cursor--link"));
        link.addEventListener("mouseout",  () => cursor.classList.remove("custom-cursor--link"));
      });
      window.addEventListener("mousemove", e => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top  = e.clientY + "px";
      });
      window.addEventListener("mouseout",  () => cursor.style.opacity = "0");
      window.addEventListener("mouseover", () => cursor.style.opacity = "1");
    }
  
    // —— HAMBURGER MENU & NAVIGATION —— 
    // ———————————————————————————————————————

    const hamburger = document.getElementById("menu-icon");
    const overlay   = document.getElementById("menu-overlay");
    const blurEl    = document.getElementById("menu-blur");
    const menuItems = {
      home:     document.getElementById("nav-home"),
      about:    document.getElementById("nav-about"),
      projects: document.getElementById("nav-projects"),
      contact:  document.getElementById("nav-contact"),
    };
    const sections = {
      home:     document.getElementById("home-section"),
      about:    document.getElementById("about-section"),
      projects: document.getElementById("projects-section"),
      contact:  document.getElementById("contact-section"),
    };
    const heroSection = document.querySelector(".hero-section");
  
function scrollToSection(name) {
  const sections = {
    home:     document.getElementById("home-section"),
    about:    document.getElementById("about-section"),
    projects: document.getElementById("projects-section"),
    contact:  document.getElementById("contact-section"),
  };


  // Show the target section
  const sec = sections[name];
  sec?.classList.add("visible");

  // Scroll with GSAP or fallback
  const smoother = ScrollSmoother?.get();
  if (sec && smoother) {
    smoother.scrollTo(sec, true, "top");
  } else if (sec) {
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Close menu (optional)
  document.getElementById("menu-icon")?.classList.remove("active");
  document.getElementById("menu-overlay")?.classList.remove("active");
  document.getElementById("menu-blur")?.classList.remove("active");
}


  
    Object.entries(menuItems).forEach(([key, el]) => {
      el?.addEventListener("click", () => scrollToSection(key));
    });
    hamburger?.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      overlay?.classList.toggle("active");
      blurEl?.classList.toggle("active");
    });
  
    // —— PARALLAX & SCROLL EFFECTS —— 
    // ———————————————————————————————————————

    const isMobile = innerWidth < 768;
    const aboutTitle    = document.querySelector(".about-title");
    const projectsTitle = document.querySelector(".projects-title");
    const skills        = document.querySelectorAll(".skill");
    const socialIcons   = document.querySelector(".social-icons");
    const iconsSVG      = document.querySelectorAll(".icon-link svg");
    let skillState = false;
  
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      // about-title parallax
      if (aboutTitle) {
        const speed = isMobile ? 0.2: 0.2;
        aboutTitle.style.transform = `translateY(${-y * speed}px)`;
      }
      // skill bars
      if (y >= 600 && !skillState) {
        skillState = true;
        skills.forEach(s => {
          const lvl = s.getAttribute("data-level") || "50";
          s.style.width = `${lvl}%`;
        });
      } else if (y < 600 && skillState) {
        skillState = false;
        skills.forEach(s => s.style.width = "0");
      }
      // social icons animation
      const threshold = 4000;
      if (socialIcons) {
        if (y >= threshold) {
          socialIcons.style.top = "50%";
          iconsSVG.forEach(ic => {
            ic.style.transform = "scale(2)";
            ic.style.margin    = "0 30px";
            ic.style.transition = "transform 1.5s ease, margin 1.5s ease";
          });
        } else {
          socialIcons.style.top = "80%";
          iconsSVG.forEach(ic => {
            ic.style.transform = "scale(1)";
            ic.style.margin    = "0 10px";
          });
        }
      }
    });
  
    // —— three.js NETWORK BACKGROUND —— 
    // ———————————————————————————————————————

    // Helpers
    const qs  = s => document.querySelector(s);
    const qsa = s => [...document.querySelectorAll(s)];
    const getVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  
    const container      = qs("#background-network");
    const loadingScreen  = qs(".loading-screen");
    const headerEl       = qs(".header");
    const footerEl       = qs(".footer");
    const allSections    = qsa("section");
    const logo           = qs("#logo");
    const vistaLogo      = qs("#vistaLogo");
    const vistaLogoEx    = qs("#vistaLogoex");
  
    // Three.js setup
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(30, innerWidth/innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    Object.assign(renderer.domElement.style, {
      position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:1900
    });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);
    container?.appendChild(renderer.domElement);
  
    // Light
    const light = new THREE.PointLight(0xffffff,1);
    light.position.set(10,50,10);
    scene.add(light);
  
    // Nodes & connections
    const nodes       = [];
    const connections = [];
    const NODE_COUNT  = 20;
    let nodeColor     = getVar("--scene-node-color-dark");
    let connColor     = getVar("--scene-connection-color-dark");
  
    for (let i=0; i<NODE_COUNT; i++){
      const mat  = new THREE.MeshStandardMaterial({
        color: nodeColor,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.3
      });
      const geo  = new THREE.SphereGeometry(0.2,16,16);
      const nod  = new THREE.Mesh(geo, mat);
      nod.position.set(
        (Math.random()-0.5)*10,
        (Math.random()-0.5)*10,
        (Math.random()-0.5)*10
      );
      scene.add(nod);
      nodes.push(nod);
    }
    camera.position.z = 50;
  
    // sequential light-up
    let idx = 0;
    const LIGHT_DELAY = 150;
    function lightUp(){
      if (idx < nodes.length) {
        const n = nodes[idx++];
        n.material.opacity = 1;
        animateConnections(n);
        setTimeout(lightUp, LIGHT_DELAY);
      } else {
        setTimeout(transitionToFull, 2000);
      }
    }
    function animateConnections(from){
      nodes.forEach(to => {
        if (to!==from && Math.random()>0.97){
          const pts = [from.position, to.position];
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          const mat  = new THREE.LineBasicMaterial({
            color: connColor,
            transparent: true,
            opacity: 0.3
          });
          const line = new THREE.Line(geom, mat);
          geom.setDrawRange(0,0);
          scene.add(line);
          connections.push(line);
          let len = 0, max = geom.attributes.position.count;
          (function grow(){
            if (len < max){
              geom.setDrawRange(0,++len);
              requestAnimationFrame(grow);
            }
          })();
        }
      });
    }
    lightUp();
  
    // render loop
    (function animateFrame(){
      scene.rotation.y += 0.001;
      scene.rotation.x += 0.0005;
      renderer.render(scene,camera);
      requestAnimationFrame(animateFrame);
    })();
  
    // full-screen transition
    function transitionToFull(){
      const FRAMES = 120;
      const targetRot = Math.PI*1.02;
      const rotStep   = (targetRot - scene.rotation.y)/FRAMES;
      const zoomStep  = (camera.position.z - 10)/FRAMES;
      let f = 0;
      (function step(){
        if (f++ < FRAMES){
          scene.rotation.y += rotStep;
          camera.position.z -= zoomStep;
          requestAnimationFrame(step);
        } else finalizeTransition();
      })();
    }
  
    function finalizeTransition(){
      allSections.forEach(s => s.classList.add("visible"));
      loadingScreen.style.opacity = "0";
      headerEl.style.opacity = "1";
      footerEl.style.opacity = "1",
    
      qs(".hero-section")?.classList.add("animate-slide-in");
      qs(".navigation-container")?.classList.add("animate-slide-in");
      setupScrollZoom();
    }
  
    // scroll-zoom
    function setupScrollZoom(){
      const MIN = 10, MAX = 50, RANGE = 5000;
      window.addEventListener("scroll", () => {
        const t = Math.max(0,Math.min(1,window.scrollY/RANGE));
        camera.position.z = MIN + (MAX-MIN)*t;
      });
    }
  
    // theme toggle
    window.toggleTheme = () => {
      const root    = document.documentElement;
      const primary = getVar("--primary-color");
      const light   = primary === "#ffffff";
      const themes  = light
        ? {
          "--primary-color":"#0c0c0e",
          "--secondary-color":"#ffffff",
          "--tertiary-color":"#ffffff",
          "--quatro-color":"#EDC9AF",
          "--scene-node-color":"#EDC9AF",
          "--scene-connection-color":"#ffffff",
          logoSrc:"assets/images/JT_light.png",
          invert:"1"
        }
        : {
          "--primary-color":"#ffffff",
          "--secondary-color":"#0c0c0e",
          "--tertiary-color":"#2b2b33",
          "--quatro-color":"#ffffff",
          "--scene-node-color":"#4a4a4a",
          "--scene-connection-color":"#0c0c0e",
          logoSrc:"assets/images/JT_dark.png",
          invert:"0"
        };
      Object.entries(themes).forEach(([k,v]) => {
        if (k.startsWith("--")) root.style.setProperty(k,v);
      });
      logo.src = themes.logoSrc;
      [vistaLogo, vistaLogoEx, ...qsa(".icon-link svg"), ...qsa(".project svg")]
        .forEach(el => el && (el.style.filter = `invert(${themes.invert})`));
      // update three.js materials
      nodeColor = getVar("--scene-node-color");
      connColor = getVar("--scene-connection-color");
      nodes.forEach(n => n.material.color.set(nodeColor));
      connections.forEach(l => l.material.color.set(connColor));
    };
  
    // handle resize
    window.addEventListener("resize", () => {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth/innerHeight;
      camera.updateProjectionMatrix();
    });


    // —— GSAP-BASED TEXT REVEAL (on window load) —— 
  // ———————————————————————————————————————

  window.addEventListener("load", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP / ScrollTrigger not found");
      return;
    }
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
  
    // — TEXT REVEAL SETUP —
    const container = document.querySelector(".persona-container");
    const p = container?.querySelector("p.reveal-text");
    if (container && p) {
      const text = p.textContent;
      p.textContent = "";
      const chars = [];
      for (const ch of text) {
        if (ch === " ") {
          p.appendChild(document.createTextNode(" "));
        } else {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          p.appendChild(span);
          chars.push(span);
        }
      }
  
      gsap.set(chars, { opacity: 0.1 });
      gsap.to(chars, {
        opacity: 1,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: {
          trigger: container,
          start: "top 10%",
          end: "bottom 30%",
          scrub: 0.5
        }
      });
    }
  
    // — SCROLLSMOOTHER SETUP —
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      smoothTouch: 1.2
    });

    setTimeout(() => {
  ScrollTrigger.refresh();
  ScrollSmoother.refresh()
}, 100);
  });

gsap.registerPlugin(TextPlugin);

const skillInfoBox = document.querySelector(".skill-info");
const skillInfoIcon = skillInfoBox.querySelector("i");
const skillInfoText = skillInfoBox.querySelector("p");

const skillDescriptions = {
  HTML: "Structure the web like a pro. HTML is the skeleton of all websites.",
  CSS: "Style it up! CSS turns boring boxes into beautiful buttons.",
  JS: "Add interactivity and logic with JavaScript — from dropdowns to full apps.",
  React: "Build reusable UI components with state and superpowers.",
  "UI/UX": "Design experiences users *love* using. From wireframes to polish.",
  AI: "Build intelligent systems that learn, adapt, and improve.",
  Hardware: "Make circuits dance — control the physical world with code.",
  Git: "Track, share, and manage code history like a time-traveling wizard.",
  SCRUM: "Collaborate efficiently in agile teams with organized sprints."
};

document.querySelectorAll(".icon-container-alt").forEach(iconBox => {
  iconBox.addEventListener("click", () => {
    const iconEl = iconBox.querySelector("i");
    const textEl = iconBox.querySelector("span");

    const newIconClass = iconEl.className;
    const skillName = textEl.textContent;
    const newText = skillDescriptions[skillName] || skillName;

    // ICON animation: fade out + scale, change class, fade in
    gsap.to(skillInfoIcon, {
      opacity: 0,
      scale: 0.2,
      duration: 0.1,
      ease: "power1.out",
      onComplete: () => {
        skillInfoIcon.className = newIconClass;
        gsap.to(skillInfoIcon, {
          opacity: 1,
          scale: 1.2,
          duration: 2,
          ease: "power1.out"
        });
      }
    });

    // TEXT animation: type effect (scramble style)
  // TEXT animation: scramble with opacity and scale transition
gsap.fromTo(skillInfoText,
  {
    opacity: 0.01,
    scale: 0.4,
  },
  {
    text: {
      value: newText,
      delimiter: "",
    },
    opacity: 1,
    scale: 1,
    duration: 2,
    ease: "power1.out",
  }
);
  });

  const skillBoxes = document.querySelectorAll(".icon-container-alt");

skillBoxes.forEach(iconBox => {
  iconBox.addEventListener("click", () => {
    // Remove active-skill from all
    skillBoxes.forEach(box => box.classList.remove("active-skill"));

    // Add it to the clicked one
    iconBox.classList.add("active-skill");

    
})
})
});

window.scrollToSection = scrollToSection;


  });


  