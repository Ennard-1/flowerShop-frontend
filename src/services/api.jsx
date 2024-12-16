import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:3000/api' // URL da API no ambiente de desenvolvimento
    : '', // Caminho relativo no ambiente de produção
});

export default api;
