// The Mountain Goat Farm App JavaScript - Meat Goats: Quality Breeding, Superior Genetics

// Goat data - Premium Meat Goat Breeds
const goats = [
    {
        id: 1,
        name: "Bella",
        age: 3,
        breed: "Boer",
        color: "Brown & White",
        weight: "68 kg",
        genetics: "Superior bloodline - Champion sire",
        meatQuality: "Grade A+",
        image: "https://via.placeholder.com/300x200?text=Bella+the+Boer+Goat"
    },
    {
        id: 2,
        name: "Charlie",
        age: 2,
        breed: "Kiko",
        color: "White",
        weight: "72 kg",
        genetics: "Hardy New Zealand genetics",
        meatQuality: "Grade A",
        image: "https://via.placeholder.com/300x200?text=Charlie+the+Kiko+Goat"
    },
    {
        id: 3,
        name: "Daisy",
        age: 4,
        breed: "Spanish",
        color: "Mixed",
        weight: "55 kg",
        genetics: "Disease-resistant bloodline",
        meatQuality: "Grade A",
        image: "https://via.placeholder.com/300x200?text=Daisy+the+Spanish+Goat"
    },
    {
        id: 4,
        name: "Rocky",
        age: 5,
        breed: "Boer",
        color: "Red & White",
        weight: "85 kg",
        genetics: "Premium breeding buck - Superior genetics",
        meatQuality: "Grade A+",
        image: "https://via.placeholder.com/300x200?text=Rocky+the+Boer+Buck"
    },
    {
        id: 5,
        name: "Luna",
        age: 1,
        breed: "Nubian",
        color: "Brown",
        weight: "45 kg",
        genetics: "Fast-growing bloodline",
        meatQuality: "Grade A-",
        image: "https://via.placeholder.com/300x200?text=Luna+the+Nubian+Goat"
    },
    {
        id: 6,
        name: "Max",
        age: 6,
        breed: "Angora",
        color: "White",
        milkProduction: "8.3 litres/day",
        image: "https://via.placeholder.com/300x200?text=Max+the+Goat"
    }
];

// Product management system - Premium Meat Goat Products
let products = JSON.parse(localStorage.getItem('farmProducts') || '[]');

// Initialize default products if none exist
if (products.length === 0) {
    products = [
        {
            id: 1,
            name: "Premium Goat Meat - Grade A+",
            category: "meat",
            price: "KSh 900/kg",
            salePrice: "",
            description: "Superior quality meat from our prize-winning Boer goats - exceptional genetics and breeding managed by experienced professionals with over 10 years of expertise",
            image: "https://via.placeholder.com/300x200?text=Premium+Goat+Meat",
            featured: true,
            available: true,
            isNew: false,
            season: "",
            stockQuantity: 25,
            lowStockAlert: 5,
            autoStock: true,
            bundleContents: "",
            breedingQuality: "Superior genetics",
            meatGrade: "A+"
        },
        {
            id: 2,
            name: "Breeding Buck - Champion Bloodline",
            category: "breeding",
            price: "KSh 45,000/animal",
            salePrice: "",
            description: "Premium breeding bucks with superior genetics for quality meat goat production, managed by experienced professionals with over 10 years of expertise",
            image: "https://via.placeholder.com/300x200?text=Breeding+Buck",
            featured: true,
            available: true,
            isNew: false,
            season: "",
            stockQuantity: 3,
            lowStockAlert: 1,
            autoStock: false,
            bundleContents: "",
            breedingQuality: "Champion bloodline",
            meatGrade: "A+"
        },
        {
            id: 3,
            name: "Quality Breeding Doe - Proven Genetics",
            category: "breeding",
            price: "KSh 25,000/animal",
            salePrice: "",
            description: "High-quality breeding does with proven genetics for superior meat goat offspring",
            image: "https://via.placeholder.com/300x200?text=Breeding+Doe",
            featured: false,
            available: true,
            isNew: true,
            season: "",
            stockQuantity: 25,
            lowStockAlert: 10,
            autoStock: true,
            bundleContents: ""
        },
        {
            id: 4,
            name: "Farm Fresh Bundle",
            category: "bundles",
            price: "KSh 1,200",
            salePrice: "KSh 950",
            description: "Complete farm experience package",
            image: "https://via.placeholder.com/300x200?text=Farm+Bundle",
            featured: true,
            available: true,
            isNew: false,
            season: "",
            stockQuantity: 12,
            lowStockAlert: 3,
            autoStock: true,
            bundleContents: "2 litres fresh goat milk, 0.5 kg artisan cheese, 2 bars natural soap"
        },
        {
            id: 5,
            name: "Dry Season Comfort Soap",
            category: "skincare",
            price: "KSh 280/bar",
            salePrice: "",
            description: "Extra moisturizing soap for dry weather conditions",
            image: "https://via.placeholder.com/300x200?text=Dry+Season+Soap",
            featured: false,
            available: true,
            isNew: false,
            season: "winter",
            stockQuantity: 20,
            lowStockAlert: 8,
            autoStock: true,
            bundleContents: ""
        }
    ];
    localStorage.setItem('farmProducts', JSON.stringify(products));
}

