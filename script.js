let data = {};
let total = 0;

fetch('data.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    calculatePrice();
  });

const toiletSelect = document.getElementById('toiletSelect');
const sinkSelect = document.getElementById('sinkSelect');
const bathtubSelect = document.getElementById('bathtubSelect');
const wallSelect = document.getElementById('wallSelect');
const floorSelect = document.getElementById('floorSelect');
const priceDisplay = document.getElementById('price');

toiletSelect.addEventListener('change', calculatePrice);
sinkSelect.addEventListener('change', calculatePrice);
bathtubSelect.addEventListener('change', calculatePrice);
wallSelect.addEventListener('change', updateWall);
floorSelect.addEventListener('change', updateFloor);

function calculatePrice() {
  total = 0;
  total += data[toiletSelect.value].price + data[toiletSelect.value].labour;
  total += data[sinkSelect.value].price + data[sinkSelect.value].labour;
  total += data[bathtubSelect.value].price + data[bathtubSelect.value].labour;
  total += data[floorSelect.value].price + data[floorSelect.value].labour;
  total += data[wallSelect.value].price + data[wallSelect.value].labour;
  priceDisplay.textContent = total;
}

function updateWall() {
  document.querySelector('.wall').style.backgroundImage = `url('../images/${wallSelect.value}.png')`;
  calculatePrice();
}

function updateFloor() {
  document.querySelector('.floor').style.backgroundImage = `url('../images/${floorSelect.value}.png')`;
  calculatePrice();
}
