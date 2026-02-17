import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Cliente } from '../types/supabase'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      setClientes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return { clientes, loading, error, refetch: fetchClientes }
}
