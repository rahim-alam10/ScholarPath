import { env } from '../config/env';
import { startTrackedRequest } from './requestActivity';

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!env.apiBaseUrl) {
    throw new Error('EXPO_PUBLIC_API_URL must be configured before making API requests.');
  }

  const finishRequest = startTrackedRequest();
  try {
    const response = await fetch(new URL(path, env.apiBaseUrl), {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: unknown } | null;
      throw new ApiError(
        typeof body?.error === 'string' ? body.error : 'API request failed.',
        response.status,
      );
    }

    return await response.json() as T;
  } finally {
    finishRequest();
  }
}
