import api from './api';
import type {
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
