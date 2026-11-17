import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import { errorMessage } from '../lib/api';
import { formatDateTime } from '../lib/format';
import { getBooking } from '../lib/services';
import type { Booking } from '../lib/types';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = Number(id);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      setError('El ID de reserva no es valido.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');
    getBooking(bookingId)
      .then((data) => {
        if (!cancelled) setBooking(data);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Detalle de reserva</h1>
          <p className="muted">Reserva #{id}</p>
        </div>
        <Link className="btn btn-ghost" to="/bookings">
          Volver a mis reservas
        </Link>
      </header>

      {loading && <p className="muted">Cargando reserva...</p>}
      {error && <Alert kind="error">{error}</Alert>}

      {booking && (
        <section className="card">
          <div className="detail-head">
            <div>
              <p className="detail-label">Vuelo</p>
              <p className="detail-flight">{booking.flightNumber}</p>
              <p className="muted">{booking.airlineName}</p>
            </div>
            <span className="badge badge-ok">Confirmada</span>
          </div>

          <dl className="detail-grid">
            <div>
              <dt>Salida estimada</dt>
              <dd>{formatDateTime(booking.estDepartureTime)}</dd>
            </div>
            <div>
              <dt>Llegada estimada</dt>
              <dd>{formatDateTime(booking.estArrivalTime)}</dd>
            </div>
            <div>
              <dt>Fecha de reserva</dt>
              <dd>{formatDateTime(booking.bookingDate)}</dd>
            </div>
            <div>
              <dt>Pasajero</dt>
              <dd>
                {booking.customerFirstName} {booking.customerLastName}
              </dd>
            </div>
            <div>
              <dt>ID de reserva</dt>
              <dd>#{booking.id}</dd>
            </div>
            <div>
              <dt>ID de vuelo</dt>
              <dd>#{booking.flightId}</dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
