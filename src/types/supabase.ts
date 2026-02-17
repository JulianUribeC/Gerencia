export interface Cliente {
  id: string
  nombre: string
  empresa?: string
  email?: string
  telefono?: string
  industria?: string
  valor_lifetime: number
  created_at: string
  updated_at: string
}

export interface Proyecto {
  id: string
  nombre: string
  cliente_id?: string
  industria?: string
  presupuesto?: number
  estado: 'Propuesta' | 'En desarrollo' | 'Testing' | 'Completado'
  fecha_inicio?: string
  fecha_fin?: string
  progreso: number
  descripcion?: string
  created_at: string
  updated_at: string
}

export interface Desarrollador {
  id: string
  nombre: string
  email?: string
  rol?: string
  skills?: string[]
  disponibilidad: number
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Asignacion {
  id: string
  proyecto_id: string
  desarrollador_id: string
  horas_asignadas?: number
  created_at: string
}