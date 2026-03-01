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
function renderPayPalButton(total) {
    const container = document.getElementById("paypal-button-container");
    if (!container || typeof paypal === "undefined") return;

    container.innerHTML = "";

    paypal.Buttons({

        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {

                // 🔥 Generowanie numeru zamówienia
                const orderNumber = "EC-" + Date.now();

                // 🔥 Popup z numerem
                alert(
                    "Dziękujemy za zakup, " +
                    details.payer.name.given_name +
                    "!\n\nNumer zamówienia: " +
                    orderNumber
                );

                // 🔥 zapis numeru lokalnie
                localStorage.setItem("lastOrderNumber", orderNumber);

                // 🔥 czyszczenie koszyka
                cart = [];
                localStorage.removeItem("cart");
                discount = 0;

                renderCart();
                updateCartCount();
            });
        }

    }).render("#paypal-button-container");
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

// =====================
// PAYPAL
// =====================
function renderPayPalButton(total) {
    const container = document.getElementById("paypal-button-container");
    if (!container || typeof paypal === "undefined") return;

    container.innerHTML = "";

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },




