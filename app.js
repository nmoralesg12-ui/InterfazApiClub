const API = "https://apiclub-arg4e0cravhhgxfa.mexicocentral-01.azurewebsites.net";

// ✅ Usuario del banco (simula login)
let appState = {
    cuentaId: 10  // 👉 ESTE valor lo dará el banco automáticamente
};

// =========================
// ✅ PAGAR
// =========================
async function pagar() {

    const servicioId = document.getElementById("servicio").value;
    const usuario = appState.cuentaId; // ✅ AUTOMÁTICO
    const div = document.getElementById("resultado");

    div.innerHTML = "⏳ Procesando...";

    try {

        const res = await fetch(`${API}/api/pagos/pagar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                servicioId: parseInt(servicioId),
                usuarioBancoId: usuario
            })
        });

        const data = await res.json();

        if (data.pago.estado === "Aprobado") {

            div.innerHTML = `
                <h3 class="aprobado">✅ Pago aprobado</h3>
                <p><b>Servicio:</b> ${data.pago.servicio}</p>
                <p><b>Monto:</b> Q${data.pago.monto}</p>
                <p><b>Referencia:</b> ${data.pago.referenciaBanco}</p>
            `;

        } else {

            div.innerHTML = `
                <h3 class="rechazado">❌ Pago rechazado</h3>
                <p><b>Servicio:</b> ${data.pago.servicio}</p>
                <p><b>Motivo:</b> ${data.pago.motivoRechazo}</p>
            `;
        }

    } catch (error) {
        div.innerHTML = "❌ Error conectando con la API";
        console.error(error);
    }
}

// =========================
// ✅ HISTORIAL
// =========================
async function verHistorial() {

    const usuario = appState.cuentaId; // ✅ AUTOMÁTICO
    const div = document.getElementById("resultado");

    div.innerHTML = "⏳ Cargando historial...";

    try {

        const res = await fetch(`${API}/api/pagos/${usuario}`);
        const data = await res.json();

        if (!data || data.length === 0) {
            div.innerHTML = "No hay pagos registrados";
            return;
        }

        let html = `
            <h3>Historial</h3>
            <table>
            <tr>
                <th>Servicio</th>
                <th>Monto</th>
                <th>Estado</th>
            </tr>
        `;

        data.forEach(p => {
            html += `
                <tr>
                    <td>${p.servicio}</td>
                    <td>Q${p.monto}</td>
                    <td class="${p.estado === 'Aprobado' ? 'aprobado' : 'rechazado'}">
                        ${p.estado}
                    </td>
                </tr>
            `;
        });

        html += "</table>";

        div.innerHTML = html;

    } catch (error) {
        div.innerHTML = "❌ Error al cargar historial";
        console.error(error);
    }
}