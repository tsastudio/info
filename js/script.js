var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
    return cell !== '' && cell != null;
}
function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to JSON to filter blank rows
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            // Filter out blank rows (rows where all cells are empty, null, or undefined)
            var filteredData = jsonData.filter(row => row.some(filledCell));

            // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            // Fallback
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }

            // Convert filtered JSON back to CSV
            var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

// Interatividade adicional: scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Clique animado no botão do WhatsApp
const whatsappBtn = document.querySelector(".whatsapp-link a");
if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
        whatsappBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
            whatsappBtn.style.transform = "scale(1)";
        }, 150);
    });
}

// Dark Mode Toggle
const toggleDarkMode = document.createElement("button");
toggleDarkMode.textContent = "🌓 Alternar Tema";
toggleDarkMode.style.position = "fixed";
toggleDarkMode.style.top = "15px";
toggleDarkMode.style.right = "15px";
toggleDarkMode.style.padding = "10px 20px";
toggleDarkMode.style.border = "none";
toggleDarkMode.style.borderRadius = "5px";
toggleDarkMode.style.backgroundColor = "#1976d2";
toggleDarkMode.style.color = "#fff";
toggleDarkMode.style.fontWeight = "bold";
toggleDarkMode.style.cursor = "pointer";
toggleDarkMode.style.zIndex = "1001";
toggleDarkMode.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
toggleDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
document.body.appendChild(toggleDarkMode);
