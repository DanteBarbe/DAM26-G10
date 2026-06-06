/**
 * cliente HTTP centralizado para todos los requests a la API.
 *
 * - base URL configurable via EXPO_PUBLIC_API_URL
 * - inyecta el Bearer token automáticamente cuando el usuario está autenticado
 * - lanza objetos { status, message } en caso de error HTTP
 *
 * NOTA en desarrollo: si corrés en emulador Android usá http://10.0.2.2:3000
 * Si corrés en dispositivo físico usá la IP de tu máquina (ej: http://192.168.1.x:3000)
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(res.status, 'Respuesta inválida del servidor.');
  }

  if (!res.ok) {
    throw new ApiError(res.status, json?.error ?? json?.message ?? 'Error del servidor.');
  }

  return json as T;
}