// DOM elements
const goatGrid = document.getElementById('goat-grid');
const goatCount = document.getElementById('goat-count');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderGoats();
    setupSmoothScrolling();
    setupContactForm();
    updateGoatCount();
    updateLiveStats();
    setupAdminContact();
    renderProducts();
    setupProductManagement();
    
    // Enhanced features
    setupMobileNavigation();
    setupProductSearch();
    setupWeatherWidget();
    setupGoatFiltering();
    setupNewsletterForm();
    setupProductNotifications();
    
    // Track page visit
    trackUserInteraction('page_visit', { page: 'home' });
    
    // Update stats periodically
    setInterval(updateLiveStats, 30000);
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const modals = ['quote-modal', 'visit-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Track navigation
                trackUserInteraction('navigation', { target: this.getAttribute('href') });
            }
        });
    });
});

// Admin contact details logic
function setupAdminContact() {
    const editBtn = document.getElementById('admin-edit-contact');
    const modal = document.getElementById('admin-contact-modal');
    const form = document.getElementById('admin-contact-form');
    const cancelBtn = document.getElementById('admin-cancel');

    // Load and display contact details
    function loadContactDetails() {
        const details = JSON.parse(localStorage.getItem('contactDetails') || '{}');
        document.getElementById('contact-phone').textContent = details.phone ? `📞 ${details.phone}` : '📞 +254 722 123 456';
        document.getElementById('contact-email').textContent = details.email ? `📧 ${details.email}` : '📧 info@mountaingoatfarm.co.ke';
        document.getElementById('contact-whatsapp').textContent = details.whatsapp ? `WhatsApp: ${details.whatsapp}` : '';
        document.getElementById('contact-facebook').textContent = details.facebook ? `Facebook: ${details.facebook}` : '';
        document.getElementById('contact-tiktok').textContent = details.tiktok ? `TikTok: ${details.tiktok}` : '';
    }

    // Show modal and populate fields
    editBtn.addEventListener('click', function() {
        const details = JSON.parse(localStorage.getItem('contactDetails') || '{}');
        form['admin-phone'].value = details.phone || '';
        form['admin-email'].value = details.email || '';
        form['admin-whatsapp'].value = details.whatsapp || '';
        form['admin-facebook'].value = details.facebook || '';
        form['admin-tiktok'].value = details.tiktok || '';
        modal.style.display = 'flex';
    });

    // Hide modal
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Save contact details
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const details = {
            phone: form['admin-phone'].value,
            email: form['admin-email'].value,
            whatsapp: form['admin-whatsapp'].value,
            facebook: form['admin-facebook'].value,
            tiktok: form['admin-tiktok'].value
        };
        localStorage.setItem('contactDetails', JSON.stringify(details));
        loadContactDetails();
        modal.style.display = 'none';
    });

    // Initial load
    loadContactDetails();
}

