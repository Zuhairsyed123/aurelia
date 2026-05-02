// script.js - AURELIA Frontend Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Global UI & Animations ---

    // Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Intersection Observer for Fade-In Animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- 2. State Management ---
    const API_BASE = 'http://localhost:8000';
    let cart = JSON.parse(localStorage.getItem('aurelia_cart')) || [];
    let products = [];

    // --- 3. Products Loading ---
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        fetchProducts();
    }

    async function fetchProducts() {
        try {
            const res = await fetch(`${API_BASE}/products`);
            if (!res.ok) throw new Error('Failed to fetch products');
            products = await res.json();
            renderProducts();
        } catch (error) {
            console.error(error);
            productsContainer.innerHTML = '<p>Unable to load the collection at this time.</p>';
        }
    }

    function renderProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        products.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in';
            // Stagger animation delay slightly
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="product-image">
                    <img src="${p.imageURL}" alt="${p.name}">
                    <button class="add-to-cart-btn" data-id="${p.id}">Add to Selection</button>
                </div>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">$${p.price.toFixed(2)}</div>
            `;
            productsContainer.appendChild(card);
            // Observe new element
            fadeObserver.observe(card);
        });

        // Attach event listeners to new buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);
            });
        });
    }

    // --- 4. Cart Management ---
    const cartToggle = document.getElementById('cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    function updateCartUI() {
        // Always save cart to local storage first
        localStorage.setItem('aurelia_cart', JSON.stringify(cart));

        // Update cart count if the element exists
        if (cartCountSpan) {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = count;
        }

        // Render drawer items if container exists
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:2rem;">Your selection is empty.</p>';
            } else {
                cart.forEach(item => {
                    total += item.price * item.quantity;
                    const el = document.createElement('div');
                    el.className = 'cart-item';
                    el.innerHTML = `
                        <img src="${item.imageURL}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-actions">
                                <button class="qty-btn minus" data-id="${item.id}">-</button>
                                <span class="qty">${item.quantity}</span>
                                <button class="qty-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(el);
                });
            }
            if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;

            // Attach +/- events
            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    if (e.target.classList.contains('plus')) updateQuantity(id, 1);
                    if (e.target.classList.contains('minus')) updateQuantity(id, -1);
                });
            });
        }
    }

    function addToCart(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        openCart();
    }

    function updateQuantity(id, change) {
        const index = cart.findIndex(item => item.id === id);
        if (index > -1) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    function openCart() {
        if(cartDrawer && cartOverlay) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('show');
        }
    }

    function closeCart() {
        if(cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('show');
        }
    }

    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    // Initial cart render
    updateCartUI();

    // --- 5. AI Concierge Chat ---
    const chatFab = document.getElementById('chat-fab');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');

    if (chatFab && chatWindow) {
        chatFab.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatInput.focus();
            }
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });

        async function sendChatMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            // Add user message
            appendMessage('user', text);
            chatInput.value = '';

            try {
                const res = await fetch(`${API_BASE}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await res.json();
                appendMessage('bot', data.response);
            } catch (error) {
                console.error(error);
                appendMessage('bot', 'My apologies, I am currently unable to process your request.');
            }
        }

        chatSendBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });

        function appendMessage(sender, text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // --- 6. Checkout Logic ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        // Render order summary
        const summaryContainer = document.getElementById('checkout-summary');
        let total = 0;
        
        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.justifyContent = 'space-between';
                div.style.marginBottom = '1rem';
                div.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>$${(item.price * item.quantity).toFixed(2)}</span>`;
                summaryContainer.appendChild(div);
            });
            const totalDiv = document.createElement('div');
            totalDiv.style.borderTop = '1px solid #ddd';
            totalDiv.style.marginTop = '1rem';
            totalDiv.style.paddingTop = '1rem';
            totalDiv.style.display = 'flex';
            totalDiv.style.justifyContent = 'space-between';
            totalDiv.style.fontWeight = 'bold';
            totalDiv.innerHTML = `<span>Total</span> <span>$${total.toFixed(2)}</span>`;
            summaryContainer.appendChild(totalDiv);
        }

        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }

            const btn = document.getElementById('checkout-submit-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Processing Payment...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_BASE}/process-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cart: cart.map(i => ({id: i.id, quantity: i.quantity})),
                        totalAmount: total
                    })
                });
                const data = await res.json();
                
                if (data.status === 'success') {
                    alert(data.message);
                    cart = [];
                    updateCartUI();
                    window.location.href = 'index.html';
                }
            } catch (error) {
                alert('Payment processing failed. Please try again later.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- 7. Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                const res = await fetch(`${API_BASE}/contact-submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await res.json();
                alert(data.message);
                contactForm.reset();
            } catch (error) {
                alert('Failed to send message.');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

});
