// DOM Elements
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const backToTop = document.getElementById("back-to-top")
const orderBtn = document.getElementById("order-btn")
const orderModal = document.getElementById("order-modal")
const closeModal = document.querySelector(".close")
const contactForm = document.getElementById("contact-form")
const scrollProgress = document.querySelector(".scroll-progress")

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const currentTheme = localStorage.getItem("theme") || "light"

// Set initial theme
document.documentElement.setAttribute("data-theme", currentTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)

  // Add transition effect
  document.body.style.transition = "all 0.3s ease"
  setTimeout(() => {
    document.body.style.transition = ""
  }, 300)
})

// Loading Screen
const loadingScreen = document.getElementById("loading-screen")

window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen.classList.add("hidden")
    document.body.classList.add("loaded")

    // Remove loading screen from DOM after animation
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen)
      }
    }, 500)
  }, 1500) // Show loading for 1.5 seconds minimum
})

// Gallery Filtering
const filterBtns = document.querySelectorAll(".filter-btn")
const galleryItems = document.querySelectorAll(".gallery-item")

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"))
    // Add active class to clicked button
    btn.classList.add("active")

    const filter = btn.getAttribute("data-filter")

    galleryItems.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "block"
        item.style.animation = "fadeIn 0.5s ease forwards"
      } else {
        item.style.display = "none"
      }
    })
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    // Close mobile menu if open
    navMenu.classList.remove("active")
  })
})

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active")
  }
})

// Scroll effects
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100

  // Update scroll progress bar
  scrollProgress.style.width = scrollPercent + "%"

  // Navbar scroll effect
  if (scrollTop > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  // Show/hide back to top button
  if (scrollTop > 500) {
    backToTop.classList.add("visible")
  } else {
    backToTop.classList.remove("visible")
  }

  // Update active navigation link
  updateActiveNavLink()
})

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
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
      entry.target.classList.add("visible")

      // Add specific animations based on section type
      if (entry.target.classList.contains("left-image")) {
        entry.target.querySelector(".section-image").classList.add("slide-in-left")
        entry.target.querySelector(".section-content").classList.add("slide-in-right")
      } else if (entry.target.classList.contains("right-image")) {
        entry.target.querySelector(".section-image").classList.add("slide-in-right")
        entry.target.querySelector(".section-content").classList.add("slide-in-left")
      }
    }
  })
}, observerOptions)

// Observe all zigzag sections
document.querySelectorAll(".zigzag-section").forEach((section) => {
  observer.observe(section)
})

// Enhanced Intersection Observer with staggered animations
const enhancedObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations
        setTimeout(() => {
          entry.target.classList.add("visible")

          // Add specific animations based on element type
          if (entry.target.classList.contains("service-card")) {
            entry.target.classList.add("bounce-in")
          } else if (entry.target.classList.contains("gallery-item")) {
            entry.target.classList.add("fade-in")
          } else if (entry.target.classList.contains("testimonial")) {
            entry.target.classList.add("slide-in-left")
          }
        }, index * 100) // Stagger by 100ms
      }
    })
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
)

// Observe service cards, gallery items, and testimonials
document.querySelectorAll(".service-card, .gallery-item, .testimonial").forEach((el) => {
  enhancedObserver.observe(el)
})

// Back to top button
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Order modal functionality
orderBtn.addEventListener("click", () => {
  orderModal.style.display = "block"
  document.body.style.overflow = "hidden"
})

closeModal.addEventListener("click", () => {
  orderModal.style.display = "none"
  document.body.style.overflow = "auto"
})

window.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
})

// Form submissions
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(contactForm)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Simulate form submission
  showNotification("Thank you for your message! We'll get back to you soon.", "success")
  contactForm.reset()
})

// Order form submission
document.querySelector(".order-form").addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(e.target)
  const cakeType = formData.get("cake-type")
  const size = formData.get("size")
  const date = formData.get("date")

  // Simulate order submission
  showNotification("Order placed successfully! We'll contact you to confirm details.", "success")
  orderModal.style.display = "none"
  document.body.style.overflow = "auto"
  e.target.reset()
})

// Advanced Form Handling with Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateForm(formData) {
  const errors = []

  if (!formData.get("name") || formData.get("name").trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  if (!validateEmail(formData.get("email"))) {
    errors.push("Please enter a valid email address")
  }

  if (!formData.get("message") || formData.get("message").trim().length < 10) {
    errors.push("Message must be at least 10 characters long")
  }

  return errors
}

// Enhanced contact form with validation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const errors = validateForm(formData)

  if (errors.length > 0) {
    showNotification(errors.join(". "), "error")
    return
  }

  // Show loading state
  const submitBtn = contactForm.querySelector(".submit-btn")
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showNotification("Thank you for your message! We'll get back to you within 24 hours.", "success")
    contactForm.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
})

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  }

  const colors = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
    warning: "#ff9800",
  }

  notification.innerHTML = `
    <div class="notification-content">
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    </div>
  `

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    z-index: 2001;
    animation: slideInRight 0.3s ease;
    max-width: 350px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 5000)

  // Manual close
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  })
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
document.head.appendChild(notificationStyles)

// Enhanced notification styles
const enhancedNotificationStyles = document.createElement("style")
enhancedNotificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .notification-message {
        flex: 1;
        line-height: 1.4;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        background-color: rgba(255,255,255,0.2);
    }
    
    @media (max-width: 480px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`
document.head.appendChild(enhancedNotificationStyles)

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  const heroImage = document.querySelector(".hero-image img")

  if (heroImage && scrolled < hero.offsetHeight) {
    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`
  }
})

// Animate numbers in stats section
function animateNumbers() {
  const stats = document.querySelectorAll(".stat-number")

  stats.forEach((stat) => {
    const target = Number.parseInt(stat.textContent.replace(/[^\d]/g, ""))
    const suffix = stat.textContent.replace(/[\d]/g, "")
    let current = 0
    const increment = target / 100
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      stat.textContent = Math.floor(current) + suffix
    }, 20)
  })
}

// Trigger number animation when stats section is visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumbers()
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

const statsSection = document.querySelector(".stats")
if (statsSection) {
  statsObserver.observe(statsSection)
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Close modal with Escape key
  if (e.key === "Escape" && orderModal.style.display === "block") {
    orderModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
})

// Initialize date picker with minimum date as today
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date")
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0]
    dateInput.min = today
  }
})

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Trigger initial animations
  setTimeout(() => {
    const heroText = document.querySelector(".hero-text")
    const heroImage = document.querySelector(".hero-image")

    if (heroText) heroText.classList.add("fade-in")
    if (heroImage) heroImage.classList.add("fade-in")
  }, 100)
})

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100

  scrollProgress.style.width = scrollPercent + "%"

  if (scrollTop > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  if (scrollTop > 500) {
    backToTop.classList.add("visible")
  } else {
    backToTop.classList.remove("visible")
  }

  updateActiveNavLink()
}, 16) // ~60fps

window.addEventListener("scroll", throttledScrollHandler)

// Floating Elements Animation
function addFloatingAnimation() {
  const floatingElements = document.querySelectorAll(".hero-image img, .cta-button")

  floatingElements.forEach((el) => {
    el.classList.add("float-animation")
  })
}

// Add glow effect to CTA button
function addGlowEffect() {
  const ctaButton = document.querySelector(".cta-button")
  if (ctaButton) {
    ctaButton.classList.add("pulse-glow")
  }
}

// Initialize animations after page load
setTimeout(() => {
  addFloatingAnimation()
  addGlowEffect()
}, 2000)
