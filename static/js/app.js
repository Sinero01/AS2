document.getElementById("churn-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const btnCalcular = document.getElementById("btn-calcular");
    const resultadoCard = document.getElementById("resultado-card");
    const errorBox = document.getElementById("error-box");

    // Estado de carga
    btnCalcular.disabled = true;
    btnCalcular.textContent = "Analizando cliente...";
    errorBox.classList.add("hidden");

    // Construimos el JSON con los tipos exactos que exige ClienteInput en schemas.py
    const payload = {
        id_cliente: document.getElementById("id_cliente").value.trim(),
        edad: parseInt(document.getElementById("edad").value, 10),
        ingresos_anuales: parseFloat(document.getElementById("ingresos_anuales").value),
        saldo_cuenta: parseFloat(document.getElementById("saldo_cuenta").value),
        num_productos: parseInt(document.getElementById("num_productos").value, 10),
        antiguedad_meses: parseInt(document.getElementById("antiguedad_meses").value, 10),
        tiene_tarjeta: parseInt(document.getElementById("tiene_tarjeta").value, 10),
        tipo_cuenta: document.getElementById("tipo_cuenta").value,
        canal_preferido: document.getElementById("canal_preferido").value,
        nivel_estudios: document.getElementById("nivel_estudios").value,
        nivel_satisfaccion: document.getElementById("nivel_satisfaccion").value
    };

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            // Si Pydantic devuelve error 422 o el servidor 500, mostramos el detalle
            const mensajeError = Array.isArray(data.detail)
                ? data.detail.map(err => `${err.loc.join(".")}: ${err.msg}`).join(" | ")
                : data.detail || "Error al procesar la solicitud.";
            throw new Error(mensajeError);
        }

        // Pintamos la respuesta de PrediccionOutput en el DOM
        document.getElementById("res-id").textContent = data.id_cliente;
        document.getElementById("res-veredicto").textContent =
            data.abandono === 1 ? "Abandona (1)" : "Permanece (0)";

        const porcentaje = (data.probabilidad_abandono * 100).toFixed(1) + "%";
        document.getElementById("res-probabilidad").textContent = porcentaje;
        document.getElementById("res-accion").textContent = data.accion_recomendada;

        // Colores dinámicos según nivel_riesgo ("Bajo", "Medio", "Alto")
        const badge = document.getElementById("res-badge");
        const barra = document.getElementById("res-barra");
        const riesgoLower = data.nivel_riesgo.toLowerCase();

        badge.textContent = `Riesgo ${data.nivel_riesgo}`;
        badge.className = `badge badge-${riesgoLower}`;

        barra.style.width = porcentaje;
        barra.style.backgroundColor =
            riesgoLower === "alto" ? "#dc2626" :
            riesgoLower === "medio" ? "#d97706" : "#16a34a";

        resultadoCard.classList.remove("hidden");
    } catch (error) {
        resultadoCard.classList.add("hidden");
        errorBox.textContent = `⚠️ Error: ${error.message}`;
        errorBox.classList.remove("hidden");
    } finally {
        btnCalcular.disabled = false;
        btnCalcular.textContent = "Calcular Riesgo";
    }
});
