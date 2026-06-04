fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    // Load Featured Products
    const featuredProductsGrid = document.getElementById("featured_products");
    const hotDealsSlider = document.getElementById("hot_deals_slider");
    const newArrivalsGrid = document.getElementById("new_arrivals_grid");

    if (featuredProductsGrid) {
      const featured = data.filter((product) => product.featured);
      featured.forEach((product) => {
        const productCard = createProductCard(product);
        featuredProductsGrid.appendChild(productCard);
      });
    }

    // Load Hot Deals (products with old_price)
    if (hotDealsSlider) {
      const hotDeals = data.filter((product) => product.old_price);
      hotDeals.forEach((product) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = createProductCardHTML(product);
        hotDealsSlider.appendChild(slide);
      });
    }

    // Load New Arrivals (first products or with a new flag)
    if (newArrivalsGrid) {
      const newArrivals = data.slice(0, 8);
      newArrivals.forEach((product) => {
        const productCard = createProductCard(product);
        newArrivalsGrid.appendChild(productCard);
      });
    }
  });

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const discount = product.old_price
    ? Math.floor(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : 0;

  const stars = generateStars(product.rating);

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.img}" alt="${product.name}">
      ${discount ? `<div class="product-badge">-${discount}%</div>` : ""}
    </div>
    
    <div class="product-details">
      <div class="product-category">${getCategoryName(product.category)}</div>
      <h3 class="product-name">${product.name}</h3>
      
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="rating-count">(${product.reviews})</span>
      </div>

      <div class="product-price">
        <span class="price-current">${product.price} ج.م</span>
        ${product.old_price ? `<span class="price-original">${product.old_price} ج.م</span>` : ""}
      </div>

      <div class="product-actions">
        <button class="add-to-cart-btn" onclick="addToCart({id: ${product.id}, name: '${product.name}', price: ${product.price}, img: '${product.img}', author: '${product.author}'})">
          <i class="fas fa-cart-plus"></i> أضف للسلة
        </button>
        <button class="wishlist-btn" onclick="addToWishlist(${product.id})">
          <i class="far fa-heart"></i>
        </button>
      </div>
    </div>
  `;

  return card;
}

function createProductCardHTML(product) {
  const discount = product.old_price
    ? Math.floor(
        ((product.old_price - product.price) / product.old_price) * 100,
      )
    : 0;

  const stars = generateStars(product.rating);

  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.img}" alt="${product.name}">
        ${discount ? `<div class="product-badge">-${discount}%</div>` : ""}
      </div>
      
      <div class="product-details">
        <div class="product-category">${getCategoryName(product.category)}</div>
        <h3 class="product-name">${product.name}</h3>
        
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>

        <div class="product-price">
          <span class="price-current">${product.price} ج.م</span>
          ${product.old_price ? `<span class="price-original">${product.old_price} ج.م</span>` : ""}
        </div>

        <div class="product-actions">
          <button class="add-to-cart-btn" onclick="addToCart({id: ${product.id}, name: '${product.name}', price: ${product.price}, img: '${product.img}'})">
            <i class="fas fa-cart-plus"></i> أضف للسلة
          </button>
          <button class="wishlist-btn" onclick="addToWishlist(${product.id})">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '<i class="fas fa-star"></i>'.repeat(fullStars);

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  stars += '<i class="far fa-star"></i>'.repeat(emptyStars);

  return stars;
}

function getCategoryName(category) {
  const categoryNames = {
    external: "كتب خارجية",
    notes: "ملازم",
    novels: "روايات",
    tools: "أدوات مدرسية",
    printing: "طباعة",
    ebooks: "كتب رقمية",
  };
  return categoryNames[category] || category;
}
