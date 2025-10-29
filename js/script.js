// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle")
const htmlElement = document.documentElement
const sunIcon = themeToggle.querySelector(".sun-icon")
const moonIcon = themeToggle.querySelector(".moon-icon")

// Load theme preference from localStorage
function loadTheme() {
  const isDarkMode = localStorage.getItem("darkMode") === "true"
  if (isDarkMode) {
    document.body.classList.add("dark-mode")
    sunIcon.classList.add("hidden")
    moonIcon.classList.remove("hidden")
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")
  const isDarkMode = document.body.classList.contains("dark-mode")
  localStorage.setItem("darkMode", isDarkMode)

  if (isDarkMode) {
    sunIcon.classList.add("hidden")
    moonIcon.classList.remove("hidden")
  } else {
    sunIcon.classList.remove("hidden")
    moonIcon.classList.add("hidden")
  }
})

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle")
const mobileMenu = document.getElementById("mobileMenu")

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  mobileMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    mobileMenu.classList.remove("active")
  })
})

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]')
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href")
    if (href !== "#") {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    }
  })
})

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTop")

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("show")
  } else {
    scrollToTopBtn.classList.remove("show")
  }
})

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Gallery Filter
const filterBtns = document.querySelectorAll(".filter-btn")
const galleryItems = document.querySelectorAll(".gallery-item")

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"))
    // Add active class to clicked button
    btn.classList.add("active")

    const filter = btn.dataset.filter

    galleryItems.forEach((item) => {
      if (filter === "all" || item.dataset.category === filter) {
        item.classList.remove("hidden")
      } else {
        item.classList.add("hidden")
      }
    })
  })
})

// Contact Form
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    console.log("Form submitted:", { name, email, message })
    alert("Thank you for your message! We will get back to you soon.")
    contactForm.reset()
  })
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards"
    }
  })
}, observerOptions)

// Observe section elements
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section)
})

// Load theme on page load
loadTheme()
