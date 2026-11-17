import api from './api';
import type {
  Booking,
  CreatedResponse,
  Flight,
  FlightSearchParams,
  FlightSearchResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from './types';

export async function register(body: RegisterRequest): Promise<CreatedResponse> {
  const { data } = await api.post<CreatedResponse>('/users/register', body);
  return data;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/users/current');
  return data;
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  const { data } = await api.get<FlightSearchResponse>('/flights/search', { params });
  return data.items ?? [];
}

export async function bookFlight(flightId: number): Promise<CreatedResponse> {
  const { data } = await api.post<CreatedResponse>('/flights/book', { flightId });
  return data;
}

export async function getBooking(id: number): Promise<Booking> {
  const { data } = await api.get<Booking>(`/flights/book/${id}`);
  return data;
}
