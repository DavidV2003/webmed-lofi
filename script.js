const doctors = [
  {
    name: "Dr. Carlos Méndez",
    specialty: "Cardiología",
    city: "Kitchener",
    availability: "Disponible hoy",
    rating: "4.8",
    modality: "Presencial / Virtual"
  },
  {
    name: "Dra. Laura Gómez",
    specialty: "Pediatría",
    city: "Toronto",
    availability: "Disponible mañana",
    rating: "4.9",
    modality: "Presencial"
  },
  {
    name: "Dr. Andrés Rojas",
    specialty: "Medicina general",
    city: "Waterloo",
    availability: "Disponible esta semana",
    rating: "4.7",
    modality: "Virtual"
  },
  {
    name: "Dra. Natalia Torres",
    specialty: "Dermatología",
    city: "Kitchener",
    availability: "Disponible el viernes",
    rating: "4.6",
    modality: "Presencial / Virtual"
  }
];

const medicines = [
  {
    id: 1,
    name: "Acetaminofén 500mg",
    category: "Dolor",
    price: 8.99,
    availability: "Disponible",
    detail: "Analgésico de uso general"
  },
  {
    id: 2,
    name: "Ibuprofeno 400mg",
    category: "Dolor",
    price: 10.5,
    availability: "Disponible",
    detail: "Antiinflamatorio y analgésico"
  },
  {
    id: 3,
    name: "Loratadina 10mg",
    category: "Alergia",
    price: 12.25,
    availability: "Disponible",
    detail: "Antialérgico de uso diario"
  },
  {
    id: 4,
    name: "Antiácido masticable",
    category: "Digestivo",
    price: 7.75,
    availability: "Pocas unidades",
    detail: "Alivio para acidez estomacal"
  },
  {
    id: 5,
    name: "Multivitamínico diario",
    category: "Vitaminas",
    price: 15.99,
    availability: "Disponible",
    detail: "Suplemento general de vitaminas"
  }
];

let cart = [];
let lastAppointment = "";

document.addEventListener("DOMContentLoaded", () => {
  renderDoctors(doctors);
  renderMedicines(medicines);
  renderCart();
});

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");

  if (screenId === "cart") {
    renderCart();
  }
}

function fillDemo() {
  document.getElementById("email").value = "david@webmed.com";
  document.getElementById("password").value = "123456";
  document.getElementById("loginMessage").textContent = "";
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  if (!email || !password) {
    message.textContent = "Debe ingresar correo y contraseña.";
    return;
  }

  document.getElementById("mainNav").classList.remove("hidden");
  message.textContent = "";
  showScreen("home");
}

function logout() {
  document.getElementById("mainNav").classList.add("hidden");
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  cart = [];
  lastAppointment = "";
  renderCart();
  showScreen("login");
}

function filterDoctors() {
  const search = document.getElementById("doctorSearch").value.toLowerCase().trim();
  const city = document.getElementById("doctorCity").value;

  const filtered = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search) ||
      doctor.specialty.toLowerCase().includes(search) ||
      doctor.city.toLowerCase().includes(search) ||
      doctor.modality.toLowerCase().includes(search);

    const matchesCity = !city || doctor.city === city;

    return matchesSearch && matchesCity;
  });

  renderDoctors(filtered);
}

function renderDoctors(list) {
  const container = document.getElementById("doctorResults");

  if (!list.length) {
    container.innerHTML = `<div class="empty-state">No se encontraron doctores con esos filtros.</div>`;
    return;
  }

  container.innerHTML = list.map(doctor => `
    <div class="result-item">
      <div>
        <h2>${doctor.name}</h2>
        <p>${doctor.specialty}</p>
        <p>${doctor.city} - ${doctor.availability}</p>
        <p>Modalidad: ${doctor.modality} · Calificación: ${doctor.rating}</p>
      </div>
      <button class="primary" onclick="bookDoctor('${doctor.name}')">Agendar</button>
    </div>
  `).join("");
}

