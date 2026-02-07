// Simple Cart Logic

// Cart array
let cart = [];
// Favorites array
let favorites = [];

// Product Database (Simulation)
const productsDatabase = [
  { id: 1, name: 'Product 1', price: '₺199.00', oldPrice: '₺249.00', category: 'accessories', image: 'images/product-1.jpg', description: 'This stylish and modern watch is perfect for everyday use.', rating: 4.8, reviews: 124, stock: 5 },
  { id: 2, name: 'Product 2', price: '₺249.00', category: 'women', image: 'images/product-2.jpg', description: 'This model brings together classic design and modern details.', rating: 4.5, reviews: 89, stock: 12 },
  { id: 3, name: 'Product 3', price: '₺299.00', oldPrice: '₺399.00', category: 'men', image: 'images/product-3.jpg', description: 'For those with a sporty and dynamic lifestyle.', rating: 4.9, reviews: 215, stock: 2 },
  { id: 4, name: 'Product 4', price: '₺159.00', category: 'women', image: 'images/product-a.jpg', description: 'Simple and elegant for those who love minimalist design.', rating: 4.2, reviews: 56, stock: 20 },
  { id: 'A', name: 'Product A', price: '₺119.00', category: 'children', image: 'images/product-c.jpg', description: 'This model stands out with its colorful and energetic design.', rating: 4.7, reviews: 42, stock: 8 },
  { id: 'B', name: 'Product B', price: '₺149.00', category: 'men', image: 'images/product-b.jpg', description: 'This watch brings together technology and style.', rating: 4.4, reviews: 78, stock: 15 },
  { id: 'C', name: 'Product C', price: '₺179.00', category: 'accessories', image: 'images/product-a.jpg', description: 'A model that reinterprets vintage style with a modern touch.', rating: 4.6, reviews: 93, stock: 4 },
  { id: 'D', name: 'Product D', price: '₺139.00', category: 'women', image: 'images/product-2.jpg', description: 'An elegant accessory that will complete your daily style.', rating: 4.3, reviews: 67, stock: 10 },
  { id: 'E', name: 'Product E', price: '₺209.00', category: 'children', image: 'images/product-3.jpg', description: 'This stunning model features a luxurious and glamorous design.', rating: 4.8, reviews: 112, stock: 3 },
  { id: 'F', name: 'Product F', price: '₺189.00', category: 'accessories', image: 'images/product-f.jpg', description: 'Specially designed for nature enthusiasts.', rating: 4.9, reviews: 156, stock: 7 },
  { id: 'G', name: 'Product G', price: '₺229.00', category: 'men', image: 'images/product-g.jpg', description: 'A dynamic design that keeps up with the pace of modern city life.', rating: 4.5, reviews: 84, stock: 18 },
  { id: 'H', name: 'Product H', price: '₺259.00', category: 'women', image: 'images/product-h.jpg', description: 'The perfect harmony of simplicity and elegance.', rating: 4.7, reviews: 132, stock: 6 },
];

// DOM Elementleri
const cartBtn = document.getElementById('cart-btn');
const toastContainer = document.getElementById('toast-container');
const productDetailContainer = document.getElementById('product-detail-container');
// Cart Page Elements
const cartPageItems = document.getElementById('cart-page-items');
const cartPageTotal = document.getElementById('cart-page-total');
const cartSubtotal = document.getElementById('cart-subtotal');
// Checkout Page Elements
const checkoutForm = document.getElementById('checkout-form');
const checkoutItemsSummary = document.getElementById('checkout-items-summary');
const checkoutTotal = document.getElementById('checkout-total');
const successModalOverlay = document.getElementById('success-modal-overlay');
const orderNumberDisplay = document.getElementById('order-number');
// Mobile Menu Elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
// Search Element
const searchInput = document.getElementById('search-input');

// Hamburger Menu Toggle
function toggleMobileMenu() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');

  // Prevent scroll
  if (mobileMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}




