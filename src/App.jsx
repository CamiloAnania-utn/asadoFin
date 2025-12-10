import { useState } from 'react'
import './App.css'

function App() {
  // Configuración del asado
  const TITULO = "Asado de Fin de Año 2025"
  const FECHAS = ["Viernes 12/12", "Sábado 13/12", "Domingo 14/12"]

  // Estado para guardar participantes (Simulado por ahora)
  const [participantes, setParticipantes] = useState([
    { nombre: "El Organizador", votos: { "Viernes 12/12": true, "Sábado 13/12": true, "Domingo 14/12": false } }
  ])

  const [nuevoNombre, setNuevoNombre] = useState("")
  const [misVotos, setMisVotos] = useState({})

  const toggleVoto = (fecha) => {
    setMisVotos(prev => ({
      ...prev,
      [fecha]: !prev[fecha] // Invierte el valor (true/false)
    }))
  }

  const enviarVoto = (e) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return alert("¡Poné tu nombre!")
    
    // Agregamos al nuevo participante
    setParticipantes([...participantes, { nombre: nuevoNombre, votos: misVotos }])
    setNuevoNombre("")
    setMisVotos({})
    alert("¡Voto registrado!")
  }

  return (
    <div className="container">
      <h1>🔥 {TITULO} 🔥</h1>
      <p className="subtitle">Marcá los días que podés:</p>

      {/* Formulario de Votación */}
      <div className="card">
        <input 
          type="text" 
          placeholder="Tu Nombre (ej: Tincho)" 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        
        <div className="fechas-grid">
          {FECHAS.map(fecha => (
            <button 
              key={fecha}
              className={`btn-fecha ${misVotos[fecha] ? 'activo' : ''}`}
              onClick={() => toggleVoto(fecha)}
            >
              {fecha} {misVotos[fecha] ? '✅' : '❌'}
            </button>
          ))}
        </div>

        <button className="btn-enviar" onClick={enviarVoto}>CONFIRMAR ASISTENCIA</button>
      </div>

      {/* Tabla de Resultados */}
      <h2>Resultados Parciales</h2>
      <div className="tabla-resultados">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              {FECHAS.map(f => <th key={f}>{f.split(" ")[0]}</th>)}
            </tr>
          </thead>
          <tbody>
            {participantes.map((p, i) => (
              <tr key={i}>
                <td>{p.nombre}</td>
                {FECHAS.map(f => (
                  <td key={f} className={p.votos[f] ? 'si' : 'no'}>
                    {p.votos[f] ? '✅' : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App