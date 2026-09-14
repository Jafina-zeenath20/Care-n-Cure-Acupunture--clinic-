// ============================================================
// CARE N CURE
// MAIN JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================
  // CONFIGURATION
  // ==========================================================

  const CONFIG = {

    whatsappNumber: "918825641943",

    clinicName: "Care n Cure Acupuncture Clinic",

    apiEndpoint: "/api/chat"

  };

  // ==========================================================
  // LUCIDE ICONS
  // ==========================================================

  if (window.lucide) {

    lucide.createIcons();

  }

  // ==========================================================
  // LOADER
  // ==========================================================

  window.addEventListener("load", () => {

    setTimeout(() => {

      const loader = document.getElementById("loader");

      if (loader) {

        loader.classList.add("loaded");

      }

    }, 700);

  });

  // Fallback

  setTimeout(() => {

    const loader = document.getElementById("loader");

    if (loader) {

      loader.classList.add("loaded");

    }

  }, 3000);

  // ==========================================================
  // NAVBAR
  // ==========================================================

  const navbar = document.getElementById("navbar");

  function updateNavbar() {

    if (window.scrollY > 50) {

      navbar.classList.add("scrolled");

    } else {

      navbar.classList.remove("scrolled");

    }

  }

  window.addEventListener("scroll", updateNavbar, { passive: true });

  updateNavbar();

  // ==========================================================
  // MOBILE MENU
  // ==========================================================

  const mobileMenu = document.getElementById("mobileMenu");

  const mobileButton = document.getElementById("mobileMenuButton");

  const mobileClose = document.getElementById("mobileMenuClose");

  function openMobileMenu() {

    mobileMenu.classList.add("open");

    mobileButton.setAttribute("aria-expanded", "true");

  }

  function closeMobileMenu() {

    mobileMenu.classList.remove("open");

    mobileButton.setAttribute("aria-expanded", "false");

  }

  mobileButton?.addEventListener("click", openMobileMenu);

  mobileClose?.addEventListener("click", closeMobileMenu);

  mobileMenu?.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", closeMobileMenu);

  });

  // ==========================================================
  // SCROLL PROGRESS
  // ==========================================================

  const progress = document.getElementById("scrollProgress");

  function updateProgress() {

    const scrollTop = window.scrollY;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    const percentage = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    progress.style.width = `${percentage}%`;

  }

  window.addEventListener("scroll", updateProgress, { passive: true });

  // ==========================================================
  // GSAP
  // ==========================================================

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && window.ScrollTrigger && !reducedMotion) {

    gsap.registerPlugin(ScrollTrigger);

    // Hero reveal

    gsap.to(".hero-reveal", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: .12,
      ease: "power3.out",
      delay: .8
    });

    // General reveal

    gsap.utils.toArray(".reveal").forEach(element => {

      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: .9,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 85%", once: true }
      });

    });

    // Hero parallax

    gsap.to(".hero-3d", {
      y: 100,
      scale: .9,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });

  } else {

    document.querySelectorAll(".reveal, .hero-reveal").forEach(element => {

      element.style.opacity = "1";
      element.style.transform = "none";

    });

  }

  // ==========================================================
  // HERO PARTICLES
  // ==========================================================

  const particleContainer = document.getElementById("heroParticles");

  if (!reducedMotion && particleContainer) {

    const particleCount = window.innerWidth < 700 ? 12 : 25;

    for (let i = 0; i < particleCount; i++) {

      const particle = document.createElement("span");

      particle.className = "hero-particle";

      particle.style.left = `${Math.random() * 100}%`;

      particle.style.top = `${Math.random() * 100}%`;

      particle.style.opacity = `${.1 + Math.random() * .4}`;

      particleContainer.appendChild(particle);

      if (window.gsap) {

        gsap.to(particle, {
          y: -30 - Math.random() * 50,
          x: -20 + Math.random() * 40,
          duration: 3 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });

      }

    }

  }

  // ==========================================================
  // THREE.JS HERO
  // ==========================================================

  function createHero3D() {

    const container = document.getElementById("hero3d");

    if (!container) { return; }

    if (reducedMotion || !window.THREE) {
      container.classList.add("fallback-only");
      return;
    }

    try {

      const width = container.clientWidth;
      const height = container.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, .1, 100);
      camera.position.z = 6;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      const group = new THREE.Group();
      scene.add(group);

      // Body
      const bodyGeometry = new THREE.SphereGeometry(1.25, 32, 32);
      bodyGeometry.scale(.75, 1.6, .48);
      const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0x718f76, roughness: .55, metalness: .05, transparent: true, opacity: .82, transmission: .05 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(.45, 24, 24), bodyMaterial.clone());
      head.position.y = 2.05;
      group.add(head);

      // Meridians
      const meridianMaterial = new THREE.LineBasicMaterial({ color: 0xc8aa68, transparent: true, opacity: .7 });
      for (let m = 0; m < 5; m++) {
        const points = [];
        for (let i = 0; i <= 60; i++) {
          const t = i / 60;
          const y = -2.0 + t * 4.0;
          const x = Math.sin(t * Math.PI * 2 + m * .7) * (.35 + .15 * Math.sin(t * Math.PI));
          const z = .5;
          points.push(new THREE.Vector3(x, y, z));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, meridianMaterial);
        line.scale.x = .7;
        group.add(line);
      }

      // Points
      const pointGeometry = new THREE.SphereGeometry(.07, 12, 12);
      const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xc8aa68 });
      const pointPositions = [[0,1.2,.55],[.25,.5,.55],[-.2,-.2,.55],[.2,-.9,.55],[0,-1.5,.55]];
      pointPositions.forEach(position => { const point = new THREE.Mesh(pointGeometry, pointMaterial); point.position.set(...position); group.add(point); });

      // Needles
      const needleMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7 });
      pointPositions.slice(0,4).forEach(position => {
        const points = [ new THREE.Vector3(position[0], position[1], position[2]), new THREE.Vector3(position[0]+.25, position[1]+.12, position[2]+.25) ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const needle = new THREE.Line(geometry, needleMaterial);
        group.add(needle);
      });

      // Particles
      const particleCount = window.innerWidth < 700 ? 80 : 160;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - .5) * 4;
        particlePositions[i*3+1] = (Math.random() - .5) * 5;
        particlePositions[i*3+2] = (Math.random() - .5) * 2;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: 0xc8aa68, size: .025, transparent: true, opacity: .5 });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const light = new THREE.PointLight(0xc8aa68, 20, 10);
      light.position.set(2,2,4);
      scene.add(light);

      // Mouse
      let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
      window.addEventListener("mousemove", event => { mouseX = (event.clientX / window.innerWidth - .5); mouseY = (event.clientY / window.innerHeight - .5); }, { passive: true });

      // Animate
      function animate() {
        requestAnimationFrame(animate);
        targetX += (mouseX * .35 - targetX) * .03;
        targetY += (mouseY * .25 - targetY) * .03;
        group.rotation.y = targetX;
        group.rotation.x = -targetY;
        group.rotation.z += .001;
        particles.rotation.y += .0003;
        renderer.render(scene, camera);
      }

      animate();

      // Resize
      window.addEventListener("resize", () => { const w = container.clientWidth; const h = container.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w,h); });

    } catch (error) {
      container.classList.add("fallback-only");
      console.warn("3D scene unavailable; using clinic photo fallback.", error);

    }

  }

  createHero3D();

  // ==========================================================
  // 3D CARD TILT
  // ==========================================================

  if (!reducedMotion) {

    document.querySelectorAll(".tilt-card").forEach(card => {

      card.addEventListener("mousemove", event => {

        if (window.innerWidth < 850) return;

        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - .5) * 8;
        const rotateX = -((y / rect.height) - .5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

      });

      card.addEventListener("mouseleave", () => { card.style.transform = ""; });

    });

  }

  // ==========================================================
  // ACUPUNCTURE POINTS
  // ==========================================================

  const pointButtons = document.querySelectorAll(".acupoint");
  pointButtons.forEach(button => {
    button.addEventListener("click", () => {
      const title = button.dataset.title;
      const description = button.dataset.description;
      document.getElementById("pointTitle").textContent = title;
      document.getElementById("pointDescription").textContent = description;
    });
  });

  // ==========================================================
  // TREATMENT MODALS
  // ==========================================================

  const treatments = {
    acupuncture: { title: "Acupuncture", description: "Traditional acupuncture offered as part of a personalized wellness approach.", expect: "A qualified practitioner can discuss your individual needs and explain whether acupuncture is appropriate for you." },
    cupping: { title: "Cupping Therapy", description: "Cupping therapy is a traditional complementary wellness practice offered at Care n Cure.", expect: "Your practitioner can explain the process, expected experience and whether it is appropriate for you." },
    herbal: { title: "Herbal Wellness", description: "Herbal wellness support can complement an individualized wellness plan.", expect: "Discuss your needs and any existing medications or health considerations with a qualified practitioner before using herbal products." },
    wellness: { title: "Wellness Coaching", description: "Lifestyle and nutrition guidance designed to support a broader wellness journey.", expect: "The consultation focuses on your lifestyle and wellness goals and may include practical guidance." },
    "facial-cupping": { title: "Facial Cupping", description: "A gentle complementary facial wellness practice offered around your comfort and goals.", expect: "Your practitioner can explain the technique, expected experience and whether it is appropriate for you." },
    acupressure: { title: "Acupressure", description: "Non-invasive pressure-point support offered as part of an individualized wellness conversation.", expect: "Your practitioner can discuss your goals, comfort and any health considerations before care." },
    hijama: { title: "Hijama", description: "Wet cupping therapy discussed with attention to suitability, hygiene, comfort and aftercare.", expect: "Ask about the process, hygiene, aftercare and whether Hijama is appropriate for your health history." },
    reflexology: { title: "Reflexology", description: "A foot-focused complementary wellness practice tailored to your comfort.", expect: "Your practitioner can explain the session and discuss whether reflexology fits your wellness goals." }
  };

  const modal = document.getElementById("treatmentModal");

  document.querySelectorAll(".treatment-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.treatment;
      const data = treatments[key];
      if (!data) return;
      document.getElementById("modalTitle").textContent = data.title;
      document.getElementById("modalDescription").textContent = data.description;
      document.getElementById("modalExpect").textContent = data.expect;
      modal.classList.add("open");
      document.body.classList.add("modal-open");
    });
  });

  function closeModal() { modal.classList.remove("open"); document.body.classList.remove("modal-open"); }

  document.getElementById("closeTreatmentModal")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });

  // ==========================================================
  // TESTIMONIAL SLIDER
  // ==========================================================

  const testimonialTrack = document.getElementById("testimonialTrack");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  let testimonialIndex = 0;
  function updateTestimonials() {
    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    }
  }
  document.getElementById("testimonialNext")?.addEventListener("click", () => { testimonialIndex = (testimonialIndex + 1) % testimonialCards.length; updateTestimonials(); });
  document.getElementById("testimonialPrev")?.addEventListener("click", () => { testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length; updateTestimonials(); });

  document.querySelectorAll(".faq-item").forEach(item => {
    const initialIndicator = item.querySelector("summary span");
    if (initialIndicator) initialIndicator.textContent = item.open ? "−" : "+";
    item.addEventListener("toggle", () => {
      const indicator = item.querySelector("summary span");
      if (indicator) indicator.textContent = item.open ? "−" : "+";
    });
  });

  // ==========================================================
  // COUNTER
  // ==========================================================

  const counter = document.querySelector("[data-counter]");
  if (counter && window.gsap && window.ScrollTrigger && !reducedMotion) {
    const target = Number(counter.dataset.counter);
    gsap.to(counter, { textContent: target, duration: 1.5, snap: { textContent: 1 }, scrollTrigger: { trigger: counter, start: "top 85%", once: true } });
  }

  // ==========================================================
  // WHATSAPP
  // ==========================================================

  const whatsappMessage = encodeURIComponent("Hello Care n Cure, I would like to know more about your services.");
  const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${whatsappMessage}`;
  ["whatsappAppointment", "footerWhatsapp", "floatingWhatsapp"].forEach(id => { const element = document.getElementById(id); if (element) element.href = whatsappURL; });

  document.querySelectorAll(".call-clinic-btn").forEach(button => {
    button.addEventListener("click", event => {
      const phoneLink = "tel:+918825641943";
      button.setAttribute("href", phoneLink);
      if (!window.matchMedia("(pointer: coarse)").matches) {
        event.preventDefault();
        window.location.assign(phoneLink);
      }
    });
  });

  // ==========================================================
  // APPOINTMENT FORM
  // ==========================================================

  const appointmentForm = document.getElementById("appointmentForm");
  appointmentForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(appointmentForm).entries());
    const message = `Hello Care n Cure,\n\nI would like to request an appointment.\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nDate: ${data.date}\nTime: ${data.time || "Not specified"}\nTreatment: ${data.service}\n\nMessage:\n${data.message || "None"}`;
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  // ==========================================================
  // CHATBOT
  // ==========================================================

  const chatbotButton = document.getElementById("chatbotButton");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const closeChatbot = document.getElementById("closeChatbot");
  const chatInput = document.getElementById("chatInput");
  const sendChat = document.getElementById("sendChat");
  const chatMessages = document.getElementById("chatMessages");
  const typingIndicator = document.getElementById("typingIndicator");
  const localPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  function openChat() {
    if (!chatbotWindow) return;
    chatbotWindow.classList.add("open");
    document.body.classList.add("chat-open");
    setTimeout(() => chatInput?.focus(), 250);
  }
  function closeChat() {
    chatbotWindow?.classList.remove("open");
    document.body.classList.remove("chat-open");
  }
  chatbotButton?.addEventListener("click", openChat);
  closeChatbot?.addEventListener("click", closeChat);

  function addChatMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `chat-message ${sender}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.appendChild(paragraph);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() { typingIndicator.classList.add("show"); chatMessages.scrollTop = chatMessages.scrollHeight; }
  function hideTyping() { typingIndicator.classList.remove("show"); }

  function localChatAnswer(question) {
    const normalized = question.toLowerCase();
    if (normalized.includes("where") || normalized.includes("location") || normalized.includes("address")) {
      return "Care n Cure Acupuncture Clinic is in Madurai, Tamil Nadu.";
    }
    if (normalized.includes("book") || normalized.includes("appointment") || normalized.includes("visit")) {
      return "You can request an appointment using the booking form or call +91 88256 41943. We are open Monday to Saturday, 9:00 AM to 8:00 PM.";
    }
    if (normalized.includes("service") || normalized.includes("treatment")) {
      return "Care n Cure offers acupuncture, cupping therapy, herbal wellness support, and wellness coaching. Please contact the clinic to discuss whether a service is suitable for you.";
    }
    if (normalized.includes("hour") || normalized.includes("open") || normalized.includes("time")) {
      return "The clinic is open Monday to Saturday, 9:00 AM to 8:00 PM.";
    }
    return null;
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    addChatMessage(message, "user");
    chatInput.value = "";
    sendChat.disabled = true;
    showTyping();
    const localAnswer = localChatAnswer(message);
    if (localAnswer) {
      hideTyping();
      addChatMessage(localAnswer, "bot");
      sendChat.disabled = false;
      chatInput.focus();
      return;
    }
    if (localPreview) {
      hideTyping();
      addChatMessage("I can help with clinic services, location, opening hours, and appointments. For other questions, please call Care n Cure directly at +91 88256 41943.", "bot");
      sendChat.disabled = false;
      chatInput.focus();
      return;
    }
    try {
      const response = await fetch(CONFIG.apiEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }
      hideTyping();
      if (!response.ok) {
        addChatMessage("I can help with clinic services, location, opening hours, and appointments. For other questions, please call Care n Cure directly at +91 88256 41943.", "bot");
      } else {
        addChatMessage(data.answer || "I can help with clinic services, location, opening hours, and appointments. Please call Care n Cure directly if you need more information.", "bot");
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      hideTyping();
      addChatMessage("I can help with clinic services, location, opening hours, and appointments. For other questions, please call Care n Cure directly at +91 88256 41943.", "bot");
    } finally {
      sendChat.disabled = false;
      chatInput.focus();
    }
  }

  sendChat?.addEventListener("click", sendMessage);
  chatInput?.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); sendMessage(); } });

  document.querySelectorAll(".quick-questions button").forEach(button => { button.addEventListener("click", () => { chatInput.value = button.dataset.question; sendMessage(); }); });

  // ==========================================================
  // BACK TO TOP
  // ==========================================================

  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => { if (window.scrollY > 600) { backToTop.classList.add("visible"); } else { backToTop.classList.remove("visible"); } }, { passive: true });
  backToTop?.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); });

});
