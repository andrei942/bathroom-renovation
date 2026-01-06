let data = {};
let total = 0;

// Load data from data.json
fetch('data.json')
  .then(res => res.json())
  .then(json => data = json);

// DOM Elements
const roomTypeSelect = document.getElementById('roomType');
const itemsContainer = document.getElementById('itemsContainer');
const roomUpload = document.getElementById('roomUpload');
const roomImage = document.getElementById('roomImage');
const floorAreaInput = document.getElementById('floorArea');
const wallAreaInput = document.getElementById('wallArea');
const priceDisplay = document.getElementById('price');
const downloadBtn = document.getElementById('downloadPDF');

let checkboxes = {};

// Show uploaded image
roomUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    roomImage.src = URL.createObjectURL(file);
  }
});

// Populate items based on room type
function loadItems() {
  const room = roomTypeSelect.value;
  itemsContainer.innerHTML = "<h2>Select items to renovate:</h2>";
  checkboxes = {};
  for (let key in data[room]) {
    if (key === 'tiles' || key === 'wall') continue; // skip per-m2 items
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = key + "Select";
    cb.dataset.item = key;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${capitalize(key)} (£${data[room][key].price + data[room][key].labour})`));
    itemsContainer.appendChild(label);
    checkboxes[key] = cb;
    cb.addEventListener('change', calculatePrice);
  }
}

// Capitalize
function capitalize(str){ return str.charAt(0).toUpperCase() + str.slice(1); }

// Calculate total
function calculatePrice() {
  const room = roomTypeSelect.value;
  const floorArea = parseFloat(floorAreaInput.value) || 0;
  const wallArea = parseFloat(wallAreaInput.value) || 0;
  total = 0;

  // Add per-item prices
  for (let key in checkboxes) {
    if (checkboxes[key].checked) {
      total += data[room][key].price + data[room][key].labour;
    }
  }

  // Add per-square-meter prices
  total += (data[room].tiles.price_per_m2 + data[room].tiles.labour_per_m2) * floorArea;
  total += (data[room].wall.price_per_m2 + data[room].wall.labour_per_m2) * wallArea;

  priceDisplay.textContent = total.toFixed(2);
}

// Load initial items
loadItems();
roomTypeSelect.addEventListener('change', () => {
  loadItems();
  calculatePrice();
});
[floorAreaInput, wallAreaInput].forEach(el => el.addEventListener('input', calculatePrice));

// Download PDF
downloadBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Renovation Estimate", 10, 10);
  let y = 20;

  doc.text(`Room: ${capitalize(roomTypeSelect.value)}`, 10, y); y += 10;

  for (let key in checkboxes) {
    if (checkboxes[key].checked) {
      doc.text(`${capitalize(key)}: Yes (£${data[roomTypeSelect.value][key].price + data[roomTypeSelect.value][key].labour})`, 10, y);
      y += 10;
    }
  }

  doc.text(`Floor area: ${floorAreaInput.value} m²`, 10, y); y += 10;
  doc.text(`Wall area: ${wallAreaInput.value} m²`, 10, y); y += 10;
  doc.text(`Total Estimate: £${total.toFixed(2)}`, 10, y); y += 10;

  // Add uploaded image
  if (roomImage.src) {
    const img = new Image();
    img.src = roomImage.src;
    img.onload = () => {
      const ratio = img.width / img.height;
      const width = 180;
      const height = width / ratio;
      doc.addImage(img, 'JPEG', 10, y, width, height);
      doc.save("RenovationEstimate.pdf");
    }
  } else {
    doc.save("RenovationEstimate.pdf");
  }
});
