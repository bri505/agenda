import { useState } from "react";
import { supabase } from "../supabaseClient";
import React from "react";


export default function AgregarMateria({ usuarioId, actualizarMaterias }) {
  const [nombre, setNombre] = useState("");

  const agregar = async () => {
    if (!nombre) return alert("Escribe el nombre de la materia");

    const { data, error } = await supabase
      .from("materias")
      .insert([{ nombre, usuario_id: usuarioId }]);

    if (error) return alert("Error: " + error.message);

    actualizarMaterias((prev) => [...prev, data[0]]);
    setNombre("");
  };

  return (
    <div className="agregar-materia">
      <input
        type="text"
        placeholder="Nueva materia"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button className="btn agregar" onClick={agregar}>Agregar Materia</button>
    </div>
  );
}
