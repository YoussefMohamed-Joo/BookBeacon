// ===== CART MANAGEMENT =====
const cart = document.querySelector(".cart");
const countItemHeader = document.querySelector(".count_item_header");
const countCartTotal = document.querySelector(".Count_item_cart");
const priceCartTotal = document.querySelector(".price_cart_toral");
const itemsInCart = document.getElementById("cart_items");

function open_close_cart() {
  cart.classList.toggle("active");
}

function displayCart() {
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  itemsInCart.innerHTML = "";

  if (cartData.length === 0) {
    itemsInCart.innerHTML =
      '<p style="text-align: center; padding: 2rem; color: #a0a8b5;">السلة فارغة</p>';
    updateCartBadge(0, 0);
    return;
  }

  let totalPrice = 0;

  cartData.forEach((item) => {
    totalPrice += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${item.price} ج.م</p>
        <p>الكمية: ${item.quantity}</p>
      </div>
      <button class="close_cart" onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;">×</button>
    `;
    itemsInCart.appendChild(cartItem);
  });

  updateCartBadge(cartData.length, totalPrice);
}

function addToCart(product) {
  let cartData = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cartData.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cartData.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cartData));
  displayCart();
  showNotification(`تم إضافة "${product.name}" إلى السلة`);
}

function removeFromCart(productId) {
  let cartData = JSON.parse(localStorage.getItem("cart")) || [];
  cartData = cartData.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cartData));
  displayCart();
}

function updateCartBadge(itemCount, totalPrice) {
  countItemHeader.textContent = itemCount;
  countCartTotal.textContent = itemCount;
  priceCartTotal.textContent = `${totalPrice} ج.م`;
}

// ===== MENU TOGGLE =====
function toggleMenu() {
  const navLinks = document.querySelector(".nav_links");
  navLinks.classList.toggle("active");
}

// ===== WISHLIST MANAGEMENT =====
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const countFavourite = document.querySelector(".count_favourite");

function toggleWishlist() {
  alert("قائمة المفضلة");
}

function addToWishlist(productId) {
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    countFavourite.textContent = wishlist.length;
    showNotification("تم إضافة المنتج إلى المفضلة");
  }
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter((id) => id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  countFavourite.textContent = wishlist.length;
}

function updateWishlistBadge() {
  countFavourite.textContent = wishlist.length;
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #00d4ff, #33e5ff);
    color: #0f1419;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById("newsletter_form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("شكراً للاشتراك! تحقق من بريدك الإلكتروني");
    newsletterForm.reset();
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const navLinks = document.querySelector(".nav_links");
      navLinks.classList.remove("active");
    }
  });
});

// ===== ACTIVE NAV LINK =====
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav_links a");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// ===== INITIALIZE =====
document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  updateWishlistBadge();

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

window.open_close_cart = open_close_cart;
window.toggleMenu = toggleMenu;
window.toggleWishlist = toggleWishlist;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
