const WHATSAPP_NUMBER = "5586998525470";
const CART_KEY = "vittaCakesCart";

let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-button");

    if (!container || !totalElement) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML =
            '<p class="empty-cart">Seu carrinho está vazio. 💗</p>';

        totalElement.textContent = formatPrice(0);

        if (checkoutButton) checkoutButton.disabled = true;
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const name = item.name || item.nome || "Produto";
        const price = Number(item.price ?? item.preco ?? 0);
        const quantity = Number(
            item.quantity ?? item.quantidade ?? 1
        );

        const subtotal = price * quantity;
        total += subtotal;

        const product = document.createElement("div");
        product.className = "cart-item";

        const description = document.createElement("span");
        description.textContent =
            `${name} — ${quantity}x ${formatPrice(price)}`;

        const subtotalElement = document.createElement("span");
        subtotalElement.textContent = formatPrice(subtotal);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", () => {
            removeFromCart(index);
        });

        product.append(description, subtotalElement, removeButton);
        container.appendChild(product);
    });

    totalElement.textContent = formatPrice(total);

    if (checkoutButton) checkoutButton.disabled = false;
}

function addToCart(name, price) {
    const productName = String(name);
    const productPrice = Number(price);

    if (!productName || !Number.isFinite(productPrice) ||
        productPrice < 0) {
        return;
    }

    const existing = cart.find(item =>
        (item.name || item.nome) === productName &&
        Number(item.price ?? item.preco) === productPrice
    );

    if (existing) {
        existing.quantity = Number(
            existing.quantity ?? existing.quantidade ?? 1
        ) + 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;

    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const paymentElement = document.getElementById("payment-method");
    const payment = paymentElement ? paymentElement.value : "";

    if (!payment) {
        alert("Escolha uma forma de pagamento.");
        return;
    }

    let total = 0;

    let message = "Olá! 💗 Quero fazer um pedido na Vita Cakes!\n\n";
    message += "Meu pedido:\n";

    cart.forEach(item => {
        const name = item.name || item.nome || "Produto";
        const price = Number(item.price ?? item.preco ?? 0);
        const quantity = Number(
            item.quantity ?? item.quantidade ?? 1
        );
        const subtotal = price * quantity;

        total += subtotal;

        message += `${name} — ${quantity}x — ${formatPrice(subtotal)}\n`;
    });

    message += `\nTotal: ${formatPrice(total)}`;
    message += `\nPagamento: ${payment}`;
    message += "\n\nAguardo a confirmação. 🍰";

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", renderCart);