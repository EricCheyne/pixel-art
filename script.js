const grid = document.getElementById("grid");
const gridSizeInput = document.getElementById("gridSize");
const colorPicker = document.getElementById("colorPicker");
const palette = document.getElementById("palette");
const symmetryToggle = document.getElementById("symmetryToggle");
const addColorBtn = document.getElementById("addColorBtn");
const themeToggle = document.getElementById("themeToggle");

let gridData = [];
let isMouseDown = false;
let activeTool = "pencil";

function createGrid(size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 20px)`;
  gridData = new Array(size * size).fill("#ffffff");

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.index = i;
    cell.addEventListener("mousedown", () => handleCellClick(i));
    cell.addEventListener("mouseover", (e) => {
      if (isMouseDown) handleCellClick(i);
    });
    grid.appendChild(cell);
  }

  saveDrawing();
}

function paintCell(index, color) {
  const size = parseInt(gridSizeInput.value);
  gridData[index] = color;
  document.querySelector(`[data-index="${index}"]`).style.backgroundColor = color;

  if (symmetryToggle.checked) {
    const row = Math.floor(index / size);
    const col = index % size;
    const mirrorCol = size - col - 1;
    const mirrorIndex = row * size + mirrorCol;
    gridData[mirrorIndex] = color;
    document.querySelector(`[data-index="${mirrorIndex}"]`).style.backgroundColor = color;
  }
}

function handleCellClick(index) {
  const color = colorPicker.value;
  if (activeTool === "pencil") {
    paintCell(index, color);
  } else if (activeTool === "fill") {
    floodFill(index, gridData[index], color);
  }
  saveDrawing();
}

function floodFill(index, targetColor, replacementColor) {
  if (targetColor === replacementColor) return;
  const size = parseInt(gridSizeInput.value);
  const stack = [index];

  while (stack.length) {
    const i = stack.pop();
    if (gridData[i] === targetColor) {
      gridData[i] = replacementColor;
      document.querySelector(`[data-index="${i}"]`).style.backgroundColor = replacementColor;

      const neighbors = getNeighbors(i, size);
      stack.push(...neighbors.filter(n => gridData[n] === targetColor));
    }
  }
}

function getNeighbors(i, size) {
  const neighbors = [];
  const row = Math.floor(i / size);
  const col = i % size;
  if (row > 0) neighbors.push(i - size);
  if (row < size - 1) neighbors.push(i + size);
  if (col > 0) neighbors.push(i - 1);
  if (col < size - 1) neighbors.push(i + 1);
  return neighbors;
}

function saveDrawing() {
  localStorage.setItem("pixelArt", JSON.stringify({
    gridSize: gridSizeInput.value,
    data: gridData
  }));
}

function loadDrawing() {
  const saved = JSON.parse(localStorage.getItem("pixelArt"));
  if (saved) {
    gridSizeInput.value = saved.gridSize;
    createGrid(saved.gridSize);
    gridData = saved.data;
    gridData.forEach((color, i) => {
      document.querySelector(`[data-index="${i}"]`).style.backgroundColor = color;
    });
  } else {
    createGrid(gridSizeInput.value);
  }
}

document.getElementById("clearBtn").onclick = () => createGrid(gridSizeInput.value);
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(gridData)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "drawing.json";
  a.click();
};

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    gridData = JSON.parse(event.target.result);
    createGrid(gridSizeInput.value);
    gridData.forEach((color, i) => {
      document.querySelector(`[data-index="${i}"]`).style.backgroundColor = color;
    });
  };
  reader.readAsText(file);
});

document.getElementById("exportPngBtn").onclick = () => {
  html2canvas(grid).then(canvas => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "pixel-art.png";
    a.click();
  });
};

function exportCSV() {
  const size = parseInt(gridSizeInput.value);
  let csv = "";
  for (let i = 0; i < gridData.length; i++) {
    csv += gridData[i];
    csv += (i + 1) % size === 0 ? "\n" : ",";
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pixel-art.csv";
  a.click();
}

addColorBtn.onclick = () => {
  const color = colorPicker.value;
  const swatch = document.createElement("div");
  swatch.className = "palette-color";
  swatch.style.backgroundColor = color;
  swatch.onclick = () => colorPicker.value = color;
  palette.appendChild(swatch);
};

Sortable.create(palette, {
  animation: 150,
  ghostClass: 'dragging'
});

palette.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (e.target.classList.contains("palette-color")) {
    e.target.remove();
  }
});

document.getElementById("pencilTool").onclick = () => activeTool = "pencil";
document.getElementById("fillTool").onclick = () => activeTool = "fill";

document.body.onmousedown = () => (isMouseDown = true);
document.body.onmouseup = () => (isMouseDown = false);

gridSizeInput.addEventListener("change", () => createGrid(gridSizeInput.value));

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
});

// Load theme on start
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

loadDrawing();
