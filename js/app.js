// variables
const productsContainer = document.querySelector('.products');
// cart variables
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');

// Initialize an empty array to hold the items in the cart
const cart = [];

// list 
// the find method is used to search for an item in the cart array that matches the name of the product being added. If a match is found, it returns the existing item; otherwise, it returns undefined. This allows us to check if the product is already in the cart and update its quantity accordingly.

// => is a short for writting arrow functions
// 
// format price to two decimal places
function formatPrice(price) {
      return price.toFixed(2);
}

// Implement cart functionality
function addToCart(product) {
      // Check if the product already exists in the cart
      const existingItem = cart.find(item => item.name === product.name); //true or false

      if (existingItem) {
            existingItem.quantity += 1;
      } else {
            // If the product doesn't exist in the cart, add it with a quantity of 1
            // ...products is the spread operator, which is used to create a shallow copy of the product object. This ensures that we don't modify the original product object when we add it to the cart. Instead, we create a new object that contains all the properties of the product, along with an additional quantity property set to 1.
            cart.push({ ...product, quantity: 1 });
            // push method appends an item at the end of the list
      }

      renderCart();
};


// total = 0;

// 10

// total + item

// price * 

// delete items from cart

// const list = ["Apple", "Banana", "Cherry"];
//             // 0,       1,          2

// let searchItem = "Banana";

// const itemIndex = list.findIndex(item => item === searchItem); // returns 1, the index of "Banana" in the list
// // loops through the collection and checks if the item actually exists in the list, if it does, it returns the index of the item, otherwise it returns -1

function removeFromCart(productName) {
      // Find the index of the product in the cart
      // return either the index of the product in the cart or -1 if it doesn't exist
      const itemIndex = cart.findIndex(item => item.name === productName);

      // ! is a logical NOT operator, which negates the value of the expression. In this case, it checks if itemIndex is not equal to -1, meaning the product was found in the cart.
      // !true = false
      // !false = true
      if (itemIndex !== -1) {
            // If the product is found, remove it from the cart
            cart.splice(itemIndex, 1);
      }

      renderCart();
}

function renderCart() {
      // Calculate the total number of items in the cart
      // reduce method is used to iterate over the cart array and accumulate the total quantity of items
      const itemCount = cart.length;
      // Calculate the total price of items in the cart
      const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

      cartCount.textContent = itemCount;
      totalPrice.textContent = formatPrice(cartTotal);

      if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
      }

      cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                 <div>
                        <img src="${item.image.desktop}" alt="${item.name}" width="50">
                        <p>${item.name}</p>
                 </div>
                  <p>${item.quantity} x $${formatPrice(item.price)} = $${formatPrice(item.price * item.quantity)}</p>
                  <button class="remove-from-cart" data-product-name="${item.name}">Remove</i></button>
            </div>
      `).join('');
}

// fetch data from the json file
fetch('data.json')
      .then(response => response.json())
      .then(data => {
            productsContainer.innerHTML = data.map((product, index) => `
                  <div class="product-card">
                        <img src="${product.image.desktop}" alt="${product.name}" width="200">
                        <button class="add-to-cart" data-product-index="${index}">Add to cart</button>
                        <span>${product.category}</span>
                        <p>${product.name}</p>
                        <p>$${formatPrice(product.price)}</p>
                  </div>
            `).join('');

            // Attach an event to the add to cart button
            productsContainer.addEventListener('click', event => {
                  if (event.target.classList.contains('add-to-cart')) {
                        addToCart(data[event.target.dataset.productIndex]);
                  }

                  renderCart();
            });

             // Use one listener for all remove buttons rendered in the cart.
            cartItemsContainer.addEventListener('click', event => {
                  if (event.target.classList.contains('remove-from-cart')) {
                        removeFromCart(event.target.dataset.productName);
                  }
            });
      });

    

// dataset.productIndex

// in JS you use dataset is used to store custom data attributes on HTML elements. In this case, the data-product-index attribute is used to store the index of the product in the data array. When the add to cart button is clicked, the event listener retrieves the value of this attribute using event.target.dataset.productIndex and uses it to access the corresponding product in the data array.



// add to cart functionality

/*
1. get vart veriables - done
2. add event listener to the button to the addd to cart button - done
3. implement the add to cart functionality - done
4. render the cart items to the cart container - in progress
5. Calculate the total price of items in the cart - done

cart = [
{
      name: 'product name',
      price: 100,
      quantity: 2
},
{
      name: 'product name 2',
      price: 100,
      quantity: 1
},
{
      name: 'product name 3',
      price: 100,
      quantity: 4
},
{
      name: 'product name 3',
      price: 100,
      quantity: 1
}
]
array of objects


number.ceil() roundsup
number.floor() rounddown

*/