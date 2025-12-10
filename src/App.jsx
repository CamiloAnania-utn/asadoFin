import { useState, useEffect } from 'react'
import { db } from './firebase' // Importamos la conexión
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore'
import './App.css'

function App() {
  const DOC_ID = "evento-asado-2025" // ID único del documento en la base de datos
  const TITULO = "Asado de Fin de Año 2025"
  const FECHAS = ["Viernes 12/12", "Sábado 13/12", "Domingo 14/12"]

  const [participantes, setParticipantes] = useState([])
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [misVotos, setMisVotos] = useState({})
  const [cargando, setCargando] = useState(true)

  // 1. ESCUCHAR LA BASE DE DATOS EN TIEMPO REAL
  useEffect(() => {
    // Nos suscribimos al documento "asados/evento-asado-2025"
    const unsub = onSnapshot(doc(db, "asados", DOC_ID), (docSnap) => {
      if (docSnap.exists()) {
        // Si existe, actualizamos el estado con los datos de la nube
        setParticipantes(docSnap.data().participantes || [])
      } else {
        // Si no existe (primera vez), lo creamos vacío
        setDoc(doc(db, "asados", DOC_ID), { participantes: [] })
      }
      setCargando(false)
    });

    return () => unsub() // Limpiamos la suscripción al salir
  }, [])

  const toggleVoto = (fecha) => {
    setMisVotos(prev => ({
      ...prev,
      [fecha]: !prev[fecha]
    }))
  }

  const enviarVoto = async (e) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return alert("¡Poné tu nombre!")

    try {
      const nuevoParticipante = { 
        nombre: nuevoNombre, 
        votos: misVotos,
        fecha: new Date().toISOString() // Opcional: para saber cuándo votó
      }

      // Guardamos en Firebase usando arrayUnion (agrega sin borrar los anteriores)
      const eventoRef = doc(db, "asados", DOC_ID);
      await updateDoc(eventoRef, {
        participantes: arrayUnion(nuevoParticipante)
      });

      // Limpiamos el formulario
      setNuevoNombre("")
      setMisVotos({})
      alert("¡Voto guardado en la nube!")
    } catch (error) {
      console.error("Error al guardar:", error)
      alert("Hubo un error al guardar. Chequea la consola.")
    }
  }

  if (cargando) return <div className="container"><p>Cargando datos del asado...</p></div>

  return (
    <div className="container">
      <h1>🔥 {TITULO} 🔥</h1>
      <p className="subtitle">Marcá los días que podés:</p>

      {/* Formulario */}
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

        <button className="btn-enviar" onClick={enviarVoto}>
          CONFIRMAR Y SUBIR
        </button>
      </div>

      {/* Tabla de Resultados (Viene de Firebase) */}
      <h2>Resultados en Vivo</h2>
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