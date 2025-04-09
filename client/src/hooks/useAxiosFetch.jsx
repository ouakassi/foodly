import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl, params = {}) => {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
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
        setFetchError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          setFetchError(`Error: ${err.message}`);
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
    fetchError,
    isLoading,
    refetch,
  };
};

export default useAxiosFetch;
