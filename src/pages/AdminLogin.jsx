import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importando o hook para navegação
import api from "../services/api";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/login", { password: password });
      const { token } = response.data;

      // Salvar o token no localStorage ou outra forma de persistência
      localStorage.setItem("token", token);
      setSuccess("Login realizado com sucesso!");

      // Redirecionar para a página de edição de produtos
      navigate("/admin/editar-produtos");
    } catch (err) {
      setError("Senha incorreta.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold">Admin Login</h5>
        </div>

        <div className="p-6">
          {error && (
            <div className="alert alert-danger text-sm text-red-600 mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success text-sm text-green-600 mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="w-full px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                Entrar
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-end space-x-4 mt-6 p-4 border-t">
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