// Render goats
function renderGoats() {
    if (!goatGrid) return;

    goatGrid.innerHTML = goats.map(goat => `
        <div class="goat-card" data-goat='${JSON.stringify(goat)}'>
            <img src="${goat.image}" alt="${goat.name}" loading="lazy">
            <div class="goat-info">
                <h3>${goat.name}</h3>
                <div class="goat-details">
                    <p><strong>Breed:</strong> ${goat.breed}</p>
                    <p><strong>Age:</strong> ${goat.age} years</p>
                    <p><strong>Weight:</strong> ${goat.weight}</p>
                    <p><strong>Color:</strong> ${goat.color}</p>
                    ${goat.genetics ? `<p><strong>Genetics:</strong> ${goat.genetics}</p>` : ''}
                    ${goat.meatQuality ? `<p class="meat-quality"><strong>Meat Grade:</strong> ${goat.meatQuality}</p>` : ''}
                    ${goat.milkProduction ? `<p><strong>Milk:</strong> ${goat.milkProduction}</p>` : ''}
                </div>
                <div class="goat-badges">
                    ${goat.age >= 2 ? '<span class="badge breeding">Breeding Stock</span>' : ''}
                    ${goat.meatQuality === 'Grade A+' ? '<span class="badge premium">Premium</span>' : ''}
                    ${goat.age < 2 ? '<span class="badge young">Young</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
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
            
            // Collect form data
            const formData = new FormData(contactForm);
            const contactData = Object.fromEntries(formData);
            contactData.timestamp = new Date().toISOString();
            contactData.id = 'contact_' + Date.now();
            
            // Store contact message (in real app, send to server)
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(contactData);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            contactForm.reset();
            showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
        });
    }
}

// Product management functions
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    const featuredGrid = document.getElementById('featured-grid');
    const newGrid = document.getElementById('new-grid');
    const bundlesGrid = document.getElementById('bundles-grid');
    const saleGrid = document.getElementById('sale-grid');
    const seasonalGrid = document.getElementById('seasonal-grid');
    
    if (!productGrid || !featuredGrid) return;
    
    // Clear all grids
    productGrid.innerHTML = '';
    featuredGrid.innerHTML = '';
    if (newGrid) newGrid.innerHTML = '';
    if (bundlesGrid) bundlesGrid.innerHTML = '';
    if (saleGrid) saleGrid.innerHTML = '';
    if (seasonalGrid) seasonalGrid.innerHTML = '';
    
    // Get active filter
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    
    // Filter products
    const filteredProducts = products.filter(product => {
        if (activeFilter === 'all') return product.available;
        if (activeFilter === 'sale') return product.available && product.salePrice;
        if (activeFilter === 'new') return product.available && product.isNew;
        if (activeFilter === 'seasonal') return product.available && product.season && isCurrentSeason(product.season);
        if (activeFilter === 'bundles') return product.available && product.category === 'bundles';
        return product.available && product.category === activeFilter;
    });
    
    // Render different sections
    renderProductSection(filteredProducts.filter(p => p.featured), featuredGrid);
    renderProductSection(filteredProducts.filter(p => p.isNew), newGrid);
    renderProductSection(filteredProducts.filter(p => p.category === 'bundles'), bundlesGrid);
    renderProductSection(filteredProducts.filter(p => p.salePrice), saleGrid);
    renderProductSection(filteredProducts.filter(p => p.season && isCurrentSeason(p.season)), seasonalGrid);
    
    // Render all products
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Show/hide sections based on content
    toggleSectionVisibility();
}

function renderProductSection(products, grid) {
    if (!grid) return;
    products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    
    // Determine card classes
    let cardClasses = 'product-card';
    if (product.featured) cardClasses += ' featured';
    if (product.isNew) cardClasses += ' new';
    if (product.salePrice) cardClasses += ' sale';
    if (product.category === 'bundles') cardClasses += ' bundle';
    if (product.season && isCurrentSeason(product.season)) cardClasses += ' seasonal';
    
    card.className = cardClasses;
    
    // Determine stock status
    const stockStatus = getStockStatus(product);
    const stockClass = stockStatus.toLowerCase().replace(' ', '-');
    
    // Build price HTML
    let priceHTML = '';
    if (product.salePrice) {
        const savings = calculateSavings(product.price, product.salePrice);
        priceHTML = `
            <div class="price-container">
                <span class="original-price">${product.price}</span>
                <span class="sale-price">${product.salePrice}</span>
                <div class="savings">Save ${savings}</div>
            </div>
        `;
    } else {
        priceHTML = `<span class="price">${product.price}</span>`;
    }
    
    // Build bundle contents HTML
    let bundleHTML = '';
    if (product.bundleContents) {
        bundleHTML = `<div class="bundle-contents"><strong>Includes:</strong> ${product.bundleContents}</div>`;
    }
    
    // Build stock indicator
    let stockIndicator = '';
    if (stockStatus !== 'In Stock') {
        stockIndicator = `<div class="stock-indicator ${stockClass}">${stockStatus}</div>`;
    }
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        ${stockIndicator}
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        ${priceHTML}
        ${bundleHTML}
        <span class="stock-status ${stockClass}">${stockStatus}</span>
        ${!product.available ? '<div class="unavailable">Currently Unavailable</div>' : ''}
    `;
    
    return card;
}

function getStockStatus(product) {
    if (product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity <= product.lowStockAlert) return 'Low Stock';
    return 'In Stock';
}

function calculateSavings(originalPrice, salePrice) {
    // Extract numbers from Kenyan Shilling prices (KSh 350/litre format)
    const original = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));
    const sale = parseFloat(salePrice.replace(/[^0-9.]/g, ''));
    const savings = original - sale;
    return 'KSh ' + savings.toFixed(0);
}

