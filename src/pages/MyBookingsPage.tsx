import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { useAuth } from '../lib/auth';
import { getBookingIds, removeBookingId } from '../lib/bookingStorage';
import { formatDateTime } from '../lib/format';
import { getBooking } from '../lib/services';
import type { Booking } from '../lib/types';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [missing, setMissing] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);

    const ids = getBookingIds(user.email);
    const results = await Promise.allSettled(ids.map((id) => getBooking(id)));

    const found: Booking[] = [];
    let lost = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        found.push(result.value);
      } else {
        lost += 1;
        removeBookingId(user.email, ids[index]);
      }
    });

    found.sort((a, b) => a.estDepartureTime.localeCompare(b.estDepartureTime));
    setBookings(found);
    setMissing(lost);
    setLoading(false);
  }, [user?.email]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Mis reservas</h1>
          <p className="muted">
            {user ? `Reservas de ${user.firstName} ${user.lastName}` : 'Tus reservas guardadas'}
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => void load()}>
          Actualizar
        </button>
      </header>

      {missing > 0 && (
        <Alert kind="info">
          {missing} reserva{missing === 1 ? '' : 's'} ya no existe{missing === 1 ? '' : 'n'} en el
          servidor (el backend se reinicio) y se quitaron de la lista.
        </Alert>
      )}

      <section className="card">
        {loading && <p className="muted">Cargando reservas...</p>}

        {!loading && bookings.length === 0 && (
          <div className="empty-state">
            <p className="empty-title">Todavia no tienes reservas</p>
            <p className="muted">
              Ve a <Link to="/search">buscar vuelos</Link> y reserva el que prefieras.
            </p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Reserva</th>
                  <th>Numero de vuelo</th>
                  <th>Aerolinea</th>
                  <th>Fecha de salida</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>
                      <strong>{booking.flightNumber}</strong>
                    </td>
                    <td>{booking.airlineName}</td>
                    <td>{formatDateTime(booking.estDepartureTime)}</td>
                    <td className="cell-actions">
                      <Link className="btn btn-primary btn-sm" to={`/bookings/${booking.id}`}>
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
