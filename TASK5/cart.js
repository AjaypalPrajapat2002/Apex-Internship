// Cart Page Functionality
class CartPage {
    constructor() {
        this.cart = [];
        this.shippingCost = 0;
        this.taxRate = 0.08; // 8% tax rate
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.renderCart();
        this.updateOrderSummary();
    }

    setupEventListeners() {
        // Checkout button
        const proceedToCheckout = document.getElementById('proceedToCheckout');
        proceedToCheckout?.addEventListener('click', () => this.openCheckoutModal());

        // Checkout modal
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutModalClose = document.getElementById('checkoutModalClose');
        const overlay = document.getElementById('overlay');

        checkoutModalClose?.addEventListener('click', () => this.closeCheckoutModal());
        overlay?.addEventListener('click', () => this.closeCheckoutModal());

        // Success modal
        const successModal = document.getElementById('successModal');

        // Checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        checkoutForm?.addEventListener('submit', (e) => this.handleOrderSubmission(e));

        // Cancel checkout
        const cancelCheckout = document.getElementById('cancelCheckout');
        cancelCheckout?.addEventListener('click', () => this.closeCheckoutModal());

        // User modal
        const userBtn = document.getElementById('userBtn');
        const userModalClose = document.getElementById('userModalClose');
        const loginBtn = document.getElementById('loginBtn');

        userBtn?.addEventListener('click', () => this.openUserModal());
        userModalClose?.addEventListener('click', () => this.closeUserModal());
        loginBtn?.addEventListener('click', () => this.handleLogin());

        // Payment method toggle
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => this.togglePaymentMethod());
        });

        // Form validation
        this.setupFormValidation();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCheckoutModal();
                this.closeUserModal();
            }
        });
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

    renderCart() {
        const cartItemsList = document.getElementById('cartItemsList');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartItemCount = document.getElementById('cartItemCount');

        if (!cartItemsList) return;

        if (this.cart.length === 0) {
            cartItemsList.style.display = 'none';
            cartEmpty.style.display = 'block';
            cartItemCount.textContent = 'Your cart is empty';
            return;
        }

        cartItemsList.style.display = 'block';
        cartEmpty.style.display = 'none';
        cartItemCount.textContent = `${this.cart.length} item${this.cart.length !== 1 ? 's' : ''}`;

        cartItemsList.innerHTML = '';

        this.cart.forEach(item => {
            const cartItem = this.createCartItemElement(item);
            cartItemsList.appendChild(cartItem);
        });
    }

    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item-detailed';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-category">${item.category}</p>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
                <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <button class="remove-item-btn" data-product-id="${item.id}" aria-label="Remove item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Add event listeners
        const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
        const increaseBtn = cartItem.querySelector('[data-action="increase"]');
        const quantityInput = cartItem.querySelector('.quantity-input');
        const removeBtn = cartItem.querySelector('.remove-item-btn');

        decreaseBtn.addEventListener('click', () => this.updateItemQuantity(item.id, item.quantity - 1));
        increaseBtn.addEventListener('click', () => this.updateItemQuantity(item.id, item.quantity + 1));
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                this.updateItemQuantity(item.id, newQuantity);
            }
        });
        removeBtn.addEventListener('click', () => this.removeItem(item.id));

        return cartItem;
    }

    updateItemQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCartToStorage();
            this.renderCart();
            this.updateOrderSummary();
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.renderCart();
        this.updateOrderSummary();
        this.showNotification('Item removed from cart', 'info');
    }

    updateOrderSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        const tax = subtotal * this.taxRate;
        const total = subtotal + this.shippingCost + tax;

        // Update summary display
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = this.shippingCost === 0 ? 'FREE' : `$${this.shippingCost.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        // Update checkout button
        const proceedToCheckout = document.getElementById('proceedToCheckout');
        if (proceedToCheckout) {
            proceedToCheckout.disabled = this.cart.length === 0;
        }

        // Update summary items
        this.updateSummaryItems();
    }

    updateSummaryItems() {
        const summaryItems = document.getElementById('summaryItems');
        if (!summaryItems) return;

        summaryItems.innerHTML = '';

        this.cart.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <div class="summary-item-info">
                    <span class="summary-item-name">${item.name}</span>
                    <span class="summary-item-quantity">x${item.quantity}</span>
                </div>
                <span class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            summaryItems.appendChild(summaryItem);
        });
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('techstore_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    openCheckoutModal() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        const overlay = document.getElementById('overlay');
        
        this.loadOrderReview();
        modal?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        const overlay = document.getElementById('overlay');
        
        modal?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    loadOrderReview() {
        const orderReview = document.getElementById('orderReview');
        if (!orderReview) return;

        orderReview.innerHTML = '';

        this.cart.forEach(item => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-item-info">
                    <img src="${item.image}" alt="${item.name}" class="review-item-image">
                    <div class="review-item-details">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <span class="review-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderReview.appendChild(reviewItem);
        });

        // Add totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * this.taxRate;
        const total = subtotal + this.shippingCost + tax;

        const totalsDiv = document.createElement('div');
        totalsDiv.className = 'review-totals';
        totalsDiv.innerHTML = `
            <div class="review-total-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="review-total-row">
                <span>Shipping:</span>
                <span>${this.shippingCost === 0 ? 'FREE' : '$' + this.shippingCost.toFixed(2)}</span>
            </div>
            <div class="review-total-row">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="review-total-row review-total-final">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
        orderReview.appendChild(totalsDiv);
    }

    setupFormValidation() {
        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        cardNumber?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });

        // Expiry date formatting
        const expiryDate = document.getElementById('expiryDate');
        expiryDate?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // CVV validation
        const cvv = document.getElementById('cvv');
        cvv?.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    togglePaymentMethod() {
        const creditCardForm = document.getElementById('creditCardForm');
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (selectedMethod?.value === 'creditCard') {
            creditCardForm.style.display = 'block';
        } else {
            creditCardForm.style.display = 'none';
        }
    }

    async handleOrderSubmission(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.getElementById('placeOrder');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        try {
            // Simulate payment processing
            await this.processPayment();
            
            // Show success modal
            this.showSuccessModal();
            
            // Clear cart
            this.cart = [];
            this.saveCartToStorage();
            this.renderCart();
            this.updateOrderSummary();
            
        } catch (error) {
            this.showNotification('Payment failed. Please try again.', 'error');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    validateForm() {
        const form = document.getElementById('checkoutForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.highlightError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearError(field);
            }
        });

        // Validate email
        const email = document.getElementById('email');
        if (email && email.value && !this.isValidEmail(email.value)) {
            this.highlightError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phone = document.getElementById('phone');
        if (phone && phone.value && !this.isValidPhone(phone.value)) {
            this.highlightError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate card number (if credit card selected)
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (paymentMethod?.value === 'creditCard') {
            const cardNumber = document.getElementById('cardNumber');
            if (cardNumber && !this.isValidCardNumber(cardNumber.value)) {
                this.highlightError(cardNumber, 'Please enter a valid card number');
                isValid = false;
            }

            const expiryDate = document.getElementById('expiryDate');
            if (expiryDate && !this.isValidExpiryDate(expiryDate.value)) {
                this.highlightError(expiryDate, 'Please enter a valid expiry date');
                isValid = false;
            }

            const cvv = document.getElementById('cvv');
            if (cvv && !this.isValidCVV(cvv.value)) {
                this.highlightError(cvv, 'Please enter a valid CVV');
                isValid = false;
            }
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    isValidCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return cleanNumber.length >= 13 && cleanNumber.length <= 19;
    }

    isValidExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        return expMonth >= 1 && expMonth <= 12 && 
               expYear >= currentYear && 
               (expYear > currentYear || expMonth >= currentMonth);
    }

    isValidCVV(cvv) {
        return cvv.length >= 3 && cvv.length <= 4;
    }

    highlightError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async processPayment() {
        // Simulate payment processing delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('Payment failed'));
                }
            }, 2000);
        });
    }

    showSuccessModal() {
        this.closeCheckoutModal();
        
        const successModal = document.getElementById('successModal');
        const overlay = document.getElementById('overlay');
        const orderDetails = document.getElementById('orderDetails');

        // Generate order number
        const orderNumber = 'TS' + Date.now().toString().slice(-8);
        
        orderDetails.innerHTML = `
            <div class="order-info">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${this.calculateTotal().toFixed(2)}</p>
            </div>
        `;

        successModal?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Auto-close after 10 seconds
        setTimeout(() => {
            this.closeSuccessModal();
        }, 10000);
    }

    closeSuccessModal() {
        const successModal = document.getElementById('successModal');
        const overlay = document.getElementById('overlay');
        
        successModal?.classList.remove('active');
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

    calculateTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * this.taxRate;
        return subtotal + this.shippingCost + tax;
    }

    showNotification(message, type = 'info') {
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
}); 