import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { axiosPrivate } from "../api/api";

const useAxiosFetch = (dataUrl, params = {}, usePrivate = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Choose between private (authenticated) or public axios instance
  const axiosInstance = usePrivate ? axiosPrivate : axios;

  const fetchData = useCallback(
    async (cancelToken) => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(dataUrl, {
          params,
          cancelToken,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          // Better error handling
          const errorMessage =
            err.response?.data?.message || err.message || "An error occurred";
          setError(`Error: ${errorMessage}`);
          setData(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dataUrl, JSON.stringify(params), axiosInstance]
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
