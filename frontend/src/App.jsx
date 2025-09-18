import { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001")
      .then(res => res.json())
      .then(data => setMensaje(data.message));
  }, []);

  return (
    <div>
      <h1>Frontend con React (Webpack) 🚀</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
