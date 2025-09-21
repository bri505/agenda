import { useState } from "react";
import { supabase } from "../supabaseClient";
import React from "react";

export default function AgregarMateria({ usuarioId, actualizarMaterias }) {
  const [nombre, setNombre] = useState("");

  const agregar = async () => {
    if (!nombre) return alert("Escribe el nombre de la materia");

    if (!usuarioId) return alert("Usuario no autenticado"); // validación extra

    const { data, error } = await supabase
      .from("materias")
      .insert([{ nombre, usuario_id: usuarioId }])
      .select(); // 🔹 IMPORTANTE: agregar .select() para que devuelva data

    if (error) return alert("Error: " + error.message);

    // data es un array, pero puede ser null si algo falla
    if (data && data.length > 0) {
      actualizarMaterias((prev) => [...prev, data[0]]);
      setNombre("");
    }
  };

  return (
    <div className="agregar-materia">
      <input
        type="text"
        placeholder="Nueva materia"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button className="btn agregar" onClick={agregar}>
        Agregar Materia
      </button>
    </div>
  );
}
