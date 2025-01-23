document.addEventListener("DOMContentLoaded", () => {
  const jsonURL = "Pensums/pensumInformatica.json";
  const materiasTable = document.getElementById("materias-table");

  if (!materiasTable) {
    console.error(
      "El elemento con el ID 'materias-table' no se encuentra en el DOM."
    );
    return;
  }

  const renderMaterias = (semestres) => {
    materiasTable.innerHTML = ""; // Limpiar contenido previo

    semestres.forEach((semestre) => {
      const headerRow = document.createElement("tr");
      const headerCell = document.createElement("th");
      headerCell.textContent = `Semestre ${semestre.semestre}`;
      headerCell.colSpan = 3;
      headerRow.appendChild(headerCell);
      materiasTable.appendChild(headerRow);

      semestre.materias.forEach((materia) => {
        const row = document.createElement("tr");

        // Columna del checkbox
        const checkboxCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            row.classList.add("materia-seleccionada");
          } else {
            row.classList.remove("materia-seleccionada");
          }
        });
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        // Columna para el código
        const codigoCell = document.createElement("td");
        codigoCell.textContent = materia.codigo;
        row.appendChild(codigoCell);

        // Columna para el nombre
        const nombreCell = document.createElement("td");
        nombreCell.textContent = materia.nombre;
        row.appendChild(nombreCell);

        // Columna para los créditos
        const creditosCell = document.createElement("td");
        creditosCell.textContent = `${materia.cr}.0`;
        creditosCell.style.textAlign = "right";
        row.appendChild(creditosCell);

        materiasTable.appendChild(row);
      });
    });
  };

  fetch(jsonURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderMaterias(data.pensum);
    })
    .catch((error) => {
      console.error("Error al cargar el JSON:", error);
      materiasTable.innerHTML = `<tr><td colspan="4" style="color: red;">Error al cargar el pensum: ${error.message}</td></tr>`;
    });
});
