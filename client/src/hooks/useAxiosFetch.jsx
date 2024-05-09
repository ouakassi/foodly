import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const source = axios.CancelToken.source();
    setIsLoading(true);

    try {
      const response = await axios.get(dataUrl, {
        cancelToken: source.token,
      });
      setData(response.data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
      setData(null); // Reset data to null on error
    } finally {
      setIsLoading(false);
    }

    return () => {
      source.cancel();
    };
  }, [dataUrl]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  return { data, fetchError, isLoading };
};

export default useAxiosFetch;
