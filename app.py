from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/scrape-pensum", methods=["POST"])
def scrape_pensum():
    # Obtener el enlace del pensum desde la solicitud
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "No se proporcionó un enlace válido"}), 400

    # Realizar la solicitud HTTP a la página del pensum
    response = requests.get(url)

    if response.status_code == 200:
        # Parsear el contenido HTML
        soup = BeautifulSoup(response.content, "html.parser")

        # Encontrar la tabla que contiene las materias
        table = soup.find("table", {"class": "table"})

        if table:
            # Lista para almacenar los datos del pensum
            pensum = []

            # Iterar sobre las filas de la tabla
            for row in table.find_all("tr"):
                # Verificar si la fila es un encabezado de semestre
                if row.find("h5"):
                    semestre = row.find("h5").text.strip()
                    pensum.append({"semestre": semestre, "materias": []})
                else:
                    # Extraer las celdas de la fila
                    cells = row.find_all("td")
                    if len(cells) == 7:  # Asegurarse de que la fila tenga 7 celdas
                        clave = cells[0].text.strip()
                        asignatura = cells[1].text.strip()
                        ht = cells[2].text.strip()
                        hp = cells[3].text.strip()
                        cr = cells[4].text.strip()
                        prerrequisitos = cells[5].text.strip()
                        equivalencias = cells[6].text.strip()

                        # Agregar la materia al último semestre
                        if pensum:
                            pensum[-1]["materias"].append({
                                "clave": clave,
                                "asignatura": asignatura,
                                "ht": ht,
                                "hp": hp,
                                "cr": cr,
                                "prerrequisitos": prerrequisitos,
                                "equivalencias": equivalencias
                            })

            return jsonify(pensum)
        else:
            return jsonify({"error": "No se encontró la tabla de materias en la página"}), 404
    else:
        return jsonify({"error": f"Error al acceder a la página: {response.status_code}"}), 500

if __name__ == "__main__":
    app.run(debug=True)