// Update Cart Icon
function updateCartUI() {
  const count = cart.length;
  if (cartBtn) {
    cartBtn.innerText = `My Cart (${count})`;

    // Simple animation effect
    cartBtn.style.color = 'var(--primary-color)';
    setTimeout(() => {
      cartBtn.style.color = ''; // Return to original color
    }, 300);
  }
}

// Show Toast Notification
function showToast(message, type = 'success') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✓' : 'ℹ';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Frame delay for animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 3000);
}

// Favorite Operations
function toggleFavorite(productId) {
  const product = productsDatabase.find(p => p.id == productId);
  if (!product) return;

  const index = favorites.findIndex(item => item.id == product.id);

  if (index > -1) {
    // Remove if already exists
    favorites.splice(index, 1);
    showToast(`${product.name} removed from favorites`, 'info');
  } else {
    // Add if not exists
    favorites.push(product);
    showToast(`${product.name} added to favorites!`, 'success');
  }

  // Update LocalStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesUI();

  // If on wishlist page, re-render
  if (window.location.pathname.includes('wishlist.html')) {
    renderWishlistPage();
  }
}

function updateFavoritesUI() {
  const favoriteIcons = document.querySelectorAll('.favorite-btn');
  favoriteIcons.forEach(btn => {
    const productId = btn.getAttribute('data-id');
    const isFavorite = favorites.some(item => item.id == productId);

    if (isFavorite) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update favorite count in header
  const favoriteBadge = document.getElementById('favorite-count');
  if (favoriteBadge) {
    favoriteBadge.innerText = favorites.length;
    favoriteBadge.style.display = favorites.length > 0 ? 'flex' : 'none';
  }
}

// Render Star Rating
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 != 0;
  let starsHTML = '<div class="stars">';

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<span class="star full">★</span>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<span class="star half">★</span>';
    } else {
      starsHTML += '<span class="star empty">★</span>';
    }
  }

  starsHTML += ` <span class="rating-value">${rating}</span></div>`;
  return starsHTML;
}

// Render Stock Info
function renderStockInfo(stock) {
  if (stock <= 0) return '<div class="stock-status out-of-stock">Out of Stock</div>';
  if (stock <= 5) return `<div class="stock-status low-stock">Only ${stock} left!</div>`;
  return `<div class="stock-status in-stock">In stock (${stock})</div>`;
}

// Render Wishlist Page
function renderWishlistPage() {
  const wishlistGrid = document.getElementById('wishlist-grid');
  if (!wishlistGrid) return;

  wishlistGrid.innerHTML = '';

  if (favorites.length === 0) {
    wishlistGrid.innerHTML = '<div class="empty-state"><p>You don\'t have any favorite products yet.</p><a href="index.html" class="btn btn-primary">Start Shopping</a></div>';
    return;
  }

  favorites.forEach(product => {
    wishlistGrid.innerHTML += `
      <div class="product-card">
        <button class="favorite-btn active" data-id="${product.id}" onclick="toggleFavorite('${product.id}')">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
        <a href="product-detail.html?id=${product.id}">

          <img src="${product.image}" alt="${product.name}">
        </a>
        <h3>${product.name}</h3>
        ${renderStars(product.rating || 0)}
        <p class="price">${product.price}</p>
        <button class="btn btn-secondary" onclick="addToCart({id: '${product.id}', name: '${product.name}', price: '${product.price}', image: '${product.image}'})">Add to Cart</button>
      </div>
    `;
  });
}


// Add to Cart Function
function addToCart(product) {
  // Check if same product is already in cart
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    // Increase quantity if exists
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // Add new if not exists
    const cartItem = {
      ...product,
      cartId: Date.now(), // Unique ID
      quantity: 1
    };
    cart.push(cartItem);
  }

  updateCartUI();
  showToast(`${product.name} added to cart!`);

  // Re-render if on cart page
  if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
  }

  console.log('Current Cart:', cart);

  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Increase Quantity from Cart
function increaseQuantity(cartId) {
  const item = cart.find(item => item.cartId === cartId);
  if (item) {
    item.quantity = (item.quantity || 1) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    renderCartPage();
  }
}

