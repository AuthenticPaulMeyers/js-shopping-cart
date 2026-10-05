const productsContainer = document.querySelector('.products');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const cart = [];

// Format price to two decimal places
const formatPrice = price => price.toFixed(2);

function renderCart() {
      // Calculate the total number of items in the cart
      // reduce method is used to iterate over the cart array and accumulate the total quantity of items
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      // Calculate the total price of items in the cart
      const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

      cartCount.textContent = itemCount;
      totalPrice.textContent = formatPrice(cartTotal);

      if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
      }

      cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                  <p>${item.name}</p>
                  <p>${item.quantity} x $${formatPrice(item.price)} = $${formatPrice(item.price * item.quantity)}</p>
                  <button class="remove-from-cart" data-product-name="${item.name}"><i class="fas fa-trash"></i></button>
            </div>
      `).join('');
}

// Remove the selected item from the cart and refresh the cart display.
function removeFromCart(productName) {
      // Find index of the item from the cart list using the product name
      const itemIndex = cart.findIndex(item => item.name === productName);

      if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            renderCart();
      }
}

// Add to cart functionality
function addToCart(product) {
      // Check if the product already exists in the cart
      const existingItem = cart.find(item => item.name === product.name);

      if (existingItem) {
            existingItem.quantity += 1;
      } else {
            // If the product doesn't exist in the cart, add it with a quantity of 1
            cart.push({ ...product, quantity: 1 });
      }

      renderCart();
}

fetch('data.json')
      .then(response => response.json())
      .then(data => {
            // Render product cards to the products container
            // map method is used to create an array of HTML strings for each product, which are then joined into a single string and set as the innerHTML of the products container
            productsContainer.innerHTML = data.map((product, index) => `
                  <div class="product-card">
                        <img src="${product.image.desktop}" alt="${product.name}" width="200">
                        <button class="add-to-cart" data-product-index="${index}">Add to cart</button>
                        <span>${product.category}</span>
                        <p>${product.name}</p>
                        <p>$${formatPrice(product.price)}</p>
                  </div>
            `).join('');

            productsContainer.addEventListener('click', event => {
                  if (event.target.classList.contains('add-to-cart')) {
                        addToCart(data[event.target.dataset.productIndex]);
                  }
            });

            // Use one listener for all remove buttons rendered in the cart.
            cartItemsContainer.addEventListener('click', event => {
                  if (event.target.classList.contains('remove-from-cart')) {
                        removeFromCart(event.target.dataset.productName);
                  }
            });
      });

renderCart();