function bookDoctor(name) {
  lastAppointment = `Cita solicitada correctamente con ${name}.`;
  const container = document.getElementById("doctorResults");
  const notice = document.createElement("div");

  notice.className = "notification-item";
  notice.textContent = lastAppointment;
  container.prepend(notice);
}

function filterMedicines() {
  const search = document.getElementById("medicineSearch").value.toLowerCase().trim();
  const category = document.getElementById("medicineCategory").value;

  const filtered = medicines.filter(medicine => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(search) ||
      medicine.category.toLowerCase().includes(search) ||
      medicine.detail.toLowerCase().includes(search);

    const matchesCategory = !category || medicine.category === category;

    return matchesSearch && matchesCategory;
  });

  renderMedicines(filtered);
}

function renderMedicines(list) {
  const container = document.getElementById("medicineResults");

  if (!list.length) {
    container.innerHTML = `<div class="empty-state">No se encontraron medicamentos con esos filtros.</div>`;
    return;
  }

  container.innerHTML = list.map(medicine => `
    <div class="result-item">
      <div>
        <h2>${medicine.name}</h2>
        <p>${medicine.detail}</p>
        <p>Categoría: ${medicine.category}</p>
        <p>${medicine.availability} - $${medicine.price.toFixed(2)}</p>
      </div>
      <button class="primary" onclick="addToCart(${medicine.id})">Agregar</button>
    </div>
  `).join("");
}

function addToCart(id) {
  const medicine = medicines.find(item => item.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...medicine, quantity: 1 });
  }

  renderCart();
}

function renderCart() {
  renderMiniCart();
  renderCartItems();
  updateTotals();
}

function renderMiniCart() {
  const container = document.getElementById("miniCart");

  if (!container) {
    return;
  }

  if (!cart.length) {
    container.innerHTML = `<div class="empty-state">No hay productos agregados.</div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="mini-cart-item">
      <strong>${item.name}</strong>
      <p>Cantidad: ${item.quantity}</p>
      <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
    </div>
  `).join("");
}

function renderCartItems() {
  const container = document.getElementById("cartItems");

  if (!container) {
    return;
  }

  if (!cart.length) {
    container.innerHTML = `<div class="empty-state">El carrito está vacío.</div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h2>${item.name}</h2>
        <p>${item.detail}</p>
        <p>Categoría: ${item.category}</p>
        <p>Precio unitario: $${item.price.toFixed(2)}</p>
        <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <strong>${item.quantity}</strong>
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button onclick="removeFromCart(${item.id})">Quitar</button>
      </div>
    </div>
  `).join("");
}

function increaseQuantity(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity++;
  }

  renderCart();
}

function decreaseQuantity(id) {
  const item = cart.find(product => product.id === id);

  if (!item) {
    return;
  }

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(product => product.id !== id);
  renderCart();
}

function updateTotals() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatted = `$${total.toFixed(2)}`;

  const miniCartTotal = document.getElementById("miniCartTotal");
  const cartTotal = document.getElementById("cartTotal");

  if (miniCartTotal) {
    miniCartTotal.textContent = formatted;
  }

  if (cartTotal) {
    cartTotal.textContent = formatted;
  }
}

function confirmOrder() {
  const method = document.getElementById("paymentMethod").value;
  const address = document.getElementById("deliveryAddress").value.trim();
  const message = document.getElementById("paymentMessage");

  if (!cart.length) {
    message.textContent = "Debe agregar al menos un medicamento al carrito.";
    return;
  }

  if (!method || !address) {
    message.textContent = "Debe seleccionar método de pago e ingresar dirección.";
    return;
  }

  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("orderNumber").textContent = `WEB-${randomNumber}`;
  message.textContent = "";
  showScreen("confirmation");
}

function resetOrder() {
  cart = [];
  renderCart();
  document.getElementById("paymentMethod").value = "";
  document.getElementById("deliveryAddress").value = "";
  showScreen("home");
}