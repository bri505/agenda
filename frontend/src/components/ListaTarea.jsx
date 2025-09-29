// src/components/ListaTareas.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ListaTareas({ actualizarTareas = () => {} }) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarRealizadas, setMostrarRealizadas] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  // Cargar tareas según el modo
  const cargarTareas = async () => {
    setLoading(true);
    try {
      const tabla = mostrarRealizadas ? "tareas_realizadas" : "tareas";
      const { data, error } = await supabase.from(tabla).select("*").order("fecha_entrega", { ascending: true });

      if (error) throw error;
      setTareas(data || []);
    } catch (err) {
      console.error("Error al cargar tareas:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, [mostrarRealizadas]);

  // Función para calcular días restantes
  const diasRestantes = (fechaEntrega) => {
    if (!fechaEntrega) return Infinity;
    const hoy = new Date();
    const entrega = new Date(fechaEntrega);
    const diffTime = entrega - hoy;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Colores y estados
  const getAlerta = (dias) => {
    if (dias < 0) return { color: "#f8d7da", emoji: "⚫", texto: "Vencida" };
    if (dias <= 1) return { color: "#ff4d4d", emoji: "🔴", texto: "Urgente" };
    if (dias <= 3) return { color: "#ff8080", emoji: "🟠", texto: "Muy pronto" };
    if (dias <= 7) return { color: "#ffb3d9", emoji: "🟡", texto: "Próximo" };
    return { color: "#eaf7ee", emoji: "🟢", texto: "Normal" };
  };

  // Marcar tarea como realizada
  const marcarRealizada = async (tarea) => {
    if (!tarea || !tarea.id) return;
    const id = tarea.id;
    const confirm = window.confirm(`¿Marcar la tarea "${tarea.titulo}" como realizada?`);
    if (!confirm) return;

    try {
      setLoadingId(id);

      // 1) Insertar en tareas_realizadas
      const { error: insertError } = await supabase.from("tareas_realizadas").insert([
        {
          id: tarea.id, 
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          fecha_entrega: tarea.fecha_entrega,
          usuario_id: tarea.usuario_id,
          materia_id: tarea.materia_id,
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;

      // 2) Eliminar de tareas pendientes
      const { error: deleteError } = await supabase.from("tareas").delete().eq("id", id);
      if (deleteError) throw deleteError;

      // 3) Actualizar estado local
      actualizarTareas((prev) => (Array.isArray(prev) ? prev.filter((t) => t.id !== id) : []));
      setTareas((prev) => prev.filter((t) => t.id !== id));

      alert(`✅ La tarea "${tarea.titulo}" fue marcada como realizada.`);
    } catch (err) {
      console.error("Error al marcar tarea:", err);
      alert("Error al marcar tarea: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      

      {/* Guía visual */}
      {!mostrarRealizadas && (
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <br></br>
          <strong>Guía de importancia:</strong>
          <span style={{ margin: "0 10px" }}>🔴 Urgente</span>
          <span style={{ margin: "0 10px" }}>🟠 Muy pronto</span>
          <span style={{ margin: "0 10px" }}>🟡 Próximo</span>
          <span style={{ margin: "0 10px" }}>🟢 Normal</span>
          <span style={{ margin: "0 10px" }}>⚫ Vencida</span>
        </div>
      )}
          {/* Botón para alternar entre pendientes y realizadas */}
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
                  <button
                    onClick={() => setMostrarRealizadas(!mostrarRealizadas)}
                    style={{
                      marginTop: "5px",
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {mostrarRealizadas ? "📋 Ver pendientes" : "✅ Ver realizadas"}
                  </button>
          </div>
      {/* Lista de tareas */}
      {loading ? (
        <p>Cargando...</p>
      ) : tareas.length === 0 ? (
        <p>No hay tareas {mostrarRealizadas ? "realizadas" : "pendientes"}.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {tareas.map((t) => {
            const dias = diasRestantes(t.fecha_entrega);
            const alerta = getAlerta(dias);

            return (
              <li
                key={t.id}
                style={{
                  backgroundColor: mostrarRealizadas ? "#d4edda" : alerta.color,
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left", maxWidth: "78%" }}>
                <div style={{ fontSize: "1.05rem", marginBottom: "6px" }}>
                  {!mostrarRealizadas && <span style={{ marginRight: 8 }}>{alerta.emoji}</span>}
                  <strong>{t.titulo}</strong>
                </div>
                {t.descripcion && <div style={{ marginBottom: 6 }}>{t.descripcion}</div>}
                {t.fecha_entrega && (
                  <small style={{ color: "#555" }}>
                    Entrega: {new Date(t.fecha_entrega).toLocaleDateString()}{" "}
                    {!mostrarRealizadas &&
                      (dias < 0
                        ? "(Entrega tarde)"
                        : `(${dias} día(s)${dias === 1 ? "" : "s"} restante(s))`)}
                  </small>
                )}
              </div>


                {/* Botón para marcar como realizada (solo en pendientes) */}
                {!mostrarRealizadas && (
                  <button
                    onClick={() => marcarRealizada(t)}
                    disabled={loadingId === t.id}
                    style={{
                      background: loadingId === t.id ? "#9be09b" : "#37b24d",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {loadingId === t.id ? "Guardando..." : "✅ Realizada"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
