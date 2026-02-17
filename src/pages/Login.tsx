import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Briefcase, User, Lock, Mail, X, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password flow
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }
    setLoading(true);
    // Small artificial delay for UX
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(username.trim(), password);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Usuario o contraseña incorrectos.');
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setForgotSent(false);
    await new Promise((r) => setTimeout(r, 800));
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-surface-700/50">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg shadow-primary-500/25">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Terranova Tech</h1>
            <p className="text-sm text-surface-200/50 mt-1">Plataforma de Gerencia</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-xs font-medium text-surface-200/60 mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="gerenciaTerranova"
                  autoComplete="username"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg border bg-surface-800 text-white text-sm outline-none transition-colors placeholder:text-surface-200/25',
                    error
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-surface-700/50 focus:border-primary-500/60'
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-200/60 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 rounded-lg border bg-surface-800 text-white text-sm outline-none transition-colors placeholder:text-surface-200/25',
                    error
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-surface-700/50 focus:border-primary-500/60'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-200/30 hover:text-surface-200/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                loading
                  ? 'bg-primary-500/50 text-white/50 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30'
              )}
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            {/* Forgot password */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setShowForgot(true); setForgotSent(false); }}
                className="text-xs text-surface-200/40 hover:text-primary-400 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-surface-200/20 mt-6">
          © {new Date().getFullYear()} Terranova Tech · Acceso restringido
        </p>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForgot(false)} />
          <div className="relative w-full max-w-sm bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-200/40 hover:text-white hover:bg-surface-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Restaurar contraseña</h2>
                <p className="text-xs text-surface-200/50">Se enviará un correo de recuperación</p>
              </div>
            </div>

            {!forgotSent ? (
              <>
                <p className="text-sm text-surface-200/60 mb-5">
                  Se enviará un enlace de recuperación al correo registrado:
                </p>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-700/50 mb-5">
                  <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-white">julian_u@hotmail.com</span>
                </div>
                <button
                  onClick={handleForgot}
                  className="w-full py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                >
                  Enviar correo de recuperación
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/15 mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">¡Correo enviado!</p>
                <p className="text-xs text-surface-200/50">
                  Revisa <span className="text-primary-400">julian_u@hotmail.com</span> para recuperar tu acceso.
                </p>
                <button
                  onClick={() => setShowForgot(false)}
                  className="mt-5 px-5 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200/70 text-sm font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
