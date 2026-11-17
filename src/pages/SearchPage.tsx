import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { errorMessage } from '../lib/api';
import { useAuth } from '../lib/auth';
import { addBookingId } from '../lib/bookingStorage';
import { formatDateTime, toIsoOrUndefined } from '../lib/format';
import { bookFlight, searchFlights } from '../lib/services';
import type { Flight } from '../lib/types';

interface BookingResult {
  flightId: number;
  bookingId: number;
}

export default function SearchPage() {
  const { isAuthenticated, user } = useAuth();

  const [flightNumber, setFlightNumber] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [departureFrom, setDepartureFrom] = useState('');
  const [departureTo, setDepartureTo] = useState('');

  const [flights, setFlights] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  async function runSearch() {
    setLoading(true);
    setSearchError('');
    setBookingError('');
    setBookingResult(null);
    try {
      const items = await searchFlights({
        flightNumber: flightNumber.trim() || undefined,
        airlineName: airlineName.trim() || undefined,
        estDepartureTimeFrom: toIsoOrUndefined(departureFrom),
        estDepartureTimeTo: toIsoOrUndefined(departureTo),
      });
      setFlights(items);
    } catch (err) {
      setFlights([]);
      setSearchError(errorMessage(err));
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    void runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void runSearch();
  }

  function clearFilters() {
    setFlightNumber('');
    setAirlineName('');
    setDepartureFrom('');
    setDepartureTo('');
  }

  async function handleBook(flight: Flight) {
    setBookingError('');
    setBookingResult(null);
    setBookingFlightId(flight.id);
    try {
      const { id } = await bookFlight(flight.id);
      setBookingResult({ flightId: flight.id, bookingId: id });
      if (user?.email) addBookingId(user.email, id);
      setFlights((prev) =>
        prev.map((f) =>
          f.id === flight.id ? { ...f, availableSeats: Math.max(0, f.availableSeats - 1) } : f,
        ),
      );
    } catch (err) {
      setBookingError(`No se pudo reservar ${flight.flightNumber}: ${errorMessage(err)}`);
    } finally {
      setBookingFlightId(null);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Buscar vuelos</h1>
          <p className="muted">
            Filtra por numero de vuelo, aerolinea o rango de fechas de salida.
          </p>
        </div>
      </header>

      <section className="card">
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Numero de vuelo</span>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="LA101"
            />
          </label>

          <label className="field">
            <span>Aerolinea</span>
            <input
              type="text"
              value={airlineName}
              onChange={(e) => setAirlineName(e.target.value)}
              placeholder="LATAM"
            />
          </label>

          <label className="field">
            <span>Salida desde</span>
            <input
              type="datetime-local"
              value={departureFrom}
              onChange={(e) => setDepartureFrom(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Salida hasta</span>
            <input
              type="datetime-local"
              value={departureTo}
              onChange={(e) => setDepartureTo(e.target.value)}
            />
          </label>

          <div className="search-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        </form>
      </section>

      {searchError && <Alert kind="error">{searchError}</Alert>}
      {bookingError && <Alert kind="error">{bookingError}</Alert>}
      {bookingResult && (
        <Alert kind="success">
          Reserva confirmada. ID de reserva: <strong>#{bookingResult.bookingId}</strong>{' '}
          <Link to={`/bookings/${bookingResult.bookingId}`}>Ver detalle</Link>
        </Alert>
      )}
      {!isAuthenticated && (
        <Alert kind="info">
          <Link to="/login">Inicia sesion</Link> para poder reservar un vuelo.
        </Alert>
      )}

      <section className="card">
        {loading && <p className="muted">Cargando vuelos...</p>}

        {!loading && searched && flights.length === 0 && !searchError && (
          <div className="empty-state">
            <p className="empty-title">No encontramos vuelos con esos filtros</p>
            <p className="muted">Prueba con otro numero de vuelo, otra aerolinea u otras fechas.</p>
          </div>
        )}

        {!loading && flights.length > 0 && (
          <>
            <p className="muted result-count">
              {flights.length} vuelo{flights.length === 1 ? '' : 's'} encontrado
              {flights.length === 1 ? '' : 's'}
            </p>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Aerolinea</th>
                    <th>Salida</th>
                    <th>Llegada</th>
                    <th>Asientos</th>
                    {isAuthenticated && <th aria-label="Acciones" />}
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id}>
                      <td>
                        <strong>{flight.flightNumber}</strong>
                      </td>
                      <td>{flight.airlineName}</td>
                      <td>{formatDateTime(flight.estDepartureTime)}</td>
                      <td>{formatDateTime(flight.estArrivalTime)}</td>
                      <td>
                        <span className={flight.availableSeats > 0 ? 'badge' : 'badge badge-muted'}>
                          {flight.availableSeats}
                        </span>
                      </td>
                      {isAuthenticated && (
                        <td className="cell-actions">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => void handleBook(flight)}
                            disabled={bookingFlightId === flight.id}
                          >
                            {bookingFlightId === flight.id ? 'Reservando...' : 'Reservar'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
