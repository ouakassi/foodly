import { useState, useEffect, useCallback } from "react";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const useAxios = ({ url, method, body = null, headers = null }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = useCallback(() => {
    axios[method](url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  }, [method, url, body, headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData, method, url, body, headers]);

  return { data, error, loading };
};
