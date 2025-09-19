import { useState, useEffect } from "react";
import AgregarMateria from "./components/AgregarMateria";
import ListaMaterias from "./components/ListaMateria";
import AgregarTarea from "./components/AgregarTarea";
import ListaTareas from "./components/ListaTarea";
import "./App.css";
import { supabase } from "./supabaseClient"; // importa tu cliente supabase
import React from "react";

export default function App() {
  const usuarioId = "2abc2351-b10c-4217-a8bb-99d09300095a"; // Reemplaza por el usuario real
  const [pantalla, setPantalla] = useState("inicio"); // inicio | materias | tareas
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);

  // Traer materias y tareas
  useEffect(() => {
    async function fetchData() {
      const { data: matData } = await supabase
        .from("materias")
        .select("*")
        .eq("usuario_id", usuarioId);
      setMaterias(matData || []);

      const { data: tarData } = await supabase
        .from("tareas")
        .select("*")
        .eq("usuario_id", usuarioId);
      setTareas(tarData || []);
    }
    fetchData();
  }, [pantalla]); // actualiza al cambiar de pantalla

  return (
    <div className="cuaderno">
      <div className="pagina">
        {pantalla === "inicio" && (
          <>
            <h1 className="titulo">Mi Cuaderno 🌸</h1>
            <p className="mensaje">Organiza tus materias y tareas de manera divertida!</p>
            <div className="botones">
              <button className="btn" onClick={() => setPantalla("materias")}>Materias</button>
              <button className="btn" onClick={() => setPantalla("tareas")}>Tareas</button>
            </div>
          </>
        )}

        {pantalla === "materias" && (
          <>
            <h1 className="titulo">Materias 📚</h1>
            <AgregarMateria usuarioId={usuarioId} actualizarMaterias={setMaterias} />
            <ListaMaterias materias={materias} />
            <button className="btn" onClick={() => setPantalla("inicio")}>Volver</button>
          </>
        )}

        {pantalla === "tareas" && (
          <>
            <h1 className="titulo">Tareas 📝</h1>
            <AgregarTarea usuarioId={usuarioId} materias={materias} actualizarTareas={setTareas} />
            <ListaTareas tareas={tareas} />
            <button className="btn" onClick={() => setPantalla("inicio")}>Volver</button>
          </>
        )}
      </div>
    </div>
  );
}
