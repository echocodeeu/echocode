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
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const li = document.createElement("li");
        li.style.marginBottom = "10px";
        li.innerHTML = `
            ${item.name} - ${item.price.toFixed(2)} PLN
            <button onclick="removeFromCart(${index})" style="margin-left:10px;">Usuń</button>
        `;
        cartItems.appendChild(li);
    });

    // 🔥 ZASTOSOWANIE RABATU
    if (discount > 0) {
        total = total - (total * discount / 100);
    }

    totalElement.innerText = total.toFixed(2);

    renderPayPalButton(total);
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

        // 🔥 zapis numeru lokalnie (opcjonalnie)
        localStorage.setItem("lastOrderNumber", orderNumber);

        // 🔥 czyszczenie koszyka
        cart = [];
        localStorage.removeItem("cart");
        discount = 0;
        renderCart();
        updateCartCount();
    });
}
// =====================
// OBSŁUGA POLA BUDŻETU (MODAL)
// =====================

const budgetInput = document.getElementById("pluginLevel");
const priceDisplay = document.getElementById("priceValue");

if (budgetInput && priceDisplay) {

    budgetInput.addEventListener("input", function () {
        let value = parseInt(this.value);

        if (isNaN(value) || value < 1) {
            value = 1;
        }

        if (value > 1000) {
            value = 1000;
        }

        this.value = value;

        priceDisplay.textContent = value.toLocaleString("pl-PL");
    });

    // Ustawienie początkowej wartości
    priceDisplay.textContent =
        parseInt(budgetInput.value).toLocaleString("pl-PL");
}

