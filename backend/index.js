import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = "https://qhzhajwqdxwqdpxjxjzi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoemhhandxZHh3cWRweGp4anppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzc2ODEsImV4cCI6MjA3MzgxMzY4MX0.VkorcoRtjjtV1G1jskewuyZ38lYMMCovgRJMfC5n-3c";
const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta para agregar materia
app.post("/materias", async (req, res) => {
  const { nombre, usuario_id } = req.body;

  if (!nombre || !usuario_id) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const { data, error } = await supabase
    .from("materias")
    .insert([{ nombre, usuario_id }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ data });
});

// Ruta para obtener todas las materias de un usuario
app.get("/materias/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;
  const { data, error } = await supabase
    .from("materias")
    .select("*")
    .eq("usuario_id", usuario_id);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ data });
});

app.listen(3001, () => console.log("Servidor corriendo en puerto 3001"));
