import axios from 'axios';

// Criando uma instância do Axios
const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Interceptor para adicionar o token no cabeçalho de cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pegando o token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Verifica se a requisição é do tipo multipart/form-data (upload de arquivos)
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
