// =======================
// Reserva de Pistas (Firestore)
// =======================

// Requiere que exista `db` desde js/firebase.js
const reservasRef = db.collection("reservas");

// DOM
const form = document.getElementById("form-reserva");
const pistaEl = document.getElementById("pista");
const fechaEl = document.getElementById("fecha");
const horaInicioEl = document.getElementById("horaInicio");
const horaFinEl = document.getElementById("horaFin");
const nombreEl = document.getElementById("nombre");

const btnLimpiar = document.getElementById("btn-limpiar");

const filtroPistaEl = document.getElementById("filtroPista");
const filtroFechaEl = document.getElementById("filtroFecha");
const btnResetFiltros = document.getElementById("btn-reset-filtros");

const tablaBody = document.getElementById("tabla-body");

const alertSuccess = document.getElementById("alert-success");
const alertError = document.getElementById("alert-error");

// Estado UI (la fuente de datos real es Firestore)
let reservasCache = [];

// Utils
function showAlert(type, msg) {
    alertSuccess.hidden = true;
    alertError.hidden = true;

    const target = type === "success" ? alertSuccess : alertError;
    target.textContent = msg;
    target.hidden = false;

    setTimeout(() => {
        target.hidden = true;
        target.textContent = "";
    }, 2500);
}

function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function aplicarFiltros(list) {
    const pista = filtroPistaEl.value;
    const fecha = filtroFechaEl.value;

    return list.filter((r) => {
        const okPista = pista === "ALL" ? true : r.pista === pista;
        const okFecha = !fecha ? true : r.fecha === fecha;
        return okPista && okFecha;
    });
}

function sortReservas(list) {
    return [...list].sort((a, b) => {
        const d = String(a.fecha).localeCompare(String(b.fecha));
        if (d !== 0) return d;
        return toMinutes(a.horaInicio) - toMinutes(b.horaInicio);
    });
}

function render() {
    const list = sortReservas(aplicarFiltros(reservasCache));
    tablaBody.innerHTML = "";

    if (list.length === 0) {
        tablaBody.innerHTML =
            `<tr><td colspan="5" class="empty">Aún no hay reservas.</td></tr>`;
        return;
    }

    list.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${escapeHtml(r.pista)}</td>
      <td>${escapeHtml(r.fecha)}</td>
      <td>${escapeHtml(r.horaInicio)} - ${escapeHtml(r.horaFin)}</td>
      <td>${escapeHtml(r.nombre)}</td>
      <td>
        <button class="btn-danger" data-id="${r.id}">Eliminar</button>
      </td>
    `;
        tablaBody.appendChild(tr);
    });
}

// Validación anti-solapamiento CONTRA Firestore
async function haySolapamientoFirestore({ pista, fecha, horaInicio, horaFin }) {
    // Traemos solo reservas de esa pista y fecha (pocas) y comprobamos solape en JS
    const snap = await reservasRef
        .where("pista", "==", pista)
        .where("fecha", "==", fecha)
        .get();

    const startB = toMinutes(horaInicio);
    const endB = toMinutes(horaFin);

    let solape = false;

    snap.forEach((doc) => {
        const r = doc.data();
        const startA = toMinutes(r.horaInicio);
        const endA = toMinutes(r.horaFin);

        // Solape si startB < endA && endB > startA
        if (startB < endA && endB > startA) solape = true;
    });

    return solape;
}

// Realtime listener (fuente de verdad)
reservasRef
    .orderBy("fecha")
    .orderBy("horaInicio")
    .onSnapshot(
        (snapshot) => {
            const arr = [];
            snapshot.forEach((doc) => {
                arr.push({ id: doc.id, ...doc.data() });
            });
            reservasCache = arr;
            render();
        },
        (err) => {
            console.error(err);
            showAlert("error", "Error leyendo Firestore.");
        }
    );

// Events
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pista = pistaEl.value;
    const fecha = fechaEl.value;
    const horaInicio = horaInicioEl.value;
    const horaFin = horaFinEl.value;
    const nombre = nombreEl.value.trim();

    // Validaciones básicas
    if (!pista || !fecha || !horaInicio || !horaFin || !nombre) {
        showAlert("error", "Rellena todos los campos.");
        return;
    }

    if (toMinutes(horaFin) <= toMinutes(horaInicio)) {
        showAlert("error", "La hora fin debe ser mayor que la hora inicio.");
        return;
    }

    try {
        // Validación clave (anti-solapamientos)
        const solapa = await haySolapamientoFirestore({
            pista,
            fecha,
            horaInicio,
            horaFin,
        });

        if (solapa) {
            showAlert("error", "Esa pista ya está reservada en esa franja horaria.");
            return;
        }

        await reservasRef.add({
            pista,
            fecha,
            horaInicio,
            horaFin,
            nombre,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        showAlert("success", "Reserva creada correctamente.");
        form.reset();
        pistaEl.value = "";
    } catch (err) {
        console.error(err);
        showAlert("error", "No se pudo guardar la reserva.");
    }
});

btnLimpiar.addEventListener("click", () => {
    form.reset();
    pistaEl.value = "";
    alertSuccess.hidden = true;
    alertError.hidden = true;
});

btnResetFiltros.addEventListener("click", () => {
    filtroPistaEl.value = "ALL";
    filtroFechaEl.value = "";
    render();
});

filtroPistaEl.addEventListener("change", render);
filtroFechaEl.addEventListener("change", render);

tablaBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;

    const id = btn.getAttribute("data-id");

    try {
        await reservasRef.doc(id).delete();
        showAlert("success", "Reserva eliminada.");
    } catch (err) {
        console.error(err);
        showAlert("error", "No se pudo eliminar.");
    }
});

// Render inicial
render();
