// src/components/Auth.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";
import React from "react";

export default function Auth({ setUsuarioId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMensaje(error.message);
      } else {
        setUsuarioId(data.user.id); // 👈 esto manda al inicio
      }
    } else {
      // Registro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setMensaje(error.message);
      } else {
        setUsuarioId(data.user.id); // 👈 inicia directo tras registrarse
      }
    }
  };

  return (
    <div className="cuaderno">
      <div className="pagina">
        <h1 className="titulo">{isLogin ? "Inicia Sesión ✨" : "Regístrate 🌸"}</h1>
        <p className="mensaje">Organiza tus materias, tareas y exámenes</p>

        <form onSubmit={handleSubmit} className="formulario">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn agregar" type="submit">
            {isLogin ? "Entrar 🚀" : "Crear cuenta 💖"}
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <div className="botones">
          <button className="btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "¿No tienes cuenta? Regístrate 💕"
              : "¿Ya tienes cuenta? Inicia sesión 🔑"}
          </button>
        </div>
      </div>
    </div>
  );
}
