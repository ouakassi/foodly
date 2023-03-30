import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export default API;
