/**
 * Butterfly Shop CR - Landing clone
 * Smooth anchors, carousel, cart sidebar, header scroll
 */

const CATALOG_PRODUCTS = {
  tenis: [
    { id: 1, brand: 'adidas', name: 'SAMBA CLASSIC', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 22000, oldPrice: 26500, discount: 17, sizes: [36, 37, 38, 39, 40], moreSizes: 4 },
    { id: 2, brand: 'nike', name: 'AIR FORCE 1', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', price: 29500, oldPrice: 35000, discount: 16, isNew: true, sizes: [36, 37, 38, 39, 40], moreSizes: 2 },
    { id: 3, brand: 'puma', name: 'SUEDE CLASSIC', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop', price: 24500, sizes: [36, 37, 38, 39, 40] },
    { id: 4, brand: 'puma', name: 'RS-X REINVENTION', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', price: 32000, sizes: [36, 37, 38, 39, 40], moreSizes: 4 },
    { id: 5, brand: 'adidas', name: 'GAZELLE PINK', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', price: 23500, oldPrice: 26500, discount: 11, sizes: [36, 37, 38, 39, 40] },
    { id: 6, brand: 'nike', name: 'DUNK LOW GREEN', img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop', price: 31000, oldPrice: 38000, discount: 18, sizes: [36, 37, 38, 39, 40] },
  ],
  ropa: [
    { id: 7, brand: 'nike', name: 'HOODIE URBAN', img: 'https://images.unsplash.com/photo-1556821840-2a963f657446?w=400&h=400&fit=crop', price: 18000, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 8, brand: 'adidas', name: 'JOGGER ESSENTIAL', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop', price: 19500, discount: 10, sizes: ['S', 'M', 'L', 'XL'], moreSizes: 1 },
    { id: 9, brand: 'puma', name: 'CAMISETA STREET', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', price: 12000, isNew: true, sizes: ['S', 'M', 'L'] },
    { id: 10, brand: 'nike', name: 'PANTS CARGO', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop', price: 22000, oldPrice: 26000, discount: 15, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 11, brand: 'adidas', name: 'SWEAT ZIP', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', price: 28000, sizes: ['M', 'L', 'XL'] },
    { id: 12, brand: 'puma', name: 'SHORT RUN', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', price: 9500, sizes: ['S', 'M', 'L'] },
  ],
};

const cartState = [];
let cartUI = null;

document.addEventListener('DOMContentLoaded', () => {
  initSmoothAnchors();
  initHeaderScroll();
  initCarousel();
  initCart();
  initNavActiveState();
  initScrollReveal();
  initMobileMenu();
  initCatalogListing();
});

/** Smooth scroll for anchor links */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/** Header background on scroll */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/** Carousel previous/next */
function initCarousel() {
  const slide = document.querySelector('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!slide || !prevBtn || !nextBtn) return;

  const cardWidth = 280 + 24;
  const scrollAmount = cardWidth;
  let autoScrollId = null;

  function scrollToNext(auto = false) {
    const maxScrollLeft = slide.scrollWidth - slide.clientWidth;
    const nextScrollLeft = slide.scrollLeft + scrollAmount;

    if (auto && nextScrollLeft >= maxScrollLeft - 4) {
      slide.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    slide.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  function restartAutoScroll() {
    if (autoScrollId) {
      window.clearInterval(autoScrollId);
    }

    autoScrollId = window.setInterval(() => {
      scrollToNext(true);
    }, 3000);
  }

  prevBtn.addEventListener('click', () => {
    slide.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    restartAutoScroll();
  });

  nextBtn.addEventListener('click', () => {
    scrollToNext();
    restartAutoScroll();
  });

  restartAutoScroll();
}

function initCart() {
  cartUI = {
    body: document.body,
    button: document.querySelector('.cart-btn'),
    count: document.getElementById('cartCount'),
    overlay: document.getElementById('cartOverlay'),
    sidebar: document.getElementById('cartSidebar'),
    close: document.getElementById('cartSidebarClose'),
    items: document.getElementById('cartItems'),
    empty: document.getElementById('cartEmptyState'),
    footer: document.getElementById('cartSidebarFooter'),
    subtotal: document.getElementById('cartSubtotal'),
  };

  if (!cartUI.button || !cartUI.sidebar || !cartUI.overlay) return;

  cartUI.button.addEventListener('click', () => {
    if (cartUI.body.classList.contains('cart-open')) {
      closeCart();
    } else {
      openCart();
    }
  });

  cartUI.close?.addEventListener('click', closeCart);
  cartUI.overlay.addEventListener('click', closeCart);
  cartUI.items?.addEventListener('click', handleCartActions);

  document.addEventListener('click', handleAddToCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCart();
    }
  });

  renderCart();
}

function handleAddToCart(event) {
  const button = event.target.closest('.btn-add, .listing-card-add');
  if (!button) return;

  const product = getProductFromButton(button);
  if (!product) return;

  addProductToCart(product);
  flashAddButton(button);
  openCart();
}

function handleCartActions(event) {
  const actionButton = event.target.closest('[data-cart-action]');
  if (!actionButton) return;

  const { cartAction, cartId } = actionButton.dataset;
  if (!cartId) return;

  if (cartAction === 'decrease') {
    updateCartQuantity(cartId, -1);
  }

  if (cartAction === 'increase') {
    updateCartQuantity(cartId, 1);
  }

  if (cartAction === 'remove') {
    removeFromCart(cartId);
  }
}

function getProductFromButton(button) {
  if (button.classList.contains('listing-card-add')) {
    return getProductFromListingCard(button.closest('.listing-card'));
  }

  return getProductFromPromoCard(button.closest('.product-card'));
}

function getProductFromPromoCard(card) {
  if (!card) return null;

  return normalizeProduct({
    brand: card.querySelector('.product-brand')?.textContent?.trim() || 'Producto',
    name: card.querySelector('h3')?.textContent?.trim() || 'Producto',
    price: parsePrice(card.querySelector('.price-current')?.textContent),
    image: card.querySelector('img')?.getAttribute('src') || '',
  });
}

function getProductFromListingCard(card) {
  if (!card) return null;

  return normalizeProduct({
    brand: card.querySelector('.listing-card-brand')?.textContent?.trim() || 'Producto',
    name: card.querySelector('.listing-card-name')?.textContent?.trim() || 'Producto',
    price: parsePrice(card.querySelector('.listing-price-current')?.textContent),
    image: card.querySelector('img')?.getAttribute('src') || '',
  });
}

function normalizeProduct(product) {
  const brand = product.brand || 'Producto';
  const name = product.name || 'Producto';

  return {
    id: `${slugify(brand)}-${slugify(name)}`,
    brand,
    name,
    price: Number(product.price) || 0,
    image: product.image || '',
  };
}

function addProductToCart(product) {
  const existingItem = cartState.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartState.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function updateCartQuantity(cartId, delta) {
  const item = cartState.find((entry) => entry.id === cartId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(cartId);
    return;
  }

  renderCart();
}

function removeFromCart(cartId) {
  const itemIndex = cartState.findIndex((entry) => entry.id === cartId);
  if (itemIndex === -1) return;

  cartState.splice(itemIndex, 1);
  renderCart();
}

function renderCart() {
  if (!cartUI) return;

  const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartState.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasItems = cartState.length > 0;

  if (cartUI.count) {
    cartUI.count.textContent = totalItems;
  }

  cartUI.button?.classList.toggle('cart-has-items', totalItems > 0);

  if (cartUI.items) {
    cartUI.items.innerHTML = cartState
      .map(
        (item) => `
        <article class="cart-item">
          <img class="cart-item-image" src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <span class="cart-item-brand">${item.brand}</span>
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
            <div class="cart-item-controls">
              <button class="cart-qty-btn" type="button" data-cart-action="decrease" data-cart-id="${item.id}" aria-label="Restar cantidad">−</button>
              <span class="cart-qty-value">${item.quantity}</span>
              <button class="cart-qty-btn" type="button" data-cart-action="increase" data-cart-id="${item.id}" aria-label="Sumar cantidad">+</button>
            </div>
          </div>
          <button class="cart-remove-btn" type="button" data-cart-action="remove" data-cart-id="${item.id}" aria-label="Eliminar producto">×</button>
        </article>
      `
      )
      .join('');
  }

  if (cartUI.empty) {
    cartUI.empty.hidden = hasItems;
  }

  if (cartUI.footer) {
    cartUI.footer.hidden = !hasItems;
  }

  if (cartUI.subtotal) {
    cartUI.subtotal.textContent = formatPrice(subtotal);
  }
}

function openCart() {
  if (!cartUI) return;
  cartUI.body.classList.add('cart-open');
  cartUI.sidebar?.setAttribute('aria-hidden', 'false');
  cartUI.overlay?.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  if (!cartUI) return;
  cartUI.body.classList.remove('cart-open');
  cartUI.sidebar?.setAttribute('aria-hidden', 'true');
  cartUI.overlay?.setAttribute('aria-hidden', 'true');
}

function flashAddButton(button) {
  button.classList.add('added');

  const label = button.querySelector('.btn-add-label');
  if (label) {
    label.textContent = 'Agregado';
  }

  window.setTimeout(() => {
    button.classList.remove('added');
    if (label) {
      label.textContent = 'Agregar';
    }
  }, 900);
}

function formatPrice(value) {
  return '₡' + Number(value || 0).toLocaleString('es-CR');
}

function parsePrice(value) {
  return Number(String(value || '').replace(/[^\d]/g, '')) || 0;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Active nav link based on scroll position */
function initNavActiveState() {
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActive = () => {
    const scrollY = window.scrollY;
    let current = '';

    document.querySelectorAll('section[id]').forEach((section) => {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const id = href ? href.slice(1) : '';
      link.classList.toggle('active', id === current);
    });
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/** Scroll reveal animations */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.product-card, .benefit-card, .section-title, .section-desc').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/** Catalog listing: TENIS/ROPA cards -> product grid with filters */
function initCatalogListing() {
  const catalogSection = document.getElementById('catalogo');
  const catalogCards = document.getElementById('catalogCards');
  const catalogListing = document.getElementById('catalogListing');
  const btnVolver = document.getElementById('btnVolver');
  const listingGrid = document.getElementById('listingGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentCategory = null;

  function showListing(category) {
    currentCategory = category;
    catalogCards.hidden = true;
    catalogListing.hidden = false;
    catalogSection.classList.add('listing-mode');
    renderProducts(category, 'todos');
    filterBtns.forEach((button) => button.classList.toggle('active', button.dataset.filter === 'todos'));
  }

  function showCards() {
    currentCategory = null;
    catalogCards.hidden = false;
    catalogListing.hidden = true;
    catalogSection.classList.remove('listing-mode');
  }

  function renderProducts(category, brandFilter) {
    let products = CATALOG_PRODUCTS[category] || [];

    if (brandFilter !== 'todos') {
      products = products.filter((product) => product.brand === brandFilter);
    }

    listingGrid.innerHTML = products
      .map(
        (product) => `
        <article class="listing-card" data-product-id="${product.id}">
          <div class="listing-card-image">
            <img src="${product.img}" alt="${product.name}">
            <div class="listing-card-badges">
              ${product.isNew ? '<span class="listing-badge new">NUEVO</span>' : ''}
              ${product.discount ? `<span class="listing-badge discount">-${product.discount}%</span>` : ''}
            </div>
            <button class="listing-card-fav" aria-label="Agregar a favoritos">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <div class="listing-card-actions">
              <button class="listing-card-add" data-product="${product.name}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Agregar
              </button>
              <button class="listing-card-view" aria-label="Vista rápida">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="listing-card-body">
            <span class="listing-card-brand">${product.brand.toUpperCase()}</span>
            <h3 class="listing-card-name">${product.name}</h3>
            <div class="listing-card-sizes">
              ${(product.sizes || []).slice(0, 5).map((size) => `<span class="size-pill">${size}</span>`).join('')}
              ${product.moreSizes ? `<span class="size-pill more">+${product.moreSizes}</span>` : ''}
            </div>
            <div class="listing-card-price">
              <span class="listing-price-current">${formatPrice(product.price)}</span>
              ${product.oldPrice ? `<span class="listing-price-old">${formatPrice(product.oldPrice)}</span>` : ''}
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }

  document.querySelectorAll('.catalog-card[data-category]').forEach((card) => {
    card.addEventListener('click', () => showListing(card.dataset.category));
  });

  btnVolver?.addEventListener('click', showCards);

  filterBtns.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterBtns.forEach((item) => item.classList.toggle('active', item.dataset.filter === filter));
      if (currentCategory) {
        renderProducts(currentCategory, filter);
      }
    });
  });
}

/** Mobile menu toggle */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-label', nav.classList.contains('open') ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}
