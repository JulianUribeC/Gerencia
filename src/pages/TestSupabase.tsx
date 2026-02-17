import { useProyectos } from '../hooks/useProyectos'
import { useClientes } from '../hooks/useClientes'
import { useDesarrolladores } from '../hooks/useDesarrolladores'

export default function TestSupabase() {
  const { proyectos, loading: loadingP, error: errorP } = useProyectos()
  const { clientes, loading: loadingC, error: errorC } = useClientes()
  const { desarrolladores, loading: loadingD, error: errorD } = useDesarrolladores()

  if (loadingP || loadingC || loadingD) return <div className='p-8'>Cargando datos de Supabase...</div>

  return (
    <div className='p-8 space-y-8'>
      <h1 className='text-3xl font-bold'>Test de Conexión con Supabase</h1>
      
      {errorP && <div className='text-red-500'>Error proyectos: {errorP}</div>}
      {errorC && <div className='text-red-500'>Error clientes: {errorC}</div>}
      {errorD && <div className='text-red-500'>Error desarrolladores: {errorD}</div>}

      <div>
        <h2 className='text-2xl font-semibold mb-4'>Proyectos ({proyectos.length})</h2>
        <pre className='bg-gray-100 p-4 rounded overflow-auto'>
          {JSON.stringify(proyectos, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className='text-2xl font-semibold mb-4'>Clientes ({clientes.length})</h2>
        <pre className='bg-gray-100 p-4 rounded overflow-auto'>
          {JSON.stringify(clientes, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className='text-2xl font-semibold mb-4'>Desarrolladores ({desarrolladores.length})</h2>
        <pre className='bg-gray-100 p-4 rounded overflow-auto'>
          {JSON.stringify(desarrolladores, null, 2)}
        </pre>
      </div>
    </div>
  )
}
