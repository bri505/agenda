import { useState } from "react";
import { supabase } from "../supabaseClient";
import React from "react";


export default function AgregarTarea({ usuarioId, materias, actualizarTareas }) {
  const [nombre, setNombre] = useState("");
  const [materiaId, setMateriaId] = useState("");

  const agregar = async () => {
    if (!nombre || !materiaId) return alert("Selecciona materia y escribe la tarea");

    const { data, error } = await supabase
      .from("tareas")
      .insert([{ nombre, usuario_id: usuarioId, materia_id: materiaId }]);

    if (error) return alert("Error: " + error.message);

    actualizarTareas((prev) => [...prev, data[0]]);
    setNombre("");
    setMateriaId("");
  };

  return (
    <div className="agregar-tarea">
      <select value={materiaId} onChange={(e) => setMateriaId(e.target.value)}>
        <option value="">Selecciona materia</option>
        {(materias || []).map((mat) => (
          <option key={mat.id} value={mat.id}>{mat.nombre}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button className="btn agregar" onClick={agregar}>Agregar Tarea</button>
    </div>
  );
}