function isCurrentSeason(productSeason) {
    const currentMonth = new Date().getMonth();
    const seasons = {
        'spring': [2, 3, 4], // March, April, May
        'summer': [5, 6, 7], // June, July, August
        'fall': [8, 9, 10],  // September, October, November
        'winter': [11, 0, 1] // December, January, February
    };
    
    return seasons[productSeason] && seasons[productSeason].includes(currentMonth);
}

function toggleSectionVisibility() {
    const sections = [
        { element: document.querySelector('.new-products'), grid: document.getElementById('new-grid') },
        { element: document.querySelector('.product-bundles'), grid: document.getElementById('bundles-grid') },
        { element: document.querySelector('.sale-products'), grid: document.getElementById('sale-grid') },
        { element: document.querySelector('.seasonal-products'), grid: document.getElementById('seasonal-grid') }
    ];
    
    sections.forEach(section => {
        if (section.element && section.grid) {
            if (section.grid.children.length > 0) {
                section.element.style.display = 'block';
            } else {
                section.element.style.display = 'none';
            }
        }
    });
}

function setupProductManagement() {
    // Show product management modal
    document.getElementById('admin-manage-products').addEventListener('click', function() {
        document.getElementById('product-management-modal').style.display = 'flex';
        loadProductsForManagement();
        updateStockAlerts();
    });
    
    // Close product management modal
    document.getElementById('close-product-management').addEventListener('click', function() {
        document.getElementById('product-management-modal').style.display = 'none';
    });
    
    // Add new product button
    document.getElementById('add-product-btn').addEventListener('click', function() {
        showProductModal();
    });
    
    // Add bundle button
    document.getElementById('add-bundle-btn').addEventListener('click', function() {
        showProductModal(null, 'bundle');
    });
    
    // Seasonal manager button
    document.getElementById('seasonal-manager-btn').addEventListener('click', function() {
        showSeasonalManager();
    });
    
    // Product form submission
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Cancel product form
    document.getElementById('product-cancel').addEventListener('click', function() {
        hideProductModal();
    });
    
    // Seasonal manager close
    document.getElementById('close-seasonal-manager').addEventListener('click', function() {
        hideSeasonalManager();
    });
    
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts();
        });
    });
    
    // Auto-update stock alerts every 30 seconds
    setInterval(updateStockAlerts, 30000);
}

function updateStockAlerts() {
    const alertsContainer = document.getElementById('low-stock-items');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = '';
    
    const lowStockItems = products.filter(product => {
        const stockStatus = getStockStatus(product);
        return stockStatus === 'Low Stock' || stockStatus === 'Out of Stock';
    });
    
    if (lowStockItems.length === 0) {
        alertsContainer.innerHTML = '<p style="color: #27ae60;">✅ All products are well stocked!</p>';
        return;
    }
    
    lowStockItems.forEach(product => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'stock-alert-item';
        alertDiv.innerHTML = `
            <h5>${product.name}</h5>
            <p>Current Stock: ${product.stockQuantity} | Alert Level: ${product.lowStockAlert}</p>
            <p>Status: <strong>${getStockStatus(product)}</strong></p>
        `;
        alertsContainer.appendChild(alertDiv);
    });
}

