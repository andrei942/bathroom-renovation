let data = {};
let total = 0;

// Load UK prices
fetch('data.json')
  .then(res => res.json())
  .then(json => data = json);

// Elements
const roomUpload = document.getElementById('roomUpload');
const roomImage = document.getElementById('roomImage');

const toiletCheckbox = document.getElementById('toiletSelect');
const sinkCheckbox = document.getElementById('sinkSelect');
const bathtubCheckbox = document.getElementById('bathtubSelect');
const tilesCheckbox = document.getElementById('tilesSelect');
const wallCheckbox = document.getElementById('wallSelect');

const priceDisplay = document.getElementById('price');
const downloadBtn = document.getElementById('downloadPDF');

// Show uploaded photo
roomUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    roomImage.src = url;
  }
});

// Calculate total price
function calculatePrice() {
  total = 0;
  if (toiletCheckbox.checked) total += data.toilet.price + data.toilet.labour;
  if (sinkCheckbox.checked) total += data.sink.price + data.sink.labour;
  if (bathtubCheckbox.checked) total += data.bathtub.price + data.bathtub.labour;
  if (tilesCheckbox.checked) total += data.tiles.price + data.tiles.labour;
  if (wallCheckbox.checked) total += data.wall.price + data.wall.labour;
  priceDisplay.textContent = total.toFixed(2);
}

// Event listeners for checkboxes
[toiletCheckbox, sinkCheckbox, bathtubCheckbox, tilesCheckbox, wallCheckbox].forEach(cb => {
  cb.addEventListener('change', calculatePrice);
});

// Download PDF
downloadBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Bathroom Renovation Estimate", 10, 10);

  let y = 20;
  if (toiletCheckbox.checked) { doc.text("Toilet: Yes (£160)", 10, y); y += 10; }
  if (sinkCheckbox.checked) { doc.text("Sink: Yes (£105)", 10, y); y += 10; }
  if (bathtubCheckbox.checked) { doc.text("Bathtub: Yes (£310)", 10, y); y += 10; }
  if (tilesCheckbox.checked) { doc.text("Floor Tiles: Yes (£20/m²)", 10, y); y += 10; }
  if (wallCheckbox.checked) { doc.text("Walls: Yes (£8/m²)", 10, y); y += 10; }

  doc.text(`Total Estimate: £${total.toFixed(2)}`, 10, y + 10);

  // Add uploaded image
  if (roomImage.src) {
    const img = new Image();
    img.src = roomImage.src;
    img.onload = () => {
      const ratio = img.width / img.height;
      const width = 180;
      const height = width / ratio;
      doc.addImage(img, 'JPEG', 10, y + 20, width, height);
      doc.save("Estimate.pdf");
    };
  } else {
    doc.save("Estimate.pdf");
  }
});
