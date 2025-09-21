import React from "react";

export default function ListaTareas({ tareas }) {
  if (!tareas || tareas.length === 0) return <p>No hay tareas aún.</p>;

  // Función para calcular la diferencia en días
  const diasRestantes = (fechaEntrega) => {
    const hoy = new Date();
    const entrega = new Date(fechaEntrega);
    const diffTime = entrega - hoy;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // diferencia en días
  };

  // Mapeo de días a color y emoji
  const getAlerta = (dias) => {
    if (dias <= 1) return { color: "#ff4d4d", emoji: "🔴", texto: "Urgente" };
    if (dias <= 3) return { color: "#ff8080", emoji: "🟠", texto: "Muy pronto" };
    if (dias <= 7) return { color: "#ffb3d9", emoji: "🟡", texto: "Próximo" };
    return { color: "#ffe6f0", emoji: "🟢", texto: "Normal" };
  };

  return (
    <>
      {/* Guía visual */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <strong>Guía de importancia:</strong> 
        <span style={{ margin: "0 10px" }}>🔴 Urgente</span>
        <span style={{ margin: "0 10px" }}>🟠 Muy pronto</span>
        <span style={{ margin: "0 10px" }}>🟡 Próximo</span>
        <span style={{ margin: "0 10px" }}>🟢 Normal</span>
      </div>

      {/* Lista de tareas */}
      <ul>
        {tareas.map((t) => {
          const dias = diasRestantes(t.fecha_entrega);
          const alerta = getAlerta(dias);

          return (
            <li
              key={t.id}
              style={{
                backgroundColor: alerta.color,
                padding: "8px 12px",
                borderRadius: "10px",
                marginBottom: "8px",
                boxShadow: "0 2px 4px rgba(255,0,127,0.1)",
              }}
            >
              <span style={{ marginRight: "8px" }}>{alerta.emoji}</span>
              <strong>{t.titulo}</strong> - {t.descripcion} <br />
              <small>Entrega: {t.fecha_entrega}</small>
            </li>
          );
        })}
      </ul>
    </>
  );
}