function showSeasonalManager() {
    const modal = document.getElementById('seasonal-manager-modal');
    const productsList = document.getElementById('seasonal-products-list');
    const currentSeasonSpan = document.getElementById('current-season');
    
    // Set current season
    const currentSeason = getCurrentSeason();
    currentSeasonSpan.textContent = currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1);
    
    // Load products
    productsList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'seasonal-item';
        productDiv.innerHTML = `
            <h5>${product.name}</h5>
            <div class="seasonal-controls">
                <label>
                    <input type="radio" name="season-${product.id}" value="" ${!product.season ? 'checked' : ''}> All Year
                </label>
                <label>
                    <input type="radio" name="season-${product.id}" value="spring" ${product.season === 'spring' ? 'checked' : ''}> Spring
                </label>
                <label>
                    <input type="radio" name="season-${product.id}" value="summer" ${product.season === 'summer' ? 'checked' : ''}> Summer
                </label>
                <label>
                    <input type="radio" name="season-${product.id}" value="fall" ${product.season === 'fall' ? 'checked' : ''}> Fall
                </label>
                <label>
                    <input type="radio" name="season-${product.id}" value="winter" ${product.season === 'winter' ? 'checked' : ''}> Winter
                </label>
            </div>
        `;
        productsList.appendChild(productDiv);
    });
    
    // Add event listeners for season changes
    productsList.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const productId = e.target.name.split('-')[1];
            const season = e.target.value;
            updateProductSeason(productId, season);
        }
    });
    
    modal.style.display = 'flex';
}

function hideSeasonalManager() {
    document.getElementById('seasonal-manager-modal').style.display = 'none';
}

function getCurrentSeason() {
    const currentMonth = new Date().getMonth();
    if ([2, 3, 4].includes(currentMonth)) return 'spring';
    if ([5, 6, 7].includes(currentMonth)) return 'summer';
    if ([8, 9, 10].includes(currentMonth)) return 'fall';
    return 'winter';
}

function updateProductSeason(productId, season) {
    const product = products.find(p => p.id == productId);
    if (product) {
        product.season = season;
        localStorage.setItem('farmProducts', JSON.stringify(products));
        renderProducts();
    }
}

function loadProductsForManagement() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<p>No products added yet.</p>';
        return;
    }
    
    products.forEach(product => {
        const productDiv = document.createElement('div');
        const stockStatus = getStockStatus(product);
        const stockClass = stockStatus.toLowerCase().replace(' ', '-');
        
        productDiv.className = `product-management-item ${stockClass}`;
        
        // Build badges
        let badges = '';
        if (product.featured) badges += '<span class="badge featured">FEATURED</span>';
        if (product.isNew) badges += '<span class="badge new">NEW</span>';
        if (product.salePrice) badges += '<span class="badge sale">SALE</span>';
        if (product.category === 'bundles') badges += '<span class="badge bundle">BUNDLE</span>';
        if (product.season) badges += '<span class="badge seasonal">SEASONAL</span>';
        
        productDiv.innerHTML = `
            <div class="product-badges">${badges}</div>
            <h4>${product.name}</h4>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> ${product.price} ${product.salePrice ? `<span style="color: #e74c3c;">(Sale: ${product.salePrice})</span>` : ''}</p>
            <p><strong>Stock:</strong> ${product.stockQuantity} units (Alert at ${product.lowStockAlert}) - <span style="color: ${stockStatus === 'In Stock' ? '#27ae60' : stockStatus === 'Low Stock' ? '#f39c12' : '#e74c3c'};">${stockStatus}</span></p>
            <p><strong>Status:</strong> ${product.available ? 'Available' : 'Unavailable'}</p>
            ${product.season ? `<p><strong>Season:</strong> ${product.season}</p>` : ''}
            ${product.bundleContents ? `<p><strong>Bundle:</strong> ${product.bundleContents}</p>` : ''}
            <div class="product-actions">
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="adjustStock(${product.id})">Adjust Stock</button>
                <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        `;
        productsList.appendChild(productDiv);
    });
}

function showProductModal(product = null, type = 'product') {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    
    if (product) {
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-sale-price').value = product.salePrice || '';
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-bundle-contents').value = product.bundleContents || '';
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-stock-quantity').value = product.stockQuantity || 0;
        document.getElementById('product-low-stock').value = product.lowStockAlert || 5;
        document.getElementById('product-season').value = product.season || '';
        document.getElementById('product-featured').checked = product.featured;
        document.getElementById('product-new').checked = product.isNew;
        document.getElementById('product-available').checked = product.available;
        document.getElementById('product-auto-stock').checked = product.autoStock;
    } else {
        document.getElementById('product-modal-title').textContent = type === 'bundle' ? 'Create Product Bundle' : 'Add New Product';
        form.reset();
        document.getElementById('product-available').checked = true;
        document.getElementById('product-auto-stock').checked = true;
        document.getElementById('product-stock-quantity').value = 10;
        document.getElementById('product-low-stock').value = 5;
        
        if (type === 'bundle') {
            document.getElementById('product-category').value = 'bundles';
            document.getElementById('product-new').checked = true;
        }
    }
    
    modal.style.display = 'flex';
}

function hideProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const product = {
        id: productId || Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: document.getElementById('product-price').value,
        salePrice: document.getElementById('product-sale-price').value,
        description: document.getElementById('product-description').value,
        bundleContents: document.getElementById('product-bundle-contents').value,
        image: document.getElementById('product-image').value || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(document.getElementById('product-name').value),
        stockQuantity: parseInt(document.getElementById('product-stock-quantity').value) || 0,
        lowStockAlert: parseInt(document.getElementById('product-low-stock').value) || 5,
        season: document.getElementById('product-season').value,
        featured: document.getElementById('product-featured').checked,
        isNew: document.getElementById('product-new').checked,
        available: document.getElementById('product-available').checked,
        autoStock: document.getElementById('product-auto-stock').checked
    };
    
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id == productId);
        products[index] = product;
    } else {
        // Add new product
        products.push(product);
    }
    
    localStorage.setItem('farmProducts', JSON.stringify(products));
    renderProducts();
    loadProductsForManagement();
    updateStockAlerts();
    hideProductModal();
}

function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (product) {
        showProductModal(product);
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id != id);
        localStorage.setItem('farmProducts', JSON.stringify(products));
        renderProducts();
        loadProductsForManagement();
    }
}

function adjustStock(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const newQuantity = prompt(`Current stock: ${product.stockQuantity}\nEnter new stock quantity:`, product.stockQuantity);
    if (newQuantity !== null && !isNaN(newQuantity)) {
        product.stockQuantity = parseInt(newQuantity);
        localStorage.setItem('farmProducts', JSON.stringify(products));
        renderProducts();
        loadProductsForManagement();
        updateStockAlerts();
    }
}

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

// Enhanced JavaScript functionality for Mountain Goat Farm

// Mobile navigation functionality
function setupMobileNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
}

// Product search functionality
function setupProductSearch() {
    const searchInput = document.getElementById('product-search');
    const searchBtn = document.getElementById('search-btn');
    
    function performSearch() {
        const searchTerm = searchInput?.value.toLowerCase().trim();
        if (!searchTerm) return;
        
        // Scroll to products section
        document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
        
        // Filter products
        setTimeout(() => {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const productName = card.querySelector('h3')?.textContent.toLowerCase();
                const productDesc = card.querySelector('p')?.textContent.toLowerCase();
                
                if (productName?.includes(searchTerm) || productDesc?.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.border = '2px solid #e74c3c';
                    card.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.3)';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show search results message
            showSearchResults(searchTerm);
        }, 500);
    }
    
    searchBtn?.addEventListener('click', performSearch);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Weather widget functionality
function setupWeatherWidget() {
    const weatherTemp = document.getElementById('weather-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const weatherLocation = document.getElementById('weather-location');
    
    // Update location to reflect correct farm location
    if (weatherLocation) {
        weatherLocation.textContent = 'Kirinyaga County';
    }
    
    // Kirinyaga County specific weather conditions (Mount Kenya region)
    const weatherConditions = [
        { temp: '20°C', desc: 'Cool mountain air - perfect grazing' },
        { temp: '23°C', desc: 'Ideal breeding weather' },
        { temp: '18°C', desc: 'Fresh highland breeze' },
        { temp: '25°C', desc: 'Warm sunny day' },
        { temp: '21°C', desc: 'Pleasant mountain climate' },
        { temp: '19°C', desc: 'Crisp morning air' }
    ];
    
    const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    if (weatherTemp) weatherTemp.textContent = currentWeather.temp;
    if (weatherDesc) weatherDesc.textContent = currentWeather.desc;
    
    // Add a subtle animation to show the weather is "live"
    const weatherWidget = document.getElementById('weather-widget');
    if (weatherWidget) {
        weatherWidget.style.opacity = '0';
        setTimeout(() => {
            weatherWidget.style.opacity = '1';
            weatherWidget.style.transition = 'opacity 0.5s ease';
        }, 500);
    }
}

// Goat filtering functionality
function setupGoatFiltering() {
    const filterBtns = document.querySelectorAll('.goat-filters .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterGoats(filter);
        });
    });
}

