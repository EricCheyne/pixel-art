const grid = document.getElementById("grid");
const colorPicker = document.getElementById("colorPicker");
const gridSizeInput = document.getElementById("gridSize");
const clearBtn = document.getElementById("clearBtn");

function createGrid(size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.addEventListener("click", () => {
      cell.style.backgroundColor = colorPicker.value;
    });
    grid.appendChild(cell);
  }
}

gridSizeInput.addEventListener("change", () => {
  createGrid(gridSizeInput.value);
});

clearBtn.addEventListener("click", () => {
  createGrid(gridSizeInput.value);
});

createGrid(gridSizeInput.value);
