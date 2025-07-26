import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl, params = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (cancelToken) => {
      setIsLoading(true);
      try {
        const response = await axios.get(dataUrl, {
          params,
          cancelToken,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          setError(`Error: ${err.message}`);
          setData(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dataUrl, JSON.stringify(params)] // Make sure it's stable
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchData(source.token);

    return () => {
      source.cancel("Request canceled by the user.");
    };
  }, [fetchData]);

  const refetch = () => {
    const source = axios.CancelToken.source();
    fetchData(source.token);
  };

  return {
    data,
    error,
    isLoading,
    refetch,
  };
};

export default useAxiosFetch;
