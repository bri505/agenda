import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListaTareasRealizadas({ usuarioId }) {
  const [tareasRealizadas, setTareasRealizadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTareasRealizadas = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tareas_realizadas")
          .select("id, titulo, descripcion, fecha_entrega, created_at")
          .eq("usuario_id", usuarioId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTareasRealizadas(data || []);
      } catch (err) {
        console.error("Error cargando tareas realizadas:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (usuarioId) fetchTareasRealizadas();
  }, [usuarioId]);

  if (loading) return <p>Cargando tareas realizadas...</p>;
  if (tareasRealizadas.length === 0) return <p>No hay tareas realizadas aún.</p>;

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>✅ Tareas Realizadas</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {tareasRealizadas.map((t) => (
          <li
            key={t.id}
            style={{
              backgroundColor: "#e6f7e6",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "1.05rem", marginBottom: "6px" }}>
                <span style={{ marginRight: 8 }}>✅</span>
                <strong>{t.titulo}</strong>
              </div>
              {t.descripcion && <div style={{ marginBottom: 6 }}>{t.descripcion}</div>}
              {t.fecha_entrega && (
                <small style={{ color: "#555" }}>
                  Fecha de entrega: {new Date(t.fecha_entrega).toLocaleDateString()}
                </small>
              )}
              <br />
              <small style={{ color: "#777" }}>
                Completada: {new Date(t.created_at).toLocaleString()}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
