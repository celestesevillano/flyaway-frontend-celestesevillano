import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Alert from '../components/Alert';
import { errorMessage } from '../lib/api';
import { useAuth } from '../lib/auth';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from ?? '/search';

  if (isAuthenticated) {
    return <Navigate to="/search" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Completa tu email y contrasena.');
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="card">
        <h1>Iniciar sesion</h1>
        <p className="muted">Accede para reservar vuelos y ver tus reservas.</p>

        {searchParams.get('expired') && (
          <Alert kind="info">Tu sesion termino. Vuelve a iniciar sesion.</Alert>
        )}
        {error && <Alert kind="error">{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana.garcia@utec.edu.pe"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>Contrasena</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password1"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="muted center">
          No tienes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </section>
    </div>
  );
}
