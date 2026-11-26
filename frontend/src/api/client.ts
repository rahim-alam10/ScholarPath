import { env } from '../config/env';
import { startTrackedRequest } from './requestActivity';

type RequestOptions = Omit<RequestInit, 'headers' | 'signal'> & {
  headers?: Record<string, string>;
};

const requestTimeoutMs = 20_000;

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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(new URL(path, env.apiBaseUrl), {
      ...options,
      signal: controller.signal,
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
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ApiError(
        'The request timed out. Check that the backend is running and reachable from your device.',
        408,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    finishRequest();
  }
}