// Decrease Quantity from Cart
function decreaseQuantity(cartId) {
  const item = cart.find(item => item.cartId === cartId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
      renderCartPage();
    } else {
      // Remove entirely if quantity is 1
      removeFromCart(cartId);
    }
  }
}

// Render Cart Page
function renderCartPage() {
  if (!cartPageItems) return;

  cartPageItems.innerHTML = '';

  if (cart.length === 0) {
    cartPageItems.innerHTML = '<p>Your cart is currently empty. <a href="index.html">Start Shopping</a></p>';
    if (cartPageTotal) cartPageTotal.innerText = '₺0.00';
    if (cartSubtotal) cartSubtotal.innerText = '₺0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    // Fiyatı parse et: "₺199,00" -> 199.00
    let priceValue = 0;
    if (item.price) {
      priceValue = parseFloat(item.price.replace('₺', '').replace(',', '.').trim());
    }

    const quantity = item.quantity || 1;
    const itemTotal = priceValue * quantity;
    total += itemTotal;

    // Ürün görselini bul
    let imageSrc = item.image;
    if (!imageSrc) {
      imageSrc = 'https://via.placeholder.com/70';
      const dbItem = productsDatabase.find(p => p.name === item.name);
      if (dbItem) imageSrc = dbItem.image;
    }

    const cartItemHTML = `
            <div class="cart-page-item">
                <div style="display:flex; align-items:center; gap: 1rem;">
                    <img src="${imageSrc}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price}</p>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="decreaseQuantity(${item.cartId})" title="Decrease">−</button>
                            <span class="quantity">${quantity}</span>
                            <button class="qty-btn" onclick="increaseQuantity(${item.cartId})" title="Increase">+</button>
                        </div>
                        <p class="item-total">Total: ₺${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
                <div class="remove-btn" onclick="removeFromCart(${item.cartId})" title="Remove from Cart">
                   &times;
                </div>
            </div>
        `;
    cartPageItems.innerHTML += cartItemHTML;
  });

  const formattedTotal = `₺${total.toFixed(2)}`;
  if (cartPageTotal) cartPageTotal.innerText = formattedTotal;
  if (cartSubtotal) cartSubtotal.innerText = formattedTotal;
}

// Remove from Cart
window.removeFromCart = function (cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  renderCartPage();
  showToast('Product removed from cart', 'info');
}

// Render Checkout Summary
function renderCheckoutSummary() {
  if (!checkoutItemsSummary) return;

  checkoutItemsSummary.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    let priceValue = 0;
    if (item.price) {
      priceValue = parseFloat(item.price.replace('₺', '').replace(',', '.').trim());
    }
    total += priceValue;

    const summaryItemHTML = `
            <div class="summary-row" style="font-size: 0.9rem; border-bottom: 1px dashed #eee; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
                <span style="flex:1;">${item.name}</span>
                <span class="price" style="font-weight:600;">${item.price}</span>
            </div>
        `;
    checkoutItemsSummary.innerHTML += summaryItemHTML;
  });

  if (checkoutTotal) {
    checkoutTotal.innerText = `₺${total.toFixed(2)}`;
  }
}

