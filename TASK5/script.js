// TechStore E-commerce Application

class TechStore {
    constructor() {
        this.products = [];
        this.cart = [];
        this.filteredProducts = [];
        this.currentFilters = {
            category: 'all',
            priceRange: 'all',
            sortBy: 'name',
            searchQuery: ''
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadProducts();
        this.renderProducts();
        this.loadCartFromStorage();
        this.updateCartUI();
    }

    setupEventListeners() {
        // Search functionality
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        
        searchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Debounced search for better performance
        let searchTimeout;
        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.searchQuery = e.target.value.toLowerCase();
                this.filterAndRenderProducts();
            }, 300);
        });

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');

        categoryFilter?.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.filterAndRenderProducts();
        });

        priceFilter?.addEventListener('change', (e) => {
            this.currentFilters.priceRange = e.target.value;
            this.filterAndRenderProducts();
        });

        sortFilter?.addEventListener('change', (e) => {
            this.currentFilters.sortBy = e.target.value;
            this.filterAndRenderProducts();
        });

        // Cart functionality
        const cartBtn = document.getElementById('cartBtn');
        const cartClose = document.getElementById('cartClose');
        const checkoutBtn = document.getElementById('checkoutBtn');

        cartBtn?.addEventListener('click', () => {
            // Check if we're on the main page or cart page
            if (window.location.pathname.includes('cart.html')) {
                this.toggleCart();
            } else {
                window.location.href = 'cart.html';
            }
        });
        cartClose?.addEventListener('click', () => this.toggleCart());
        checkoutBtn?.addEventListener('click', () => this.handleCheckout());

        // Modal functionality
        const productModal = document.getElementById('productModal');
        const modalClose = document.getElementById('modalClose');
        const overlay = document.getElementById('overlay');

        modalClose?.addEventListener('click', () => this.closeModal());
        overlay?.addEventListener('click', () => this.closeModal());

        // User modal
        const userBtn = document.getElementById('userBtn');
        const userModalClose = document.getElementById('userModalClose');
        const loginBtn = document.getElementById('loginBtn');

        userBtn?.addEventListener('click', () => this.openUserModal());
        userModalClose?.addEventListener('click', () => this.closeUserModal());
        loginBtn?.addEventListener('click', () => this.handleLogin());

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());

        // Mobile navigation links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                this.currentFilters.category = category;
                document.getElementById('categoryFilter').value = category;
                this.filterAndRenderProducts();
                this.toggleMobileMenu();
            });
        });

        // Navigation menu links
        const navMenuLinks = document.querySelectorAll('.nav-menu-link[data-category]');
        navMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                this.currentFilters.category = category;
                document.getElementById('categoryFilter').value = category;
                this.filterAndRenderProducts();
                
                // Update active state
                navMenuLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Footer category links
        const footerLinks = document.querySelectorAll('.footer-link[data-category]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                this.currentFilters.category = category;
                document.getElementById('categoryFilter').value = category;
                this.filterAndRenderProducts();
            });
        });

        // Hero button
        const shopNowBtn = document.getElementById('shopNowBtn');
        shopNowBtn?.addEventListener('click', () => {
            document.querySelector('.products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeUserModal();
                this.toggleCart(false);
                this.toggleMobileMenu(false);
            }
        });
    }

    async loadProducts() {
        try {
            // Simulate API call with realistic product data
            this.products = [
                {
                    id: 1,
                    name: "iPhone 15 Pro",
                    category: "smartphones",
                    price: 999.99,
                    rating: 4.8,
                    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>📱</text></svg>"
                },
                {
                    id: 2,
                    name: "MacBook Air M2",
                    category: "laptops",
                    price: 1199.99,
                    rating: 4.9,
                    description: "Ultra-thin laptop with M2 chip, all-day battery life, and stunning Retina display.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>💻</text></svg>"
                },
                {
                    id: 3,
                    name: "AirPods Pro",
                    category: "accessories",
                    price: 249.99,
                    rating: 4.7,
                    description: "Active noise cancellation, spatial audio, and sweat and water resistance.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>🎧</text></svg>"
                },
                {
                    id: 4,
                    name: "Samsung Galaxy S24",
                    category: "smartphones",
                    price: 899.99,
                    rating: 4.6,
                    description: "AI-powered smartphone with advanced camera features and long battery life.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>📱</text></svg>"
                },
                {
                    id: 5,
                    name: "Dell XPS 13",
                    category: "laptops",
                    price: 1299.99,
                    rating: 4.5,
                    description: "Premium ultrabook with InfinityEdge display and powerful performance.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>💻</text></svg>"
                },
                {
                    id: 6,
                    name: "Apple Watch Series 9",
                    category: "accessories",
                    price: 399.99,
                    rating: 4.8,
                    description: "Advanced health monitoring, fitness tracking, and seamless iPhone integration.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>⌚</text></svg>"
                },
                {
                    id: 7,
                    name: "Google Pixel 8",
                    category: "smartphones",
                    price: 699.99,
                    rating: 4.4,
                    description: "Pure Android experience with exceptional camera capabilities and AI features.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>📱</text></svg>"
                },
                {
                    id: 8,
                    name: "HP Spectre x360",
                    category: "laptops",
                    price: 1499.99,
                    rating: 4.3,
                    description: "Convertible laptop with 2-in-1 design and premium build quality.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>💻</text></svg>"
                },
                {
                    id: 9,
                    name: "Sony WH-1000XM5",
                    category: "accessories",
                    price: 349.99,
                    rating: 4.9,
                    description: "Industry-leading noise cancellation with exceptional sound quality.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>🎧</text></svg>"
                },
                {
                    id: 10,
                    name: "iPad Pro 12.9",
                    category: "accessories",
                    price: 1099.99,
                    rating: 4.7,
                    description: "Professional tablet with M2 chip and Liquid Retina XDR display.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>📱</text></svg>"
                },
                {
                    id: 11,
                    name: "OnePlus 12",
                    category: "smartphones",
                    price: 799.99,
                    rating: 4.5,
                    description: "Flagship killer with Hasselblad camera and fast charging technology.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>📱</text></svg>"
                },
                {
                    id: 12,
                    name: "Lenovo ThinkPad X1",
                    category: "laptops",
                    price: 1899.99,
                    rating: 4.6,
                    description: "Business-class laptop with legendary durability and security features.",
                    image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='100' y='100' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b'>💻</text></svg>"
                }
            ];

            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products. Please try again later.');
        }
    }

    filterAndRenderProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.currentFilters.category !== 'all' && 
                product.category !== this.currentFilters.category) {
                return false;
            }

            // Price range filter
            if (this.currentFilters.priceRange !== 'all') {
                const [min, max] = this.parsePriceRange(this.currentFilters.priceRange);
                if (product.price < min || (max && product.price > max)) {
                    return false;
                }
            }

            // Search filter
            if (this.currentFilters.searchQuery && 
                !product.name.toLowerCase().includes(this.currentFilters.searchQuery) &&
                !product.description.toLowerCase().includes(this.currentFilters.searchQuery)) {
                return false;
            }

            return true;
        });

        // Sort products
        this.sortProducts();

        this.renderProducts();
    }

    parsePriceRange(range) {
        switch (range) {
            case '0-100': return [0, 100];
            case '100-500': return [100, 500];
            case '500-1000': return [500, 1000];
            case '1000+': return [1000, null];
            default: return [0, null];
        }
    }

    sortProducts() {
        switch (this.currentFilters.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
            default:
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const productsCount = document.getElementById('productsCount');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noProducts = document.getElementById('noProducts');

        if (!productsGrid) return;

        // Update count
        if (productsCount) {
            productsCount.textContent = `${this.filteredProducts.length} products found`;
        }

        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        // Show/hide no products message
        if (noProducts) {
            noProducts.style.display = this.filteredProducts.length === 0 ? 'block' : 'none';
        }

        // Clear existing products
        productsGrid.innerHTML = '';

        // Render products with lazy loading
        this.filteredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            
            // Add lazy loading for images (simulated)
            if (index > 5) {
                productCard.style.opacity = '0';
                setTimeout(() => {
                    productCard.style.opacity = '1';
                }, index * 50);
            }
            
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-rating">
                            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                            <span>${product.rating}</span>
                        </div>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToCart(product);
        });

        card.addEventListener('click', () => {
            this.openProductModal(product);
        });

        return card;
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    updateCartItemQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        // Update cart count
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: var(--spacing-4);">Your cart is empty</p>';
            } else {
                this.cart.forEach(item => {
                    const cartItem = this.createCartItem(item);
                    cartItems.appendChild(cartItem);
                });
            }
        }

        // Update total
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
                    <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                </div>
            </div>
        `;

        // Add event listeners
        const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
        const increaseBtn = cartItem.querySelector('[data-action="increase"]');
        const quantityInput = cartItem.querySelector('.quantity-input');

        decreaseBtn.addEventListener('click', () => {
            this.updateCartItemQuantity(item.id, item.quantity - 1);
        });

        increaseBtn.addEventListener('click', () => {
            this.updateCartItemQuantity(item.id, item.quantity + 1);
        });

        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                this.updateCartItemQuantity(item.id, newQuantity);
            }
        });

        return cartItem;
    }

    toggleCart(show = null) {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (!cartSidebar) return;

        const isVisible = cartSidebar.classList.contains('active');
        const shouldShow = show !== null ? show : !isVisible;

        if (shouldShow) {
            cartSidebar.classList.add('active');
            overlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('active');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleMobileMenu(show = null) {
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('overlay');
        
        if (!mobileMenu) return;

        const isVisible = mobileMenu.classList.contains('active');
        const shouldShow = show !== null ? show : !isVisible;

        if (shouldShow) {
            mobileMenu.classList.add('active');
            overlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openProductModal(product) {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="product-modal-content">
                <img src="${product.image}" alt="${product.name}" class="product-modal-image">
                <div class="product-modal-details">
                    <h2>${product.name}</h2>
                    <p class="product-modal-category">${product.category}</p>
                    <p class="product-modal-description">${product.description}</p>
                    <div class="product-modal-price">$${product.price.toFixed(2)}</div>
                    <div class="product-modal-actions">
                        <div class="quantity-controls">
                            <button class="quantity-decrease">-</button>
                            <input type="number" value="1" min="1" class="quantity-input-modal">
                            <button class="quantity-increase">+</button>
                        </div>
                        <button class="add-to-cart-modal-btn" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for modal
        const quantityDecrease = modalBody.querySelector('.quantity-decrease');
        const quantityIncrease = modalBody.querySelector('.quantity-increase');
        const quantityInput = modalBody.querySelector('.quantity-input-modal');
        const addToCartBtn = modalBody.querySelector('.add-to-cart-modal-btn');

        quantityDecrease.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        quantityIncrease.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });

        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            for (let i = 0; i < quantity; i++) {
                this.addToCart(product);
            }
            this.closeModal();
        });

        modal.classList.add('active');
        document.getElementById('overlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        const overlay = document.getElementById('overlay');
        
        modal?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    openUserModal() {
        const modal = document.getElementById('userModal');
        const overlay = document.getElementById('overlay');
        
        modal?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeUserModal() {
        const modal = document.getElementById('userModal');
        const overlay = document.getElementById('overlay');
        
        modal?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            this.currentFilters.searchQuery = searchInput.value.toLowerCase();
            this.filterAndRenderProducts();
        }
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }

        // Redirect to cart page for full checkout process
        window.location.href = 'cart.html';
    }

    handleLogin() {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login
        this.showNotification('Login successful! (Demo mode)', 'success');
        this.closeUserModal();
        
        // Clear form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('techstore_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('techstore_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cart = [];
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 
                        type === 'error' ? 'var(--error-color)' : 
                        type === 'warning' ? 'var(--warning-color)' : 'var(--primary-color)'};
            color: white;
            padding: var(--spacing-3) var(--spacing-4);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // Performance optimization: Intersection Observer for lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TechStore();
});

// Service Worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
} 