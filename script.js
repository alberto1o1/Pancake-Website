document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("order-form");

    if (!form) {
        return;
    }

    const orderSize = document.getElementById("order-size");
    const total = document.getElementById("total");
    const pickupDate = document.getElementById("pickup-date");
    const message = document.getElementById("form-message");
    const confirmation = document.getElementById("confirmation");

    // Prevent customers from choosing a date in the past.
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    pickupDate.min = `${year}-${month}-${day}`;

    function updateTotal() {
        const selectedOption = orderSize.options[orderSize.selectedIndex];
        const price = selectedOption.dataset.price || "0";
        total.textContent = `$${Number(price).toFixed(2)}`;
    }

    orderSize.addEventListener("change", updateTotal);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        message.innerHTML = "";
        confirmation.classList.add("hidden");

        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const size = orderSize.value;
        const flavor = document.getElementById("flavor").value;
        const date = pickupDate.value;
        const time = document.getElementById("pickup-time").value;

        const errors = [];

        if (name === "") {
            errors.push("Please enter your name.");
        }

        if (phone === "") {
            errors.push("Please enter your phone number.");
        }

        if (email !== "" && !email.includes("@")) {
            errors.push("Please enter a valid email address.");
        }

        if (size === "") {
            errors.push("Please select an order size.");
        }

        if (flavor === "") {
            errors.push("Please select a pancake flavor.");
        }

        if (date === "") {
            errors.push("Please select a pickup date.");
        }

        if (time === "") {
            errors.push("Please select a pickup time.");
        }

        if (errors.length > 0) {
            message.innerHTML = `
                <div class="error-message">
                    <strong>Please correct the following:</strong>
                    <ul>
                        ${errors.map(error => `<li>${error}</li>`).join("")}
                    </ul>
                </div>
            `;
            return;
        }

        const toppings = [];
        document.querySelectorAll('input[name="toppings"]:checked')
            .forEach(function (checkbox) {
                toppings.push(checkbox.value);
            });

        const selectedOption = orderSize.options[orderSize.selectedIndex];
        const price = Number(selectedOption.dataset.price);

        const orderNumber = Math.floor(Math.random() * 9000) + 1000;

        confirmation.innerHTML = `
            <h2>Order Submitted!</h2>
            <p>Thank you, <strong>${escapeHtml(name)}</strong>!</p>
            <p>Your order number is <strong>#${orderNumber}</strong>.</p>
            <p><strong>Order:</strong> ${escapeHtml(size)} - ${escapeHtml(flavor)}</p>
            <p><strong>Toppings:</strong> ${
                toppings.length > 0 ? toppings.map(escapeHtml).join(", ") : "None"
            }</p>
            <p><strong>Pickup:</strong> ${escapeHtml(date)} at ${escapeHtml(time)}</p>
            <p><strong>Estimated Total:</strong> $${price.toFixed(2)}</p>
            <p class="small-note">
                This course-project version does not process online payments.
            </p>
        `;

        confirmation.classList.remove("hidden");
        form.reset();
        updateTotal();

        confirmation.scrollIntoView({ behavior: "smooth" });
    });

    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value;
        return div.innerHTML;
    }
});
