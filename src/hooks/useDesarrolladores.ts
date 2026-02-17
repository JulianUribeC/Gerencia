import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Desarrollador } from '../types/supabase'

export function useDesarrolladores() {
  const [desarrolladores, setDesarrolladores] = useState<Desarrollador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDesarrolladores()
  }, [])

  async function fetchDesarrolladores() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('desarrolladores')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      setDesarrolladores(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return { desarrolladores, loading, error, refetch: fetchDesarrolladores }
}
