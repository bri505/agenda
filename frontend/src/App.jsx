import { useState, useEffect } from "react";
import AgregarMateria from "./components/AgregarMateria";
import ListaMaterias from "./components/ListaMateria";
import AgregarTarea from "./components/AgregarTarea";
import ListaTareas from "./components/ListaTarea";
import ListaTareasRealizadas from "./components/ListaTareasRealizadas";
import Auth from "./components/Auth";
import "./App.css";
import { supabase } from "./supabaseClient";
import React from "react";

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [usuarioId, setUsuarioId] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);

  // 🔹 Verificar sesión al iniciar
  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error al obtener sesión:", error);
      if (data.session) {
        setUsuarioId(data.session.user.id);
      }
    }
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUsuarioId(session.user.id);
        } else {
          setUsuarioId(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Cargar materias y tareas del usuario autenticado
  useEffect(() => {
    if (!usuarioId) return;

    async function fetchData() {
      const { data: matData, error: matError } = await supabase
        .from("materias")
        .select("*")
        .eq("usuario_id", usuarioId);

      if (matError) console.error("Error cargando materias:", matError);
      setMaterias(matData || []);

      const { data: tarData, error: tarError } = await supabase
        .from("tareas")
        .select("*")
        .eq("usuario_id", usuarioId);

      if (tarError) console.error("Error cargando tareas:", tarError);
      setTareas(tarData || []);
    }

    fetchData();
  }, [pantalla, usuarioId]);

  // 🔹 Revisar fechas de entrega y mostrar alertas
  useEffect(() => {
    if (!tareas || tareas.length === 0) return;

    tareas.forEach((t) => {
      if (!t.fecha_entrega) return;

      const hoy = new Date();
      const entrega = new Date(t.fecha_entrega);
      const diffTime = entrega - hoy;
      const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dias < 0) {
        alert(`❌ La tarea "${t.titulo}" ya venció (${t.fecha_entrega})`);
      } else if (dias <= 1) {
        alert(`⚠️ La tarea "${t.titulo}" vence muy pronto (${t.fecha_entrega})`);
      } else if (dias <= 3) {
        alert(`📢 La tarea "${t.titulo}" vence en ${dias} días (${t.fecha_entrega})`);
      }
    });
  }, [tareas]);

  // 🔹 Si no hay sesión → mostrar login/registro
  if (!usuarioId) return <Auth setUsuarioId={setUsuarioId} />;

  return (
    <div className="cuaderno" >
      <div className="pagina" style={{marginTop:"50px"}}>
        {pantalla === "inicio" && (
          <>
            <h1 className="titulo">Mi Cuaderno 🌸</h1>
            <p className="mensaje">
              Organiza tus materias y tareas de manera divertida!
            </p>
            <div className="botones">
              <button className="btn" onClick={() => setPantalla("materias")}>
                Materias
              </button>
              <button className="btn" onClick={() => setPantalla("tareas")}>
                Tareas
              </button>
              <button
                className="btn"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUsuarioId(null);
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        )}

        {pantalla === "materias" && (
          <>
            <h1 className="titulo">Materias 📚</h1>
            <AgregarMateria
              usuarioId={usuarioId}
              actualizarMaterias={setMaterias}
            />
            <ListaMaterias materias={materias} />
            <button className="btn" onClick={() => setPantalla("inicio")}>
              Volver
            </button>
          </>
        )}

        {pantalla === "tareas" && (
          <>
            <h1 className="titulo">Tareas 📝</h1>
            <AgregarTarea
              usuarioId={usuarioId}
              materias={materias}
              actualizarTareas={setTareas}
            />
            
            <ListaTareas tareas={tareas} />
            
            <button className="btn" onClick={() => setPantalla("inicio")}>
              Volver
            </button>
            

          </>

        )}
      </div>
    </div>
  );
}
