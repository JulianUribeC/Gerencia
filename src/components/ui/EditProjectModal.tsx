import { useState, type KeyboardEvent } from 'react';
import { X, FolderKanban, DollarSign, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { INDUSTRY_LABELS, STATUS_LABELS } from '@/types';
import type { Project, Industry, ProjectStatus, Priority, CostEntry } from '@/types';

interface Props {
  project: Project;
  onClose: () => void;
}

type Tab = 'proyecto' | 'finanzas';

/* ── helpers ─────────────────────────────────────────── */
const field = (darkMode: boolean) =>
  cn(
    'w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors',
    darkMode
      ? 'bg-surface-800 border-surface-700/50 text-white placeholder:text-surface-200/30 focus:border-primary-500/60'
      : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary-500'
  );

const label = (darkMode: boolean) =>
  cn('block text-xs font-medium mb-1.5', darkMode ? 'text-surface-200/60' : 'text-gray-600');

const sectionHead = (darkMode: boolean, text: string) => (
  <p className={cn('text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
    {text}
  </p>
);

/* ── cost row ─────────────────────────────────────────── */
function CostRow({
  entry,
  darkMode,
  onChange,
  onDelete,
}: {
  entry: CostEntry;
  darkMode: boolean;
  onChange: (id: string, key: 'label' | 'amount', val: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={entry.label}
        onChange={(e) => onChange(entry.id, 'label', e.target.value)}
        placeholder="Concepto"
        className={cn(field(darkMode), 'flex-1')}
      />
      <div className="relative w-36 flex-shrink-0">
        <span className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-sm', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>$</span>
        <input
          type="number"
          value={entry.amount || ''}
          onChange={(e) => onChange(entry.id, 'amount', e.target.value)}
          placeholder="0"
          min="0"
          className={cn(field(darkMode), 'pl-6')}
        />
      </div>
      <button
        type="button"
        onClick={() => onDelete(entry.id)}
        className={cn(
          'p-2 rounded-lg transition-colors flex-shrink-0',
          darkMode ? 'text-surface-200/30 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── metric input ─────────────────────────────────────── */
function MetricInput({
  metricKey,
  label: lbl,
  unit,
  value,
  darkMode,
  onChange,
}: {
  metricKey: string;
  label: string;
  unit: string;
  value: number;
  darkMode: boolean;
  onChange: (key: string, val: number) => void;
}) {
  return (
    <div>
      <p className={cn('text-xs font-medium mb-1', darkMode ? 'text-surface-200/60' : 'text-gray-600')}>
        {lbl} <span className={cn('font-normal', darkMode ? 'text-surface-200/30' : 'text-gray-400')}>{unit}</span>
      </p>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(metricKey, parseFloat(e.target.value) || 0)}
        placeholder="0"
        min="0"
        className={field(darkMode)}
      />
    </div>
  );
}

/* ── main component ───────────────────────────────────── */
export function EditProjectModal({ project, onClose }: Props) {
  const { darkMode, clients, developers, updateProject } = useStore();

  /* ── tab ── */
  const [tab, setTab] = useState<Tab>('proyecto');

  /* ── proyecto fields ── */
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [clientId, setClientId] = useState(project.clientId);
  const [industry, setIndustry] = useState<Industry>(project.industry);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [priority, setPriority] = useState<Priority>(project.priority);
  const [budget, setBudget] = useState(String(project.budget));
  const [spent, setSpent] = useState(String(project.spent));
  const [startDate, setStartDate] = useState(project.startDate);
  const [endDate, setEndDate] = useState(project.endDate);
  const [progress, setProgress] = useState(String(project.progress));
  const [teamIds, setTeamIds] = useState<string[]>(project.teamIds);
  const [techStack, setTechStack] = useState<string[]>(project.techStack);
  const [techInput, setTechInput] = useState('');

  /* ── costos ── */
  const [fixedCosts, setFixedCosts] = useState<CostEntry[]>(
    project.fixedCosts.length ? project.fixedCosts : []
  );
  const [variableCosts, setVariableCosts] = useState<CostEntry[]>(
    project.variableCosts.length ? project.variableCosts : []
  );

  /* ── métricas económicas (editables manualmente) ── */
  const [metrics, setMetrics] = useState({ ...project.metrics });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── helpers costos ── */
  const addCost = (type: 'fixed' | 'variable') => {
    const entry: CostEntry = { id: `c${Date.now()}`, label: '', amount: 0 };
    if (type === 'fixed') setFixedCosts((p) => [...p, entry]);
    else setVariableCosts((p) => [...p, entry]);
  };

  const updateCost = (
    type: 'fixed' | 'variable',
    id: string,
    key: 'label' | 'amount',
    val: string
  ) => {
    const upd = (list: CostEntry[]) =>
      list.map((c) => (c.id === id ? { ...c, [key]: key === 'amount' ? parseFloat(val) || 0 : val } : c));
    if (type === 'fixed') setFixedCosts(upd);
    else setVariableCosts(upd);
  };

  const deleteCost = (type: 'fixed' | 'variable', id: string) => {
    if (type === 'fixed') setFixedCosts((p) => p.filter((c) => c.id !== id));
    else setVariableCosts((p) => p.filter((c) => c.id !== id));
  };

  const totalFixed = fixedCosts.reduce((s, c) => s + c.amount, 0);
  const totalVariable = variableCosts.reduce((s, c) => s + c.amount, 0);
  const totalCosts = totalFixed + totalVariable;

  /* ── helpers tech ── */
  const addTech = () => {
    const v = techInput.trim();
    if (v && !techStack.includes(v)) setTechStack((p) => [...p, v]);
    setTechInput('');
  };
  const handleTechKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech(); }
  };

  const toggleDev = (id: string) =>
    setTeamIds((p) => p.includes(id) ? p.filter((d) => d !== id) : [...p, id]);

  const updateMetric = (key: string, val: number) =>
    setMetrics((p) => ({ ...p, [key]: val }));

  /* ── auto-calc derived metrics from costs ── */
  const derivedMetrics = () => {
    const mrr = metrics.mrr || 0;
    const burnRate = Math.max(0, totalCosts - mrr);
    const runway = burnRate > 0 ? parseFloat(((metrics.cashBalance || 0) / burnRate).toFixed(1)) : 999;
    const fixedCostRatio = totalCosts > 0 ? parseFloat(((totalFixed / totalCosts) * 100).toFixed(1)) : 0;
    return { burnRate, runway, fixedCostRatio };
  };

  /* ── validate ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es requerido';
    if (!clientId) e.clientId = 'Selecciona un cliente';
    if (!budget || isNaN(Number(budget))) e.budget = 'Presupuesto inválido';
    if (!startDate) e.startDate = 'Requerido';
    if (!endDate) e.endDate = 'Requerido';
    if (startDate && endDate && endDate <= startDate) e.endDate = 'Debe ser posterior al inicio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) { setTab('proyecto'); return; }
    const derived = derivedMetrics();
    updateProject(project.id, {
      name: name.trim(),
      description: description.trim(),
      clientId,
      industry,
      status,
      priority,
      budget: Number(budget),
      spent: Number(spent) || 0,
      startDate,
      endDate,
      progress: Math.min(100, Math.max(0, Number(progress) || 0)),
      teamIds,
      techStack,
      fixedCosts,
      variableCosts,
      metrics: {
        ...metrics,
        burnRate: derived.burnRate,
        runway: derived.runway,
        fixedCostRatio: derived.fixedCostRatio,
      },
    });
    onClose();
  };

  /* ── shared tab button ── */
  const tabBtn = (t: Tab, icon: React.ReactNode, txt: string) => (
    <button
      onClick={() => setTab(t)}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
        tab === t
          ? 'bg-primary-500 text-white'
          : darkMode ? 'text-surface-200/60 hover:text-white hover:bg-surface-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      )}
    >
      {icon}
      {txt}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={cn(
        'relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl',
        darkMode ? 'bg-surface-900 border-surface-700/50' : 'bg-white border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between px-5 py-4 border-b flex-shrink-0',
          darkMode ? 'border-surface-700/50' : 'border-gray-200'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <h2 className={cn('text-base font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                Editar Proyecto
              </h2>
              <p className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>
                {project.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-surface-800 text-surface-200/50' : 'hover:bg-gray-100 text-gray-400')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={cn('flex gap-2 px-5 py-3 border-b flex-shrink-0', darkMode ? 'border-surface-700/50' : 'border-gray-200')}>
          {tabBtn('proyecto', <FolderKanban className="w-4 h-4" />, 'Proyecto')}
          {tabBtn('finanzas', <DollarSign className="w-4 h-4" />, 'Finanzas y Costos')}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5">

          {/* ── TAB: PROYECTO ───────────────────────── */}
          {tab === 'proyecto' && (
            <div className="space-y-5">
              {sectionHead(darkMode, 'Información general')}
              <div className="space-y-3">
                <div>
                  <p className={label(darkMode)}>Nombre *</p>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={field(darkMode)} />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <p className={label(darkMode)}>Descripción</p>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={cn(field(darkMode), 'resize-none')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={label(darkMode)}>Cliente *</p>
                    <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={field(darkMode)}>
                      <option value="">Seleccionar...</option>
                      {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.clientId && <p className="text-xs text-red-400 mt-1">{errors.clientId}</p>}
                  </div>
                  <div>
                    <p className={label(darkMode)}>Industria</p>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)} className={field(darkMode)}>
                      {(Object.entries(INDUSTRY_LABELS) as [Industry, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={label(darkMode)}>Estado</p>
                    <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className={field(darkMode)}>
                      {(Object.entries(STATUS_LABELS) as [ProjectStatus, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className={label(darkMode)}>Prioridad</p>
                    <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={field(darkMode)}>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className={label(darkMode)}>Fecha inicio *</p>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={field(darkMode)} />
                    {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <p className={label(darkMode)}>Fecha fin *</p>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={field(darkMode)} />
                    {errors.endDate && <p className="text-xs text-red-400 mt-1">{errors.endDate}</p>}
                  </div>
                  <div>
                    <p className={label(darkMode)}>Progreso (%)</p>
                    <input type="number" value={progress} onChange={(e) => setProgress(e.target.value)} min="0" max="100" className={field(darkMode)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={label(darkMode)}>Presupuesto (USD) *</p>
                    <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min="0" className={field(darkMode)} />
                    {errors.budget && <p className="text-xs text-red-400 mt-1">{errors.budget}</p>}
                  </div>
                  <div>
                    <p className={label(darkMode)}>Gastado (USD)</p>
                    <input type="number" value={spent} onChange={(e) => setSpent(e.target.value)} min="0" className={field(darkMode)} />
                  </div>
                </div>
              </div>

              {/* Equipo */}
              <div>
                {sectionHead(darkMode, 'Equipo')}
                <div className="grid grid-cols-2 gap-2">
                  {developers.map((dev) => {
                    const sel = teamIds.includes(dev.id);
                    return (
                      <button
                        key={dev.id}
                        type="button"
                        onClick={() => toggleDev(dev.id)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all text-sm',
                          sel
                            ? 'border-primary-500/60 bg-primary-500/10 text-primary-400'
                            : darkMode
                              ? 'border-surface-700/50 bg-surface-800/40 text-surface-200/70 hover:border-surface-600'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                          sel ? 'bg-primary-500 border-primary-500' : darkMode ? 'border-surface-600' : 'border-gray-300'
                        )}>
                          {sel && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
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
                {sectionHead(darkMode, 'Tech Stack')}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKey}
                    placeholder="Ej. React, Node.js... (Enter para agregar)"
                    className={cn(field(darkMode), 'flex-1')}
                  />
                  <button type="button" onClick={addTech} className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span key={t} className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', darkMode ? 'bg-surface-800 border-surface-700/50 text-surface-200/80' : 'bg-gray-100 border-gray-200 text-gray-700')}>
                      {t}
                      <button type="button" onClick={() => setTechStack((p) => p.filter((x) => x !== t))} className={cn('hover:text-red-400', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: FINANZAS ───────────────────────── */}
          {tab === 'finanzas' && (
            <div className="space-y-6">

              {/* Caja */}
              <div>
                {sectionHead(darkMode, 'Caja')}
                <div className="grid grid-cols-1 gap-3">
                  <MetricInput metricKey="cashBalance" label="Cash Balance" unit="(USD)" value={metrics.cashBalance} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Costos Fijos */}
              <div>
                {sectionHead(darkMode, 'Costos Fijos (mensuales)')}
                <div className="space-y-2">
                  {fixedCosts.map((c) => (
                    <CostRow key={c.id} entry={c} darkMode={darkMode} onChange={(id, k, v) => updateCost('fixed', id, k, v)} onDelete={(id) => deleteCost('fixed', id)} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addCost('fixed')}
                  className={cn(
                    'flex items-center gap-2 mt-2 px-3 py-2 rounded-lg border border-dashed text-sm transition-colors w-full justify-center',
                    darkMode ? 'border-surface-700 text-surface-200/40 hover:border-primary-500/50 hover:text-primary-400' : 'border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-600'
                  )}
                >
                  <Plus className="w-4 h-4" /> Agregar costo fijo
                </button>
                {fixedCosts.length > 0 && (
                  <div className={cn('flex justify-between items-center mt-2 px-2 text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    <span className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>Total costos fijos</span>
                    <span>${totalFixed.toLocaleString('en-US')}</span>
                  </div>
                )}
              </div>

              {/* Costos Variables */}
              <div>
                {sectionHead(darkMode, 'Costos Variables (mensuales)')}
                <div className="space-y-2">
                  {variableCosts.map((c) => (
                    <CostRow key={c.id} entry={c} darkMode={darkMode} onChange={(id, k, v) => updateCost('variable', id, k, v)} onDelete={(id) => deleteCost('variable', id)} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addCost('variable')}
                  className={cn(
                    'flex items-center gap-2 mt-2 px-3 py-2 rounded-lg border border-dashed text-sm transition-colors w-full justify-center',
                    darkMode ? 'border-surface-700 text-surface-200/40 hover:border-primary-500/50 hover:text-primary-400' : 'border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-600'
                  )}
                >
                  <Plus className="w-4 h-4" /> Agregar costo variable
                </button>
                {variableCosts.length > 0 && (
                  <div className={cn('flex justify-between items-center mt-2 px-2 text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    <span className={cn('text-xs', darkMode ? 'text-surface-200/50' : 'text-gray-500')}>Total costos variables</span>
                    <span>${totalVariable.toLocaleString('en-US')}</span>
                  </div>
                )}
              </div>

              {/* Resumen de costos auto-calculados */}
              {totalCosts > 0 && (
                <div className={cn('rounded-xl p-4 border', darkMode ? 'bg-surface-800/40 border-surface-700/30' : 'bg-gray-50 border-gray-200')}>
                  <p className={cn('text-xs font-semibold uppercase tracking-wider mb-3', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>
                    Auto-calculado al guardar
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Burn Rate', value: `$${Math.max(0, totalCosts - (metrics.mrr || 0)).toLocaleString('en-US')}`, note: 'Costos - MRR' },
                      { label: 'Fixed Cost Ratio', value: `${totalCosts > 0 ? ((totalFixed / totalCosts) * 100).toFixed(1) : 0}%`, note: 'Fijos / Total' },
                      { label: 'Runway', value: (() => { const burn = Math.max(1, totalCosts - (metrics.mrr || 0)); const r = (metrics.cashBalance || 0) / burn; return r >= 999 ? 'N/A' : `${r.toFixed(1)} meses`; })(), note: 'Caja / Burn Rate' },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className={cn('text-base font-bold', darkMode ? 'text-primary-400' : 'text-primary-600')}>{item.value}</p>
                        <p className={cn('text-xs font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{item.label}</p>
                        <p className={cn('text-xs', darkMode ? 'text-surface-200/40' : 'text-gray-400')}>{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingresos */}
              <div>
                {sectionHead(darkMode, 'Ingresos')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="mrr" label="MRR" unit="(USD/mes)" value={metrics.mrr} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="netRevenue" label="Net Revenue" unit="(USD)" value={metrics.netRevenue} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="revenueGrowthRate" label="Revenue Growth Rate" unit="(%)" value={metrics.revenueGrowthRate} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="arpu" label="ARPU" unit="(USD/usuario)" value={metrics.arpu} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="averageTicket" label="Ticket Promedio" unit="(USD)" value={metrics.averageTicket} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Rentabilidad */}
              <div>
                {sectionHead(darkMode, 'Rentabilidad')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="grossMargin" label="Margen Bruto" unit="(%)" value={metrics.grossMargin} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="appRoi" label="ROI del proyecto" unit="(%)" value={metrics.appRoi} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="breakEven" label="Break-even" unit="(unidades)" value={metrics.breakEven} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="contributionMargin" label="Margen de Contribución" unit="(USD)" value={metrics.contributionMargin} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Adquisición */}
              <div>
                {sectionHead(darkMode, 'Adquisición de Clientes')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="cac" label="CAC" unit="(USD/cliente)" value={metrics.cac} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="costPerLead" label="Costo por Lead" unit="(USD)" value={metrics.costPerLead} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="trialToPaidConversion" label="Conversión Trial → Pago" unit="(%)" value={metrics.trialToPaidConversion} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="activationRate" label="Tasa de Activación" unit="(%)" value={metrics.activationRate} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Usuarios y Retención */}
              <div>
                {sectionHead(darkMode, 'Usuarios y Retención')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="totalUsers" label="Total Usuarios" unit="" value={metrics.totalUsers} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="dauMauRatio" label="DAU/MAU Ratio" unit="(%)" value={metrics.dauMauRatio} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="churnRate" label="Churn Rate" unit="(%/mes)" value={metrics.churnRate} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="revenueChurn" label="Revenue Churn" unit="(%)" value={metrics.revenueChurn} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="retentionRate" label="Tasa de Retención" unit="(%)" value={metrics.retentionRate} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="averageLifetime" label="Vida Promedio del Cliente" unit="(meses)" value={metrics.averageLifetime} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Valor del Cliente */}
              <div>
                {sectionHead(darkMode, 'Valor del Cliente')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="ltv" label="LTV" unit="(USD)" value={metrics.ltv} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="ltvCacRatio" label="LTV/CAC" unit="(ratio)" value={metrics.ltvCacRatio} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="paybackPeriod" label="Payback Period" unit="(meses)" value={metrics.paybackPeriod} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Producto */}
              <div>
                {sectionHead(darkMode, 'Producto y Engagement')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="timeToActivation" label="Tiempo de Activación" unit="(días)" value={metrics.timeToActivation} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="featureAdoptionRate" label="Adopción de Features" unit="(%)" value={metrics.featureAdoptionRate} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="sessionFrequency" label="Frecuencia de Sesión" unit="(sesiones/usuario)" value={metrics.sessionFrequency} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>

              {/* Estratégica */}
              <div>
                {sectionHead(darkMode, 'Métricas Estratégicas')}
                <div className="grid grid-cols-2 gap-3">
                  <MetricInput metricKey="startupHealthScore" label="Startup Health Score" unit="(/100)" value={metrics.startupHealthScore} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="growthEfficiency" label="Growth Efficiency" unit="(ratio)" value={metrics.growthEfficiency} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="platformRiskIndex" label="Platform Risk Index" unit="(%)" value={metrics.platformRiskIndex} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="operationalLeverage" label="Apalancamiento Operativo" unit="(ratio)" value={metrics.operationalLeverage} darkMode={darkMode} onChange={updateMetric} />
                  <MetricInput metricKey="portfolioPerformanceIndex" label="Portfolio Performance" unit="(/100)" value={metrics.portfolioPerformanceIndex} darkMode={darkMode} onChange={updateMetric} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn(
          'flex items-center justify-end gap-3 px-5 py-4 border-t flex-shrink-0',
          darkMode ? 'border-surface-700/50' : 'border-gray-200'
        )}>
          <button
            onClick={onClose}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', darkMode ? 'bg-surface-800 text-surface-200/70 hover:bg-surface-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
