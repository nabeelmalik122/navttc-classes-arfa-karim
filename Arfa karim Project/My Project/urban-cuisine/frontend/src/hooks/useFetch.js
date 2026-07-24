import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Generic data-fetching hook.
 * @param {string} url   - API endpoint (relative to /api)
 * @param {object} [opts]
 * @param {object} [opts.params] - Query params object
 * @param {boolean} [opts.skip] - Skip initial fetch
 * @returns {{ data, loading, error, refetch }}
 */
const useFetch = (url, opts = {}) => {
  const { params, skip = false } = opts;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params });
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    if (!skip) fetchData();
  }, [fetchData, skip]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
