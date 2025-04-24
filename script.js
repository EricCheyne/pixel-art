const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const gridSizeInput = document.getElementById("gridSize");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const addColorBtn = document.getElementById("addColorBtn");
const palette = document.getElementById("palette");
const exportPngBtn = document.getElementById("exportPngBtn");

let gridData = [];
let isPainting = false;

function createGrid(size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridData = Array(size * size).fill("#ffffff");

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.style.backgroundColor = "#ffffff";
    cell.dataset.index = i;

    cell.addEventListener("mousedown", paintCell);
    cell.addEventListener("mouseover", (e) => {
      if (isPainting) paintCell.call(e.target);
    });

    grid.appendChild(cell);
  }

  loadDrawing();
}

function paintCell() {
  const color = colorPicker.value;
  const index = this.dataset.index;
  this.style.backgroundColor = color;
  gridData[index] = color;
  saveDrawing();
}

function saveDrawing() {
  const data = {
    size: gridSizeInput.value,
    colors: gridData
  };
  localStorage.setItem("pixelArt", JSON.stringify(data));
}

function loadDrawing() {
  const saved = JSON.parse(localStorage.getItem("pixelArt"));
  if (!saved) return;

  if (saved.size == gridSizeInput.value) {
    const cells = document.querySelectorAll(".grid-cell");
    saved.colors.forEach((color, i) => {
      cells[i].style.backgroundColor = color;
      gridData[i] = color;
    });
  }
}

function clearGrid() {
  createGrid(gridSizeInput.value);
  localStorage.removeItem("pixelArt");
}

function exportJSON() {
  const dataStr = JSON.stringify({
    size: gridSizeInput.value,
    colors: gridData
  });
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pixel-art.json";
  a.click();
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);
    gridSizeInput.value = data.size;
    gridData = data.colors;
    createGrid(data.size);
    setTimeout(() => loadDrawing(), 50);
  };
  reader.readAsText(file);
}

function addColorToPalette() {
  const color = colorPicker.value;
  const colorBox = document.createElement("button");
  colorBox.className = "palette-color";
  colorBox.style.backgroundColor = color;
  colorBox.addEventListener("click", () => {
    colorPicker.value = color;
  });
  palette.appendChild(colorBox);
}

function exportAsPNG() {
  html2canvas(grid).then(canvas => {
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Events
gridSizeInput.addEventListener("change", () => createGrid(gridSizeInput.value));
clearBtn.addEventListener("click", clearGrid);
exportBtn.addEventListener("click", exportJSON);
importFile.addEventListener("change", () => importJSON(importFile.files[0]));
addColorBtn.addEventListener("click", addColorToPalette);
exportPngBtn.addEventListener("click", exportAsPNG);

// Mouse paint tracking
document.body.addEventListener("mousedown", () => isPainting = true);
document.body.addEventListener("mouseup", () => isPainting = false);

// Initialize
createGrid(gridSizeInput.value);
