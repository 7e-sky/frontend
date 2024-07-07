import axios from "axios";

export default axios.create({
  //baseURL: `http://192.168.1.124:8000/`
  //baseURL: `http://192.168.11.108:8000/`,
  // baseURL: `https://it.3findustrie.com/`,
  baseURL: `http://127.0.0.1:8000/`,
});
