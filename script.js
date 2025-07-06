// Mountain Goat Farm App JavaScript

// Goat data
const goats = [
    {
        id: 1,
        name: "Bella",
        age: 3,
        breed: "Nubian",
        color: "Brown & White",
        milkProduction: "2.5 gallons/day",
        image: "https://via.placeholder.com/300x200?text=Bella+the+Goat"
    },
    {
        id: 2,
        name: "Charlie",
        age: 2,
        breed: "Alpine",
        color: "Black & White",
        milkProduction: "2.0 gallons/day",
        image: "https://via.placeholder.com/300x200?text=Charlie+the+Goat"
    },
    {
        id: 3,
        name: "Daisy",
        age: 4,
        breed: "Saanen",
        color: "White",
        milkProduction: "3.0 gallons/day",
        image: "https://via.placeholder.com/300x200?text=Daisy+the+Goat"
    },
    {
        id: 4,
        name: "Rocky",
        age: 5,
        breed: "Boer",
        color: "Brown",
        milkProduction: "1.5 gallons/day",
        image: "https://via.placeholder.com/300x200?text=Rocky+the+Goat"
    },
    {
        id: 5,
        name: "Luna",
        age: 1,
        breed: "Nigerian Dwarf",
        color: "Mixed",
        milkProduction: "1.0 gallons/day",
        image: "https://via.placeholder.com/300x200?text=Luna+the+Goat"
    },
    {
        id: 6,
        name: "Max",
        age: 6,
        breed: "Angora",
        color: "White",
        milkProduction: "2.2 gallons/day",
        image: "https://via.placeholder.com/300x200?text=Max+the+Goat"
    }
];

// DOM elements
const goatGrid = document.getElementById('goat-grid');
const goatCount = document.getElementById('goat-count');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderGoats();
    setupSmoothScrolling();
    setupContactForm();
    updateGoatCount();
});

// Render goats
function renderGoats() {
    goatGrid.innerHTML = '';
    
    goats.forEach(goat => {
        const goatCard = createGoatCard(goat);
        goatGrid.appendChild(goatCard);
    });
}

// Create goat card element
function createGoatCard(goat) {
    const card = document.createElement('div');
    card.className = 'goat-card';
    card.innerHTML = `
        <img src="${goat.image}" alt="${goat.name}">
        <h3>${goat.name}</h3>
        <p><strong>Breed:</strong> ${goat.breed}</p>
        <p><strong>Age:</strong> ${goat.age} years</p>
        <p><strong>Color:</strong> ${goat.color}</p>
        <div class="goat-info">
            <span>🥛 ${goat.milkProduction}</span>
        </div>
    `;
    
    // Add click event for more details
    card.addEventListener('click', () => showGoatDetails(goat));
    
    return card;
}

// Show goat details (modal or alert)
function showGoatDetails(goat) {
    const details = `
        🐐 ${goat.name} Details:
        
        Breed: ${goat.breed}
        Age: ${goat.age} years old
        Color: ${goat.color}
        Daily Milk Production: ${goat.milkProduction}
        
        ${goat.name} is a healthy and happy goat living on our mountain farm!
    `;
    
    alert(details);
}

// Update goat count
function updateGoatCount() {
    if (goatCount) {
        goatCount.textContent = goats.length;
    }
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Simulate form submission
            alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon at ${email}.`);
            
            // Reset form
            this.reset();
        });
    }
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add a simple animation to the CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Scroll to goats section
            const goatsSection = document.getElementById('goats');
            if (goatsSection) {
                goatsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Farm statistics animation
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 20);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                stat.textContent = currentValue;
            }
        }, 100);
    });
}

// Trigger stats animation when section comes into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        goats,
        createGoatCard,
        showGoatDetails
    };
}
