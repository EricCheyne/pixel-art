// script.js

document.addEventListener("DOMContentLoaded", () => {
    const colorPicker = document.getElementById("colorPicker");
    const addColorBtn = document.getElementById("addColorBtn");
    const palette = document.getElementById("palette");
    const gridSizeInput = document.getElementById("gridSize");
    const clearBtn = document.getElementById("clearBtn");
    const exportBtn = document.getElementById("exportBtn");
    const importFile = document.getElementById("importFile");
    const exportPngBtn = document.getElementById("exportPngBtn");
    const themeToggle = document.getElementById("themeToggle");
    const grid = document.getElementById("grid");

    // Initialize theme
    let isDarkTheme = false;

    // Toggle theme
    themeToggle.addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle("dark", isDarkTheme);
    });

    // Add color to palette
    addColorBtn.addEventListener("click", () => {
        const color = colorPicker.value;
        const colorDiv = document.createElement("div");
        colorDiv.style.backgroundColor = color;
        colorDiv.className = "palette-color";
        colorDiv.title = color;
        palette.appendChild(colorDiv);
    });

    // Clear the grid
    clearBtn.addEventListener("click", () => {
        grid.innerHTML = "";
    });

    // Export grid as JSON
    exportBtn.addEventListener("click", () => {
        const gridData = Array.from(grid.children).map(cell => cell.style.backgroundColor || null);
        const json = JSON.stringify(gridData);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "grid.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import grid from JSON
    importFile.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const gridData = JSON.parse(e.target.result);
                createGrid(gridSizeInput.value, gridData);
            };
            reader.readAsText(file);
        }
    });

    // Export grid as PNG
    exportPngBtn.addEventListener("click", () => {
        html2canvas(grid).then(canvas => {
            const link = document.createElement("a");
            link.download = "grid.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // Create grid
    function createGrid(size, data = []) {
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            cell.style.backgroundColor = data[i] || "#fff";
            cell.addEventListener("click", () => {
                cell.style.backgroundColor = colorPicker.value;
            });
            grid.appendChild(cell);
        }
    }

    // Initialize grid
    gridSizeInput.addEventListener("change", () => {
        const size = Math.max(4, Math.min(64, gridSizeInput.value));
        gridSizeInput.value = size;
        createGrid(size);
    });

    createGrid(gridSizeInput.value);
});
