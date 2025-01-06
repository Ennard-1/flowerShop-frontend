import axios from 'axios';

// Criando uma instância do Axios
const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:3000/api' // URL da API no ambiente de desenvolvimento
    : '', // Caminho relativo no ambiente de produção
});

// Interceptor para adicionar o token no cabeçalho de cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pegando o token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
