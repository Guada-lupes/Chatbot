import './App.css'
import { useState } from 'react'

function App() {
const [inputValue, setInputValue] = useState("");

console.log(inputValue);

  return (
    <>
<h1>Hola, ¿En qué puedo ayudarte?</h1>
<form action="submit">
  <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
<button>Enviar</button>
</form>
<div><p>Tu respuesta</p></div>
    </>
  )
}

export default App
