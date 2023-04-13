import { useState, useEffect } from "react";

function App() {
  const [estaLogeado, setLogeado] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData && storedData.token) {
      setLogeado(true);
    }
  }, []);

  const login = async (event) => {
    event.preventDefault();

    try {
      const urlLogin = `http://localhost:4000/`;
      const response = await fetch(urlLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: "Alejo",
          email: "alejoforero@gmail.com",
          password: "12345678",
        }),
      });
      const responseData = await response.json();

      if (responseData.datos.token) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            userId: responseData.datos.nombre,
            token: responseData.datos.token,
          })
        );
        setLogeado(true);
      } else {
        alert("Credenciales inválidas");
      }
    } catch (e) {}
  };

  function salir() {
    localStorage.removeItem("userData");
    setLogeado(false);
  }

  return (
    <div className="App">
      {estaLogeado && <button onClick={salir}>Logout</button>}
      {!estaLogeado && (
        <form onSubmit={login}>
          <button type="submit">Entrar</button>
        </form>
      )}
    </div>
  );
}

export default App;
