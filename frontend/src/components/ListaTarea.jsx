import React from "react";

export default function ListaTareas({ tareas }) {
  if (!tareas || tareas.length === 0) return <p>No hay tareas aún.</p>;

  return (
    <ul>
      {tareas.map((t) => (
        <li key={t.id}>{t.nombre}</li>
      ))}
    </ul>
  );
}