function filterGoats(filter) {
    const goatCards = document.querySelectorAll('.goat-card');
    
    goatCards.forEach(card => {
        const goatData = JSON.parse(card.getAttribute('data-goat') || '{}');
        let show = true;
        
        switch(filter) {
            case 'breeding':
                show = goatData.age >= 2;
                break;
            case 'young':
                show = goatData.age < 2;
                break;
            case 'boer':
                show = goatData.breed?.toLowerCase().includes('boer');
                break;
            case 'kiko':
                show = goatData.breed?.toLowerCase().includes('kiko');
                break;
            case 'all':
            default:
                show = true;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Live stats update
function updateLiveStats() {
    const heroGoatCount = document.getElementById('hero-goat-count');
    const heroProductCount = document.getElementById('hero-product-count');
    
    if (heroGoatCount) heroGoatCount.textContent = goats.length;
    if (heroProductCount) heroProductCount.textContent = products.filter(p => p.available).length;
}

// Show message functionality
function showMessage(text, type = 'success') {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert after the first section
    const firstSection = document.querySelector('main section');
    if (firstSection) {
        firstSection.insertAdjacentElement('afterend', message);
        
        // Scroll to message
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Newsletter functionality
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate newsletter signup
            showMessage('Thank you for subscribing! We\'ll keep you updated with the latest from our farm.', 'success');
            this.reset();
            
            // Store email (in real app, send to server)
            const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            }
        });
    }
}

// Quote request functionality
function requestQuote() {
    const modal = document.getElementById('quote-modal');
    modal.style.display = 'flex';
    
    const form = document.getElementById('quote-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const quoteData = Object.fromEntries(formData);
        quoteData.timestamp = new Date().toISOString();
        quoteData.id = 'quote_' + Date.now();
        
        // Store quote request (in real app, send to server)
        const quotes = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
        quotes.push(quoteData);
        localStorage.setItem('quoteRequests', JSON.stringify(quotes));
        
        closeQuoteModal();
        showMessage('Quote request submitted successfully! We\'ll contact you within 24 hours.', 'success');
    };
}

function closeQuoteModal() {
    document.getElementById('quote-modal').style.display = 'none';
}

// Visit scheduling functionality
function scheduleVisit() {
    const modal = document.getElementById('visit-modal');
    modal.style.display = 'flex';
    
    // Set minimum date to tomorrow
    const dateInput = modal.querySelector('input[type="date"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    const form = document.getElementById('visit-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const visitData = Object.fromEntries(formData);
        visitData.timestamp = new Date().toISOString();
        visitData.id = 'visit_' + Date.now();
        visitData.status = 'pending';
        
        // Store visit request (in real app, send to server)
        const visits = JSON.parse(localStorage.getItem('visitRequests') || '[]');
        visits.push(visitData);
        localStorage.setItem('visitRequests', JSON.stringify(visits));
        
        closeVisitModal();
        showMessage('Visit scheduled successfully! We\'ll confirm your appointment soon.', 'success');
    };
}

function closeVisitModal() {
    document.getElementById('visit-modal').style.display = 'none';
}

// Enhanced product management with notifications
function setupProductNotifications() {
    // Check for low stock
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockAlert);
    
    if (lowStockProducts.length > 0) {
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'stock-notification';
            notification.innerHTML = `
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 10px; margin: 20px; position: fixed; top: 120px; right: 20px; z-index: 1000; max-width: 300px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Low Stock Alert</h4>
                    <p style="color: #856404; margin: 0; font-size: 0.9rem;">${lowStockProducts.length} product(s) running low on stock</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-top: 10px; cursor: pointer; font-size: 0.8rem;">Close</button>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Auto remove after 10 seconds
            setTimeout(() => {
                notification.remove();
            }, 10000);
        }, 2000);
    }
}

// Analytics tracking (basic)
function trackUserInteraction(action, details = {}) {
    const interaction = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: window.location.pathname
    };
    
    const analytics = JSON.parse(localStorage.getItem('farmAnalytics') || '[]');
    analytics.push(interaction);
    
    // Keep only last 100 interactions
    if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('farmAnalytics', JSON.stringify(analytics));
}
