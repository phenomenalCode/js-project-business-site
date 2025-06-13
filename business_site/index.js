let confirmedOrder = null;
let confirmedBookingTime = null;

document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Stop default submit

      if (!confirmedOrder) {
        alert("Du måste först bekräfta din matbeställning innan du bokar bord.");
        return;
      }
      if (!confirmedBookingTime) {
        alert("Du måste välja en bokningstid innan du skickar beställningen.");
        return;
      }

      submitFullOrderAndBooking(); // Now submit with all data
    });
  }

  // Smooth scroll to contact section
  const bokaBtn = document.getElementById("bokabord");
  if (bokaBtn) {
    bokaBtn.addEventListener("click", () => {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Menu item handlers
  const menuItems = [
    { id: "steak", name: "Steak", price: 150 },
    { id: "pasta-arrabiata", name: "Pasta Arrabiata", price: 120 },
    { id: "hamburgare", name: "Hamburgare", price: 130 },
    { id: "schnitzel", name: "Schnitzel", price: 140 },
    { id: "lax", name: "Lax", price: 160 },
    { id: "lammkotlett", name: "Lammkotlett", price: 170 },
  ];

  menuItems.forEach(({ id, name, price }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => orderAdd(name, price));
    }
  });

  // Remove this, since you no longer have a #select-time button:
  /*
  const selectTimeBtn = document.getElementById("select-time");
  if (selectTimeBtn) {
    selectTimeBtn.addEventListener("click", () => {
      const time = prompt("Välj en av dom här tiderna: 15, 17, 19, 21, 23:");
      getTime(time);
    });
  }
  */

  // Booking time radio buttons — set confirmedBookingTime when changed
  const timeRadios = document.querySelectorAll('input[name="booking_time"]');
  timeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      confirmedBookingTime = e.target.value;
      alert("Bokningstid vald: " + confirmedBookingTime + ":00");

      if (confirmedOrder) {
        alert("Din beställning är bekräftad. Du kan nu skicka bokningen.");
      } else {
        alert("Du måste först bekräfta din matbeställning innan du bokar bord.");
      }
    });
  });

  const confirmBtn = document.getElementById("bekräfta");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", addToCart);
  }
});

let shoppingCart = [];
let priceList = [];
let descriptions = [];

function orderAdd(itemName, itemPrice) {
  shoppingCart.push(itemName);
  priceList.push(itemPrice);
  descriptions.push(""); // Placeholder
  addToOrderList(itemName);
}

function addToOrderList(itemName) {
  const orderList = document.getElementById("order-list");
  if (orderList) {
    const li = document.createElement("li");
    li.textContent = itemName;
    orderList.appendChild(li);
  }
}

function getTime(tid) {
  // You may remove this function if you don't use prompt anymore
  const allowed = ["15", "17", "19", "21", "23"];
  if (allowed.includes(tid)) {
    const confirmed = confirm("Du har valt tid: " + tid);
    if (confirmed) {
      alert("Tid vald: " + tid);
      confirmedBookingTime = tid;

      if (confirmedOrder) {
        submitFullOrderAndBooking();
      } else {
        alert("Du måste först bekräfta din matbeställning innan du bokar bord.");
      }
    } else {
      alert("Välj en giltig tid.");
    }
  } else {
    alert("Vänligen välj en av de angivna tiderna.");
  }
}
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('active');
});


function addToCart() {
  const cartSummary = {};
  let grandTotal = 0;

  for (let i = 0; i < shoppingCart.length; i++) {
    const name = shoppingCart[i];
    const price = parseFloat(priceList[i]);
    const desc = descriptions[i];

    if (cartSummary[name]) {
      cartSummary[name].quantity++;
      cartSummary[name].total += price;
    } else {
      cartSummary[name] = {
        name,
        description: desc,
        price,
        quantity: 1,
        total: price,
      };
    }

    grandTotal += price;
  }

  // Remove existing modal if any
  const existingModal = document.querySelector(".custom-modal");
  if (existingModal) existingModal.remove();

  // Create modal
  const modal = document.createElement("div");
  modal.className = "custom-modal";
  modal.innerHTML = `
    <h2>Order Confirmation</h2>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${Object.values(cartSummary).map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.price} kr</td>
            <td>${item.quantity}</td>
            <td>${item.total} kr</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p><strong>Grand Total:</strong> ${grandTotal} kr</p>
    <button id="confirm-order-btn">Confirm Order</button>
    <button id="cancel-order-btn">Cancel</button>
  `;

  Object.assign(modal.style, {
    position: "fixed",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    padding: "20px",
    border: "2px solid black",
    zIndex: 1000,
    maxWidth: "90%",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)"
  });

  document.body.appendChild(modal);

  // Confirm button - saves confirmed order, clears current UI and closes modal
  modal.querySelector("#confirm-order-btn").addEventListener("click", () => {
    confirmedOrder = {
      items: cartSummary,
      grandTotal: grandTotal,
    };
    alert("Order confirmed! Please select a booking time to finalize.");
    shoppingCart = [];
    priceList = [];
    descriptions = [];
    const orderList = document.getElementById("order-list");
    if (orderList) orderList.innerHTML = "";
    modal.remove();
  });

  // Cancel button - clears current order and closes modal
  modal.querySelector("#cancel-order-btn").addEventListener("click", () => {
    shoppingCart = [];
    priceList = [];
    descriptions = [];
    const orderList = document.getElementById("order-list");
    if (orderList) orderList.innerHTML = "";
    modal.remove();
  });
}

function submitFullOrderAndBooking() {
  const orderForm = document.getElementById("order-form");

  // Remove previous dynamic inputs if any
  const oldInputs = orderForm.querySelectorAll(".dynamic-input");
  oldInputs.forEach(input => input.remove());

  // Add booking time input
  const timeInput = document.createElement("input");
  timeInput.type = "hidden";
  timeInput.name = "booking_time";
  timeInput.value = confirmedBookingTime;
  timeInput.classList.add("dynamic-input");
  orderForm.appendChild(timeInput);

  // Add order items inputs
  Object.values(confirmedOrder.items).forEach((item, idx) => {
    const nameInput = document.createElement("input");
    nameInput.type = "hidden";
    nameInput.name = `cart_item_${idx}_name`;
    nameInput.value = item.name;
    nameInput.classList.add("dynamic-input");
    orderForm.appendChild(nameInput);

    const quantityInput = document.createElement("input");
    quantityInput.type = "hidden";
    quantityInput.name = `cart_item_${idx}_quantity`;
    quantityInput.value = item.quantity;
    quantityInput.classList.add("dynamic-input");
    orderForm.appendChild(quantityInput);

    const priceInput = document.createElement("input");
    priceInput.type = "hidden";
    priceInput.name = `cart_item_${idx}_price`;
    priceInput.value = item.price;
    priceInput.classList.add("dynamic-input");
    orderForm.appendChild(priceInput);
  });

  // Add grand total input
  const totalInput = document.createElement("input");
  totalInput.type = "hidden";
  totalInput.name = "cart_grand_total";
  totalInput.value = confirmedOrder.grandTotal;
  totalInput.classList.add("dynamic-input");
  orderForm.appendChild(totalInput);

  // Submit the form
  orderForm.submit();

}

