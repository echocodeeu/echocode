const CART_KEY = 'echocode_cart_v1';

// Udostępnienie funkcji globalnie
window.addToCart = function(productId) {
    const productEl = document.querySelector(`.product[data-id="${productId}"]`);
    const name = productEl.getAttribute('data-name');
    const price = parseFloat(productEl.getAttribute('data-price'));

    let cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, quantity: 1 });
    }

    setCart(cart);
    updateCartCount();
    alert('Dodano do koszyka!');
};

window.getCart = function() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

window.setCart = function(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

window.updateCartCount = function() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = count;
};

window.renderCart = function() {
    const cart = getCart();
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    let total = 0;

    if (!list) return;

    list.innerHTML = '';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        list.innerHTML += `
            <li style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                ${item.name} (x${item.quantity}) - ${(item.price * item.quantity).toFixed(2)} PLN
                <button onclick="removeFromCart(${index})" style="background:red; padding: 2px 10px;">X</button>
            </li>
        `;
    });

    totalEl.innerText = total.toFixed(2);
    if (total > 0) initPayPal(total.toFixed(2));
};

window.removeFromCart = function(index) {
    let cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
    renderCart();
    updateCartCount();
};

function initPayPal(totalAmount) {
    document.getElementById('paypal-button-container').innerHTML = '';
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{ amount: { value: totalAmount } }]
            });
        },
        onApprove: async (data, actions) => {
            const response = await fetch('/api/paypal/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    orderID: data.orderID,
                    cart: getCart() 
                })
            });
            if (response.ok) {
                alert('Płatność zakończona sukcesem!');
                setCart([]);
                window.location.href = 'index.html';
            }
        }
    }).render('#paypal-button-container');
}

// Inicjalizacja licznika na starcie
updateCartCount();