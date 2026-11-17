import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { errorMessage } from '../lib/api';
import { register } from '../lib/services';

interface FieldErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!form.email.trim()) errors.email = 'El email es obligatorio.';
    if (!form.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
    if (!form.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
    if (!form.password) errors.password = 'La contrasena es obligatoria.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { id } = await register({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
      });
      setSuccess(`Cuenta creada con exito (ID ${id}). Redirigiendo al login...`);
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setServerError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="card">
        <h1>Crear cuenta</h1>
        <p className="muted">Registrate para reservar vuelos con Fly Away Travel.</p>

        {serverError && <Alert kind="error">{serverError}</Alert>}
        {success && <Alert kind="success">{success}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="nombre.apellido@utec.edu.pe"
              autoComplete="email"
            />
            {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          </label>

          <div className="field-row">
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Ana"
                autoComplete="given-name"
              />
              {fieldErrors.firstName && (
                <small className="field-error">{fieldErrors.firstName}</small>
              )}
            </label>

            <label className="field">
              <span>Apellido</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Garcia"
                autoComplete="family-name"
              />
              {fieldErrors.lastName && (
                <small className="field-error">{fieldErrors.lastName}</small>
              )}
            </label>
          </div>

          <label className="field">
            <span>Contrasena</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Minimo 8 caracteres"
              autoComplete="new-password"
            />
            {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
            <small className="hint">
              8+ caracteres, al menos una mayuscula y un digito. Nombre y apellido deben empezar con
              mayuscula.
            </small>
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="muted center">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </section>
    </div>
  );
}
