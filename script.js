document.addEventListener("DOMContentLoaded", () => {
  const subjectList = document.getElementById("subject-list");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressBar = document.getElementById("progress-bar");
  const completedSubjectsText = document.getElementById("completed-subjects");
  const pensumSelect = document.getElementById("pensum-select");

  let totalCreditos = 0;
  let creditosCompletados = 0;
  let savedState = JSON.parse(localStorage.getItem("subjectsState")) || {};

  if (!subjectList) {
    console.error("No se encontró el contenedor con id 'subject-list'.");
    return;
  }

  // Función para actualizar el progreso
  const updateProgress = () => {
    const progress = (creditosCompletados / totalCreditos) * 100;
    progressPercentage.textContent = `${Math.round(progress)}%`;
    progressBar.style.width = `${progress}%`;
    completedSubjectsText.textContent = `${creditosCompletados} de ${totalCreditos} créditos completados`;

    // Guardar estado en localStorage
    localStorage.setItem("subjectsState", JSON.stringify(savedState));
  };

  // Función para renderizar las materias
  const renderMaterias = (pensum) => {
    subjectList.innerHTML = ""; // Limpiar la lista de materias
    totalCreditos = 0;
    creditosCompletados = 0;

    if (!pensum) {
      console.error("No se encontraron semestres en los datos.");
      return;
    }

    pensum.forEach((semestre) => {
      const semestreTitle = document.createElement("h3");
      semestreTitle.className =
        "text-lg font-bold text-gray-800 mb-4 flex justify-between items-center";
      semestreTitle.textContent = `Semestre ${semestre.semestre}`;

      const toggleIcon = document.createElement("i");
      toggleIcon.className =
        "ml-4 fas fa-chevron-up text-blue-500 cursor-pointer";
      semestreTitle.appendChild(toggleIcon);

      const materiasContainer = document.createElement("div");
      materiasContainer.className = "materias-container";

      toggleIcon.addEventListener("click", () => {
        if (materiasContainer.style.display === "none") {
          materiasContainer.style.display = "block";
          toggleIcon.className =
            "ml-4 fas fa-chevron-up text-blue-500 cursor-pointer";
        } else {
          materiasContainer.style.display = "none";
          toggleIcon.className =
            "ml-4 fas fa-chevron-down text-blue-500 cursor-pointer";
        }
      });

      subjectList.appendChild(semestreTitle);
      subjectList.appendChild(materiasContainer);

      semestre.materias.forEach((materia) => {
        totalCreditos += materia.cr; // Sumar créditos al total
        const isCompleted = savedState[materia.codigo] || false;
        if (isCompleted) creditosCompletados += materia.cr; // Sumar créditos completados

        const materiaDiv = document.createElement("div");
        materiaDiv.className = `flex items-center justify-between bg-white shadow rounded-lg p-4 mb-2 ${
          isCompleted ? "bg-green-200" : ""
        }`;

        const infoDiv = document.createElement("div");
        infoDiv.className = "flex flex-col";
        infoDiv.innerHTML = `
          <p class="text-gray-800 font-medium">${materia.nombre}</p>
          <p class="text-sm text-gray-600">Código: ${materia.codigo} | Créditos: ${materia.cr}</p>
        `;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className =
          "h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-0";
        checkbox.checked = isCompleted;

        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            creditosCompletados += materia.cr; // Sumar créditos al completar
            materiaDiv.classList.add("bg-green-200");
          } else {
            creditosCompletados -= materia.cr; // Restar créditos al desmarcar
            materiaDiv.classList.remove("bg-green-200");
          }
          updateProgress();
        });

        materiaDiv.appendChild(infoDiv);
        materiaDiv.appendChild(checkbox);
        materiasContainer.appendChild(materiaDiv);
      });
    });
    updateProgress(); // Llamar a updateProgress después de renderizar las materias
  };

  // Función para cargar el pensum desde el backend
  const loadPensum = (url) => {
    fetch("https://102c-190-167-145-7.ngrok-free.app/scrape-pensum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        renderMaterias(data.pensum);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  };

  // Escuchar cambios en la selección del pensum
  pensumSelect.addEventListener("change", (event) => {
    const url = event.target.value; // Obtener el enlace del pensum seleccionado
    loadPensum(url); // Cargar el pensum desde el backend
  });

  // Cargar el pensum inicial (opcional)
  const initialUrl = pensumSelect.value;
  loadPensum(initialUrl);
});
