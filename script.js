let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;

const promoCodes = {
    "ECHOCODE10": 10,
    "PROMO20": 20,
    "JS50": 50
};

// =====================
// DODAWANIE DO KOSZYKA
// =====================
function addToCart(id) {
    const productElement = document.querySelector(`.product[data-id='${id}']`);

    const name = productElement.dataset.name;
    const price = parseFloat(productElement.dataset.price);

    cart.push({ id, name, price });
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert("Produkt dodany do koszyka!");
}

// =====================
// LICZNIK KOSZYKA
// =====================
function updateCartCount() {
    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.innerText = cart.length;
    }
}

updateCartCount();

// =====================
// RENDER KOSZYKA
// =====================
function renderPayPal(amount){
    const container = document.getElementById("paypal-button-container");

    if(amount <= 0){
        container.innerHTML = "";
        return;
    }

    container.innerHTML = "";

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
        },

        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: amount.toFixed(2) }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {

                const orderNumber = "EC-" + Date.now();

                localStorage.setItem("lastOrderNumber", orderNumber);

                alert(
                    "Dziękujemy za zakup, " +
                    details.payer.name.given_name +
                    "!\n\nNumer zamówienia: " +
                    orderNumber
                );

                clearCart();
            });
        }

    }).render('#paypal-button-container');
}

// =====================
// USUWANIE
// =====================
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// =====================
// KODY PROMOCYJNE
// =====================
function applyPromoCode() {
    const code = document.getElementById("promo-code").value.trim().toUpperCase();
    const message = document.getElementById("promo-message");

    if (promoCodes[code]) {
        discount = promoCodes[code];
        message.style.color = "green";
        message.innerText = `Kod aktywny! Rabat ${discount}%`;
    } else {
        discount = 0;
        message.style.color = "red";
        message.innerText = "Nieprawidłowy kod promocyjny";
    }

    renderCart();
}

