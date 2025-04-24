const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const gridSizeInput = document.getElementById("gridSize");
const clearBtn = document.getElementById("clearBtn");

let gridData = [];

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

    cell.addEventListener("click", () => {
      const color = colorPicker.value;
      cell.style.backgroundColor = color;
      gridData[i] = color;
      saveDrawing();
    });

    grid.appendChild(cell);
  }

  loadDrawing();
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

gridSizeInput.addEventListener("change", () => {
  createGrid(gridSizeInput.value);
});

clearBtn.addEventListener("click", clearGrid);

// Export as JSON file
document.getElementById("exportBtn").addEventListener("click", () => {
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
});

// Import JSON
document.getElementById("importFile").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);
    gridSizeInput.value = data.size;
    gridData = data.colors;
    createGrid(data.size);
    setTimeout(() => loadDrawing(), 50);
  };
  reader.readAsText(file);
});

createGrid(gridSizeInput.value);