// Place Order (PayTR Placeholder - Backend integration required)
async function placeOrder(e) {
  e.preventDefault();

  // Form validation
  const form = e.target;
  if (!form.checkValidity()) {
    return;
  }

  // Check if cart is empty
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'info');
    return;
  }

  // GERÇEK ENTEGRASYON İÇİN:
  // 1. Backend'e (PHP/Node.js) POST isteği at
  // 2. PayTR token al
  // 3. PayTR iframe'i göster

  // PLACEHOLDER FOR NOW (For Demo Purposes):
  showToast('Backend required for PayTR integration. Continuing in demo mode...', 'info');

  // Wait 2 seconds for demo
  setTimeout(() => {
    // Generate order number
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    if (orderNumberDisplay) orderNumberDisplay.innerText = '#' + orderNum;

    // Show Success Modal
    if (successModalOverlay) successModalOverlay.classList.add('show');

    // Clear Cart
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
  }, 2000);

  /* GERÇEK PAYTR ENTEGRASYONU ÖRNEK KOD:
    
    try {
        // Form verilerini topla
        const formData = new FormData(form);
        formData.append('user_basket', JSON.stringify(cart.map(item => ({
            name: item.name,
            price: parseFloat(item.price.replace('₺', '').replace(',', '.')),
            quantity: 1
        }))));
        
        // Toplam tutarı hesapla (kuruş cinsinden)
        let total = 0;
        cart.forEach(item => {
            total += parseFloat(item.price.replace('₺', '').replace(',', '.'));
        });
        formData.append('payment_amount', Math.round(total * 100));
        
        // Backend'e token isteği
        const response = await fetch('/api/create-payment.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Formu gizle
            document.getElementById('checkout-form').style.display = 'none';
            
            // PayTR iframe container'ı göster
            const iframeContainer = document.getElementById('paytr-iframe-container');
            iframeContainer.style.display = 'block';
            
            // iframe oluştur ve ekle
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.paytr.com/odeme/guvenli/${result.token}`;
            iframe.width = '100%';
            iframe.height = '600px';
            iframe.frameBorder = '0';
            iframe.scrolling = 'no';
            
            document.getElementById('paytr-iframe').innerHTML = '';
            document.getElementById('paytr-iframe').appendChild(iframe);
            
            // Pencereyi yukarı kaydır
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('Ödeme başlatılamadı: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('PayTR Error:', error);
        showToast('Bağlantı hatası oluştu', 'error');
    }
    */
}


// Search Results Page Rendering
function renderSearchResultsPage() {
  const searchGrid = document.getElementById('search-grid');
  const searchTitle = document.getElementById('search-title');
  if (!searchGrid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');

  if (query) {
    const lowerQuery = query.toLowerCase().trim();
    searchTitle.innerText = `Results for "${query}"`;

    const filteredProducts = productsDatabase.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );

    if (filteredProducts.length > 0) {
      searchGrid.innerHTML = filteredProducts.map(p => `
        <div class="product-card">
          <button class="favorite-btn" data-id="${p.id}" onclick="toggleFavorite('${p.id}')">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <a href="product-detail.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}">
          </a>
          <h3>${p.name}</h3>
          ${renderStars(p.rating || 0)}
          <p class="price">${p.price}</p>
          <button class="btn btn-secondary" onclick="addToCart({id: '${p.id}', name: '${p.name}', price: '${p.price}', image: '${p.image}'})">Add to Cart</button>
        </div>
      `).join('');
    } else {
      searchGrid.innerHTML = '<p>No products found matching your criteria.</p>';
    }
  } else {
    searchTitle.innerText = "Search";
    searchGrid.innerHTML = '<p>Please type a keyword in the search box.</p>';
  }
}


