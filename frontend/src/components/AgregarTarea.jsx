import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import React from "react";

export default function AgregarTarea({ materias, actualizarTareas }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUsuarioId(data.session.user.id); // 🔹 Este es el ID correcto
      }
    }
    checkSession();
  }, []);
  
  const agregar = async () => {
    if (!usuarioId) return alert("Debes iniciar sesión para agregar tareas");
    if (!titulo || !materiaId) return alert("Selecciona materia y escribe el título de la tarea");
  
    const { data, error } = await supabase
      .from("tareas")
      .insert([{
        titulo,
        descripcion,
        fecha_entrega: fechaEntrega,
        usuario_id: usuarioId, // 🔹 debe existir en auth.users
        materia_id: materiaId  // 🔹 debe existir en materias
      }])
      .select();
  
    if (error) return alert("Error: " + error.message);
  
    actualizarTareas((prev) => [...prev, data[0]]);
    setTitulo("");
    setDescripcion("");
    setFechaEntrega("");
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
        placeholder="Título de la tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <input
        type="date"
        value={fechaEntrega}
        onChange={(e) => setFechaEntrega(e.target.value)}
      />

      <button className="btn agregar" onClick={agregar}>Agregar Tarea</button>
    </div>
  );
}
