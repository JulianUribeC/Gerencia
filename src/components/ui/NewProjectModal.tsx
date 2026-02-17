import { useState, type KeyboardEvent } from 'react';
import { X, FolderKanban, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { INDUSTRY_LABELS, STATUS_LABELS } from '@/types';
import type { Project, Industry, ProjectStatus, Priority } from '@/types';

interface NewProjectModalProps {
  onClose: () => void;
}

const EMPTY_METRICS = {
  cashBalance: 0, burnRate: 0, runway: 0, fixedCostRatio: 0,
  revenueConcentration: 0, mrr: 0, netRevenue: 0, revenueGrowthRate: 0,
  arpu: 0, averageTicket: 0, grossMargin: 0, appRoi: 0, breakEven: 0,
  contributionMargin: 0, cac: 0, costPerLead: 0, trialToPaidConversion: 0,
  activationRate: 0, churnRate: 0, revenueChurn: 0, retentionRate: 0,
  averageLifetime: 0, totalUsers: 0, dauMauRatio: 0, ltv: 0, ltvCacRatio: 0,
  paybackPeriod: 0, timeToActivation: 0, featureAdoptionRate: 0,
  sessionFrequency: 0, growthEfficiency: 0, startupHealthScore: 0,
  platformRiskIndex: 0, operationalLeverage: 0, portfolioPerformanceIndex: 0,
};

const inputClass = (darkMode: boolean) =>
  cn(
    'w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors',
    darkMode
      ? 'bg-surface-800 border-surface-700/50 text-white placeholder:text-surface-200/30 focus:border-primary-500/60'
      : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary-500'
  );

const labelClass = (darkMode: boolean) =>
  cn('block text-xs font-medium mb-1.5', darkMode ? 'text-surface-200/60' : 'text-gray-600');

const selectClass = (darkMode: boolean) =>
  cn(
    'w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors',
    darkMode
      ? 'bg-surface-800 border-surface-700/50 text-white focus:border-primary-500/60'
      : 'bg-white border-gray-200 text-gray-900 focus:border-primary-500'
  );

export function NewProjectModal({ onClose }: NewProjectModalProps) {
  const { darkMode, clients, developers, addProject } = useStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [industry, setIndustry] = useState<Industry>('saas');
  const [status, setStatus] = useState<ProjectStatus>('proposal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDev = (id: string) =>
    setTeamIds((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);

  const addTech = () => {
    const val = techInput.trim();
    if (val && !techStack.includes(val)) {
      setTechStack((prev) => [...prev, val]);
    }
    setTechInput('');
  };

  const handleTechKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech();
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es requerido';
    if (!clientId) e.clientId = 'Selecciona un cliente';
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) e.budget = 'Ingresa un presupuesto válido';
    if (!startDate) e.startDate = 'La fecha de inicio es requerida';
    if (!endDate) e.endDate = 'La fecha de fin es requerida';
    if (startDate && endDate && endDate <= startDate) e.endDate = 'La fecha de fin debe ser posterior al inicio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newProject: Project = {
      id: `p${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      clientId,
      industry,
      status,
      priority,
      budget: Number(budget),
      spent: 0,
      startDate,
      endDate,
      teamIds,
      milestones: [],
      progress: 0,
      techStack,
      metrics: EMPTY_METRICS,
      fixedCosts: [],
      variableCosts: [],
    };

    addProject(newProject);
    onClose();
  };

  const sectionTitle = (text: string) => (
    <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
      {text}
    </h3>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={cn(
        'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl',
        darkMode ? 'bg-surface-900 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          'sticky top-0 z-10 flex items-center justify-between p-5 border-b',
          darkMode ? 'bg-surface-900 border-surface-700/50' : 'bg-white border-gray-200'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                Nuevo Proyecto
              </h2>
              <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                Completa la información para registrar el proyecto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-surface-800 text-surface-200/60' : 'hover:bg-gray-100 text-gray-500')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Información general */}
          <div>
            {sectionTitle('Información general')}
            <div className="space-y-3">
              <div>
                <label className={labelClass(darkMode)}>Nombre del proyecto *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. BancoFlex Mobile App"
                  className={inputClass(darkMode)}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={labelClass(darkMode)}>Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el alcance y objetivo del proyecto..."
                  rows={3}
                  className={cn(inputClass(darkMode), 'resize-none')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass(darkMode)}>Cliente *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className={selectClass(darkMode)}
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.clientId && <p className="text-xs text-red-400 mt-1">{errors.clientId}</p>}
                </div>

                <div>
                  <label className={labelClass(darkMode)}>Industria</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Industry)}
                    className={selectClass(darkMode)}
                  >
                    {(Object.entries(INDUSTRY_LABELS) as [Industry, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y prioridad */}
          <div>
            {sectionTitle('Estado y prioridad')}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass(darkMode)}>Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className={selectClass(darkMode)}
                >
                  {(Object.entries(STATUS_LABELS) as [ProjectStatus, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass(darkMode)}>Prioridad</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className={selectClass(darkMode)}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fechas y presupuesto */}
          <div>
            {sectionTitle('Fechas y presupuesto')}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass(darkMode)}>Fecha de inicio *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass(darkMode)}
                />
                {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className={labelClass(darkMode)}>Fecha de fin *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass(darkMode)}
                />
                {errors.endDate && <p className="text-xs text-red-400 mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className={labelClass(darkMode)}>Presupuesto (USD) *</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={inputClass(darkMode)}
                />
                {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget}</p>}
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div>
            {sectionTitle('Equipo')}
            <div className="grid grid-cols-2 gap-2">
              {developers.map((dev) => {
                const selected = teamIds.includes(dev.id);
                return (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => toggleDev(dev.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all text-sm',
                      selected
                        ? 'border-primary-500/60 bg-primary-500/10 text-primary-400'
                        : darkMode
                          ? 'border-surface-700/50 bg-surface-800/40 text-surface-200/70 hover:border-surface-600'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                      selected ? 'bg-primary-500 border-primary-500' : darkMode ? 'border-surface-600' : 'border-gray-300'
                    )}>
                      {selected && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate">{dev.name}</p>
                      <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>{dev.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            {sectionTitle('Tech Stack')}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKey}
                placeholder="Ej. React, Node.js... (Enter para agregar)"
                className={cn(inputClass(darkMode), 'flex-1')}
              />
              <button
                type="button"
                onClick={addTech}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                      darkMode ? 'bg-surface-800 border-surface-700/50 text-surface-200/80' : 'bg-gray-100 border-gray-200 text-gray-700'
                    )}
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => setTechStack((prev) => prev.filter((t) => t !== tech))}
                      className={cn('hover:text-red-400 transition-colors', darkMode ? 'text-surface-200/40' : 'text-gray-400')}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.07)' : '#e5e7eb' }}>
            <button
              onClick={onClose}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                darkMode ? 'bg-surface-800 text-surface-200/70 hover:bg-surface-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              Crear Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
