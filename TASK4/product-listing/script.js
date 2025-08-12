// Product Listing App with Filtering and Sorting
class ProductListingApp {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.filters = {
            category: '',
            priceRange: '',
            rating: '',
            brand: '',
            search: ''
        };
        this.sortBy = 'name';
        
        this.initializeElements();
        this.bindEvents();
        this.loadProducts();
        this.updateCartCount();
    }

    initializeElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        
        // Filter elements
        this.categoryFilter = document.getElementById('categoryFilter');
        this.priceFilter = document.getElementById('priceFilter');
        this.ratingFilter = document.getElementById('ratingFilter');
        this.brandFilter = document.getElementById('brandFilter');
        
        // Sort elements
        this.sortBy = document.getElementById('sortBy');
        
        // View elements
        this.viewButtons = document.querySelectorAll('.view-btn');
        
        // Display elements
        this.productsGrid = document.getElementById('productsGrid');
        this.resultsCount = document.getElementById('resultsCount');
        this.activeFilters = document.getElementById('activeFilters');
        this.loadingState = document.getElementById('loadingState');
        this.emptyState = document.getElementById('emptyState');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');
        
        // Pagination elements
        this.pagination = document.getElementById('pagination');
        this.prevPage = document.getElementById('prevPage');
        this.nextPage = document.getElementById('nextPage');
        this.pageNumbers = document.getElementById('pageNumbers');
        
        // Cart elements
        this.cartCount = document.getElementById('cartCount');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.closeCart = document.getElementById('closeCart');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        // Modal elements
        this.quickViewModal = document.getElementById('quickViewModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.closeModal = document.getElementById('closeModal');
    }

    bindEvents() {
        // Search events
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        
        // Filter events
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.priceFilter.addEventListener('change', () => this.applyFilters());
        this.ratingFilter.addEventListener('change', () => this.applyFilters());
        this.brandFilter.addEventListener('change', () => this.applyFilters());
        
        // Sort events
        this.sortBy.addEventListener('change', () => this.applySorting());
        
        // View events
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e));
        });
        
        // Cart events
        this.cartCount.addEventListener('click', () => this.toggleCart());
        this.closeCart.addEventListener('click', () => this.toggleCart());
        this.cartOverlay.addEventListener('click', () => this.toggleCart());
        this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.closeQuickView());
        this.quickViewModal.addEventListener('click', (e) => {
            if (e.target === this.quickViewModal) {
                this.closeQuickView();
            }
        });
        
        // Clear filters
        this.clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        
        // Pagination events
        this.prevPage.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPage.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    async loadProducts() {
        this.showLoading();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample product data
        this.products = [
            {
                id: 1,
                name: "MacBook Pro 13-inch",
                brand: "Apple",
                category: "laptops",
                price: 1299,
                rating: 4.8,
                reviews: 245,
                image: "💻",
                description: "Powerful laptop with M2 chip, perfect for professionals.",
                inStock: true,
                badge: "New"
            },
            {
                id: 2,
                name: "iPhone 15 Pro",
                brand: "Apple",
                category: "smartphones",
                price: 999,
                rating: 4.9,
                reviews: 189,
                image: "📱",
                description: "Latest iPhone with advanced camera system and A17 Pro chip.",
                inStock: true,
                badge: "Popular"
            },
            {
                id: 3,
                name: "Samsung Galaxy S24",
                brand: "Samsung",
                category: "smartphones",
                price: 899,
                rating: 4.7,
                reviews: 156,
                image: "📱",
                description: "Android flagship with AI features and excellent camera.",
                inStock: true
            },
            {
                id: 4,
                name: "Dell XPS 15",
                brand: "Dell",
                category: "laptops",
                price: 1499,
                rating: 4.6,
                reviews: 98,
                image: "💻",
                description: "Premium Windows laptop with stunning display.",
                inStock: true
            },
            {
                id: 5,
                name: "iPad Air",
                brand: "Apple",
                category: "tablets",
                price: 599,
                rating: 4.8,
                reviews: 203,
                image: "📱",
                description: "Versatile tablet perfect for work and entertainment.",
                inStock: true
            },
            {
                id: 6,
                name: "Sony WH-1000XM5",
                brand: "Sony",
                category: "accessories",
                price: 349,
                rating: 4.9,
                reviews: 312,
                image: "🎧",
                description: "Premium noise-canceling headphones with exceptional sound.",
                inStock: true,
                badge: "Best Seller"
            },
            {
                id: 7,
                name: "PlayStation 5",
                brand: "Sony",
                category: "gaming",
                price: 499,
                rating: 4.7,
                reviews: 445,
                image: "🎮",
                description: "Next-generation gaming console with stunning graphics.",
                inStock: false
            },
            {
                id: 8,
                name: "HP Spectre x360",
                brand: "HP",
                category: "laptops",
                price: 1199,
                rating: 4.5,
                reviews: 87,
                image: "💻",
                description: "Convertible laptop with 2-in-1 design.",
                inStock: true
            },
            {
                id: 9,
                name: "Samsung Galaxy Tab S9",
                brand: "Samsung",
                category: "tablets",
                price: 699,
                rating: 4.6,
                reviews: 134,
                image: "📱",
                description: "Premium Android tablet with S Pen support.",
                inStock: true
            },
            {
                id: 10,
                name: "Microsoft Surface Pro 9",
                brand: "Microsoft",
                category: "tablets",
                price: 999,
                rating: 4.4,
                reviews: 76,
                image: "💻",
                description: "Versatile 2-in-1 device perfect for productivity.",
                inStock: true
            },
            {
                id: 11,
                name: "Lenovo ThinkPad X1",
                brand: "Lenovo",
                category: "laptops",
                price: 1599,
                rating: 4.8,
                reviews: 123,
                image: "💻",
                description: "Business laptop with exceptional build quality.",
                inStock: true
            },
            {
                id: 12,
                name: "AirPods Pro",
                brand: "Apple",
                category: "accessories",
                price: 249,
                rating: 4.7,
                reviews: 567,
                image: "🎧",
                description: "Wireless earbuds with active noise cancellation.",
                inStock: true
            }
        ];
        
        this.filteredProducts = [...this.products];
        this.renderProducts();
        this.hideLoading();
    }

    handleSearch() {
        this.filters.search = this.searchInput.value.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        this.filters.category = this.categoryFilter.value;
        this.filters.priceRange = this.priceFilter.value;
        this.filters.rating = this.ratingFilter.value;
        this.filters.brand = this.brandFilter.value;
        
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.filters.search && !product.name.toLowerCase().includes(this.filters.search) && 
                !product.description.toLowerCase().includes(this.filters.search)) {
                return false;
            }
            
            // Category filter
            if (this.filters.category && product.category !== this.filters.category) {
                return false;
            }
            
            // Brand filter
            if (this.filters.brand && product.brand !== this.filters.brand) {
                return false;
            }
            
            // Price range filter
            if (this.filters.priceRange) {
                const [min, max] = this.filters.priceRange.split('-').map(Number);
                if (max && (product.price < min || product.price > max)) {
                    return false;
                } else if (!max && product.price < min) {
                    return false;
                }
            }
            
            // Rating filter
            if (this.filters.rating) {
                const [minRating] = this.filters.rating.split('-').map(Number);
                if (product.rating < minRating) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.applySorting();
        this.currentPage = 1;
        this.renderProducts();
        this.updateActiveFilters();
    }

    applySorting() {
        const sortBy = this.sortBy.value;
        
        this.filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id;
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    }

    handleViewChange(e) {
        const view = e.target.dataset.view;
        
        this.viewButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentView = view;
        this.productsGrid.className = `products-grid ${view === 'list' ? 'list-view' : ''}`;
        this.renderProducts();
    }

    renderProducts() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        if (productsToShow.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            this.productsGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        }
        
        this.updateResultsCount();
        this.renderPagination();
    }

    createProductCard(product) {
        const isInCart = this.cart.some(item => item.id === product.id);
        
        return `
            <div class="product-card ${this.currentView === 'list' ? 'list-view' : ''}" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image}
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-content">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-brand">${product.brand}</p>
                        <div class="product-rating">
                            <div class="stars">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="rating-text">${product.rating} (${product.reviews})</span>
                        </div>
                        <div class="product-price">$${product.price.toLocaleString()}</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="app.showQuickView(${product.id})">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                        <button class="btn ${isInCart ? 'btn-secondary' : 'btn-primary'}" 
                                onclick="app.${isInCart ? 'removeFromCart' : 'addToCart'}(${product.id})">
                            <i class="fas fa-${isInCart ? 'check' : 'shopping-cart'}"></i>
                            ${isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.modalTitle.textContent = product.name;
        this.modalBody.innerHTML = `
            <div style="display: flex; gap: 2rem; align-items: start;">
                <div style="flex-shrink: 0;">
                    <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: white; border-radius: 10px;">
                        ${product.image}
                    </div>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 0.5rem; color: #2c3e50;">${product.brand}</h4>
                    <p style="color: #6c757d; margin-bottom: 1rem;">${product.description}</p>
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <div style="color: #ffc107;">${this.generateStars(product.rating)}</div>
                            <span style="color: #6c757d;">${product.rating} (${product.reviews} reviews)</span>
                        </div>
                    </div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #2c3e50; margin-bottom: 1rem;">
                        $${product.price.toLocaleString()}
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" onclick="app.addToCart(${product.id}); app.closeQuickView();">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="app.closeQuickView();">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.quickViewModal.style.display = 'block';
    }

    closeQuickView() {
        this.quickViewModal.style.display = 'none';
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.renderProducts(); // Refresh to update button states
        this.showToast('Product added to cart!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderProducts();
        this.showToast('Product removed from cart!', 'success');
    }

    toggleCart() {
        this.cartSidebar.classList.toggle('open');
        this.cartOverlay.classList.toggle('show');
        this.renderCart();
    }

    renderCart() {
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 2rem;">Your cart is empty</p>';
            this.cartTotal.textContent = '$0.00';
            return;
        }
        
        this.cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotal.textContent = `$${total.toLocaleString()}`;
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!', 'error');
            return;
        }
        
        this.showToast('Checkout functionality would be implemented here!', 'info');
        // In a real app, this would redirect to checkout page
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateResultsCount() {
        const count = this.filteredProducts.length;
        this.resultsCount.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
    }

    updateActiveFilters() {
        const activeFilters = [];
        
        if (this.filters.category) {
            activeFilters.push({
                label: `Category: ${this.filters.category}`,
                key: 'category'
            });
        }
        
        if (this.filters.priceRange) {
            activeFilters.push({
                label: `Price: ${this.filters.priceRange}`,
                key: 'priceRange'
            });
        }
        
        if (this.filters.rating) {
            activeFilters.push({
                label: `Rating: ${this.filters.rating}`,
                key: 'rating'
            });
        }
        
        if (this.filters.brand) {
            activeFilters.push({
                label: `Brand: ${this.filters.brand}`,
                key: 'brand'
            });
        }
        
        if (this.filters.search) {
            activeFilters.push({
                label: `Search: "${this.filters.search}"`,
                key: 'search'
            });
        }
        
        this.activeFilters.innerHTML = activeFilters.map(filter => `
            <div class="filter-tag">
                ${filter.label}
                <button onclick="app.removeFilter('${filter.key}')">&times;</button>
            </div>
        `).join('');
    }

    removeFilter(key) {
        switch (key) {
            case 'category':
                this.categoryFilter.value = '';
                break;
            case 'priceRange':
                this.priceFilter.value = '';
                break;
            case 'rating':
                this.ratingFilter.value = '';
                break;
            case 'brand':
                this.brandFilter.value = '';
                break;
            case 'search':
                this.searchInput.value = '';
                break;
        }
        
        this.applyFilters();
    }

    clearAllFilters() {
        this.categoryFilter.value = '';
        this.priceFilter.value = '';
        this.ratingFilter.value = '';
        this.brandFilter.value = '';
        this.searchInput.value = '';
        this.applyFilters();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            this.pagination.style.display = 'none';
            return;
        }
        
        this.pagination.style.display = 'flex';
        
        // Previous button
        this.prevPage.disabled = this.currentPage === 1;
        
        // Next button
        this.nextPage.disabled = this.currentPage === totalPages;
        
        // Page numbers
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(`
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="app.goToPage(${i})">${i}</button>
            `);
        }
        
        this.pageNumbers.innerHTML = pageNumbers.join('');
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showLoading() {
        this.loadingState.style.display = 'flex';
        this.productsGrid.style.display = 'none';
        this.emptyState.style.display = 'none';
    }

    hideLoading() {
        this.loadingState.style.display = 'none';
        this.productsGrid.style.display = 'grid';
    }

    showEmptyState() {
        this.emptyState.style.display = 'block';
        this.productsGrid.style.display = 'none';
    }

    hideEmptyState() {
        this.emptyState.style.display = 'none';
        this.productsGrid.style.display = 'grid';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#dc3545' : '#667eea'};
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.searchInput.focus();
        }
        
        // Escape to close modal/cart
        if (e.key === 'Escape') {
            if (this.quickViewModal.style.display === 'block') {
                this.closeQuickView();
            }
            if (this.cartSidebar.classList.contains('open')) {
                this.toggleCart();
            }
        }
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ProductListingApp();
}); 