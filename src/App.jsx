import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore'
import './App.css'

function App() {
  const DOC_ID = "evento-asado-2025"
  const TITULO = "Asado de Fin de Año 2025"
  const FECHAS = ["Sabado 20", "Domingo 21", "Viernes 26", "Sabado 27", "Domingo 28"]

  const [participantes, setParticipantes] = useState([])
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [misVotos, setMisVotos] = useState({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "asados", DOC_ID), (docSnap) => {
      if (docSnap.exists()) {
        setParticipantes(docSnap.data().participantes || [])
      } else {
        setDoc(doc(db, "asados", DOC_ID), { participantes: [] })
      }
      setCargando(false)
    });
    return () => unsub()
  }, [])

  const toggleVoto = (fecha) => {
    setMisVotos(prev => ({ ...prev, [fecha]: !prev[fecha] }))
  }

  const enviarVoto = async (e) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return alert("¡Poné tu nombre!")
    try {
      const nuevoParticipante = { nombre: nuevoNombre, votos: misVotos }
      await updateDoc(doc(db, "asados", DOC_ID), {
        participantes: arrayUnion(nuevoParticipante)
      });
      setNuevoNombre("")
      setMisVotos({})
    } catch (error) {
      console.error(error)
      alert("Error al guardar")
    }
  }

  // --- NUEVA LÓGICA: Calcular totales ---
  const totales = FECHAS.map(fecha => {
    const total = participantes.filter(p => p.votos[fecha]).length;
    return { fecha, total }
  });

  // Encontrar el número máximo de votos para resaltar al ganador
  const maxVotos = Math.max(...totales.map(t => t.total));

  if (cargando) return <div className="loading">Cargando asado...</div>

  return (
    <div className="app-layout">
      
      {/* --- NUEVA BARRA LATERAL --- */}
      <aside className="sidebar">
        <h3>📊 Totales</h3>
        <div className="totales-list">
          {totales.map(t => (
            <div key={t.fecha} className={`total-item ${t.total > 0 && t.total === maxVotos ? 'ganador' : ''}`}>
              <span className="fecha-label">{t.fecha.split(" ")[0]}</span>
              <span className="conteo">{t.total} 👤</span>
            </div>
          ))}
        </div>
        <div className="resumen-final">
            Total confirmados: <strong>{participantes.length}</strong>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (Lo que ya tenías) */}
      <main className="main-content">
        <div className="header">
            <h1>🔥 {TITULO} 🔥</h1>
            <p className="subtitle">Marcá los días que podés:</p>
        </div>

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
          <button className="btn-enviar" onClick={enviarVoto}>CONFIRMAR Y SUBIR</button>
        </div>

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
      </main>
    </div>
  )
}

export default App