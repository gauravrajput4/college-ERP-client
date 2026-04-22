import { useEffect, useState } from "react";

const useFetch = (apiFn, deps = [], options = {}) => {
  const [data, setData] = useState(options.initialData ?? null);
  const [loading, setLoading] = useState(options.immediate !== false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate === false) return;
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, execute, setData };
};

export default useFetch;
