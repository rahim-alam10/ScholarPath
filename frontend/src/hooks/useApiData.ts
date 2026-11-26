import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';

type ApiDataState<T> = {
  path: string;
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApiData<T>(path: string): ApiDataState<T> {
  const [state, setState] = useState<ApiDataState<T>>({
    path: '',
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    apiRequest<T>(path)
      .then((data) => {
        if (active) setState({ path, data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          path,
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load data.',
        });
      });

    return () => {
      active = false;
    };
  }, [path]);

  return state.path === path
    ? state
    : { path, data: null, loading: true, error: null };
}