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
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      } else {
        setFetchError(`Error: ${err.message}`); // Set a more descriptive error message
        setData(null); // Reset data in case of error
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      source.cancel("Request canceled by the user.");
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