// Code to Run on Page Load
document.addEventListener('DOMContentLoaded', () => {
  // Load cart from localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }

  // Load favorites from localStorage
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
    updateFavoritesUI();
  }

  // Hamburger Menu Event Listeners
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when mobile menu links are clicked
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu();
    });
  });

  // Search Input Event Listener
  if (searchInput) {
    // Search with Enter key
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
      }
    });

    // Search with magnifying glass icon
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
      searchIcon.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
      });
    }
  }



  // Page-based rendering
  renderCartPage();
  renderWishlistPage();
  renderSearchResultsPage();

  // Render if on checkout page
  renderCheckoutSummary();
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', placeOrder);
  }

  // If on details page
  if (productDetailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const product = productsDatabase.find(p => p.id == productId);

    if (product) {
      productDetailContainer.innerHTML = `
        <div class="product-detail-image" style="position: relative;">
          <button class="favorite-btn" data-id="${product.id}" onclick="toggleFavorite('${product.id}')" style="top: 20px; left: 20px;">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-detail-info">
          <h1>${product.name}</h1>
          <div class="description">
            <p>${product.description}</p>
          </div>
          <div class="detail-actions">
            <p class="price">${product.price}</p>
            <button id="detail-add-to-cart" class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      `;

      // Add event listener to button on details page
      document.getElementById('detail-add-to-cart').addEventListener('click', () => {
        addToCart(product);
      });

      document.title = `${product.name} - Modern E-Commerce`;

      // Load Similar Products
      const similarProductsGrid = document.getElementById('similar-products-grid');
      if (similarProductsGrid) {
        // Find other products in the same category
        let similarProducts = productsDatabase.filter(p => p.category === product.category && p.id !== product.id);

        // If not enough products in same category, pick random ones
        if (similarProducts.length < 4) {
          const otherProducts = productsDatabase.filter(p => p.id !== product.id);
          similarProducts = [...similarProducts, ...otherProducts].slice(0, 4);
        } else {
          // Pick 4 random products from category
          similarProducts = similarProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
        }

        similarProductsGrid.innerHTML = similarProducts.map(p => `
          <div class="product-card">
            <button class="favorite-btn" data-id="${p.id}" onclick="toggleFavorite('${p.id}')">
              <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
            <a href="product-detail.html?id=${p.id}">

              <img src="${p.image}" alt="${p.name}">
            </a>
            <h3>${p.name}</h3>
            ${renderStars(p.rating || 0)}
            <p class="price">${p.price}</p>
            <button class="btn btn-secondary" onclick="addToCart({id: '${p.id}', name: '${p.name}', price: '${p.price}', image: '${p.image}'})">Add to Cart</button>
          </div>
        `).join('');
      }

      updateFavoritesUI();

    } else {
      productDetailContainer.innerHTML = '<p>Product not found.</p>';
    }
  }

  // For add buttons on home page
  const addToCartButtons = document.querySelectorAll('.product-card .btn-secondary');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.product-card');
      const name = card.querySelector('h3').innerText;
      const price = card.querySelector('.price').innerText;

      let image = 'https://via.placeholder.com/70';
      const imgTag = card.querySelector('img');
      if (imgTag) image = imgTag.src;

      const product = { name, price, image };
      addToCart(product);
    });
  });

  // Slider Logic (Only run if slider exists)
  const slides = document.querySelectorAll('.hero-slider img');
  if (slides.length > 0) {
    let currentSlide = 0;

    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    if (slides.length > 1) {
      setInterval(nextSlide, 3000);
    }
  }

  // Chatbot Logic
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendChat = document.getElementById('send-chat');
  const chatMessages = document.getElementById('chat-messages');

  if (chatbotToggle && chatWindow && closeChat) {
    chatbotToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });

    const addMessage = (text, sender) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = sender === 'bot' ? 'bot-message' : 'user-message';
      msgDiv.innerText = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChat = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';

      // Simulated Bot Response
      setTimeout(() => {
        let response = "I'm sorry, I didn't quite catch that. Could you please rephrase?";
        const lowerText = text.toLowerCase();

        if (lowerText.includes('hello') || lowerText.includes('hi')) {
          response = "Hello! How can I assist you today?";
        } else if (lowerText.includes('shipping') || lowerText.includes('delivery')) {
          response = "We offer free shipping on orders over ₺500. Standard delivery takes 2-4 business days.";
        } else if (lowerText.includes('return') || lowerText.includes('refund')) {
          response = "You can return any product within 30 days of purchase. Please visit our Returns page for more info.";
        } else if (lowerText.includes('price') || lowerText.includes('cost')) {
          response = "Our prices are very competitive! You can check the latest deals on our homepage.";
        } else if (lowerText.includes('contact') || lowerText.includes('help')) {
          response = "You can reach us at support@markam.com or call us at 0850 123 45 67.";
        } else if (lowerText.includes('order')) {
          response = "You can track your order in the 'My Orders' section of your profile.";
        }

        addMessage(response, 'bot');
      }, 1000);
    };

    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChat();
    });
  }
});

console.log('E-commerce script loaded.');
