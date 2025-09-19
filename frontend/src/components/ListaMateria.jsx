import React from "react";

export default function ListaMaterias({ materias }) {
  if (!materias || materias.length === 0) return <p>No hay materias aún.</p>;

  return (
    <ul>
      {materias.map((mat) => (
        <li key={mat.id}>{mat.nombre}</li>
      ))}
    </ul>
  );
}
