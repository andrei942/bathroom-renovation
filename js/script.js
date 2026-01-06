let data = {};
let total = 0;

// Load prices
fetch('data.json')
  .then(res => res.json())
  .then(json => data = json);

const roomUpload = document.getElementById('roomUpload');
const roomImage = document.getElementById('roomImage');
const toiletCheckbox = document.getElementById('toiletSelect');
const sinkCheckbox = document.getElementById('sinkSelect');
const bathtubCheckbox = document.getElementById('bathtubSelect');
const priceDisplay = document.getElementById('price');
const downloadBtn = document.getElementById('downloadPDF');

// Show uploaded image
roomUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    roomImage.src = URL.createObjectURL(file);
  }
});

// Calculate total
function calculatePrice(){
  total = 0;
  if(toiletCheckbox.checked) total += data.toilet.price + data.toilet.labour;
  if(sinkCheckbox.checked) total += data.sink.price + data.sink.labour;
  if(bathtubCheckbox.checked) total += data.bathtub.price + data.bathtub.labour;
  priceDisplay.textContent = total;
}

[toiletCheckbox, sinkCheckbox, bathtubCheckbox].forEach(cb => cb.addEventListener('change', calculatePrice));

// Function to convert image to data URL
function getImageDataURL(img) {
  return new Promise((resolve) => {
    if(!img.src) return resolve(null);
    const image = new Image();
    image.src = img.src;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image,0,0);
      const dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };
  });
}

// Download PDF
downloadBtn.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Bathroom Renovation Estimate", 10, 10);
  let y = 20;

  if(toiletCheckbox.checked) { doc.text("Toilet: Yes (£160)", 10, y); y+=10; }
  if(sinkCheckbox.checked) { doc.text("Sink: Yes (£105)", 10, y); y+=10; }
  if(bathtubCheckbox.checked) { doc.text("Bathtub: Yes (£310)", 10, y); y+=10; }

  doc.text(`Total: £${total}`, 10, y+10);

  // Add image safely
  const imgData = await getImageDataURL(roomImage);
  if(imgData){
    const ratio = roomImage.naturalWidth / roomImage.naturalHeight;
    const width = 180;
    const height = width / ratio;
    doc.addImage(imgData, 'JPEG', 10, y+20, width, height);
  }

  doc.save("Estimate.pdf");
});
