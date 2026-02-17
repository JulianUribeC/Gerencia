import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Proyecto } from '../types/supabase'

export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProyectos()
  }, [])

  async function fetchProyectos() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProyectos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return { proyectos, loading, error, refetch: fetchProyectos }
}
