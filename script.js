document.addEventListener("DOMContentLoaded", () => {
  const jsonURL = "Pensums/pensumInformatica.json";
  const subjectList = document.getElementById("subject-list");
  const progressPercentage = document.getElementById("progress-percentage");
  const progressBar = document.getElementById("progress-bar");
  const completedSubjectsText = document.getElementById("completed-subjects");

  let totalCreditos = 0;
  let creditosCompletados = 0;
  let savedState = JSON.parse(localStorage.getItem("subjectsState")) || {};

  if (!subjectList) {
    console.error("No se encontró el contenedor con id 'subject-list'.");
    return;
  }

  const updateProgress = () => {
    const progress = (creditosCompletados / totalCreditos) * 100;
    progressPercentage.textContent = `${Math.round(progress)}%`;
    progressBar.style.width = `${progress}%`;
    completedSubjectsText.textContent = `${creditosCompletados} de ${totalCreditos} créditos completados`;

    // Guardar estado en localStorage
    localStorage.setItem("subjectsState", JSON.stringify(savedState));
  };

  const renderMaterias = (semestres) => {
    semestres.forEach((semestre) => {
      const semestreTitle = document.createElement("h3");
      semestreTitle.className = "text-lg font-bold text-gray-800 mb-4";
      semestreTitle.textContent = `Semestre ${semestre.semestre}`;
      subjectList.appendChild(semestreTitle);

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
          savedState[materia.codigo] = checkbox.checked;
          updateProgress();
        });

        materiaDiv.appendChild(infoDiv);
        materiaDiv.appendChild(checkbox);
        subjectList.appendChild(materiaDiv);
      });
    });

    updateProgress();
  };

  fetch(jsonURL)
    .then((response) => {
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return response.json();
    })
    .then((data) => renderMaterias(data.pensum))
    .catch((error) => {
      console.error("Error al cargar el JSON:", error);
      const errorMessage = document.createElement("p");
      errorMessage.className = "text-red-500";
      errorMessage.textContent =
        "No se pudo cargar el pensum. Por favor, intente más tarde.";
      subjectList.appendChild(errorMessage);
    });
});
