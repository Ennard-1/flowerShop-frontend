import React, { useState, useEffect } from "react";
import api from "../services/api";

const TagManagerDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");

  // Fetch todas as tags ao carregar o componente
  const fetchTags = async () => {
    try {
      const response = await api.get("/tag");
      setTags(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Criar uma nova tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return; // Evitar criar tags vazias
    try {
      const response = await api.post("/tag", { name: newTagName });
      setTags((prev) => [...prev, response.data]); // Adicionar a nova tag na lista
      setNewTagName(""); // Limpar o campo de entrada
    } catch (error) {
      console.error("Erro ao criar tag:", error);
    }
  };

  // Deletar uma tag
  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tag/${tagId}`);
      setTags((prev) => prev.filter((tag) => tag.id !== tagId)); // Remover a tag da lista
    } catch (error) {
      console.error("Erro ao deletar tag:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      aria-hidden={!isOpen}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold">Gerenciar Tags</h5>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4">
          {/* Nova Tag */}
          <div>
            <label htmlFor="newTagName" className="block text-sm font-medium text-gray-700">
              Nova Tag
            </label>
            <input
              type="text"
              id="newTagName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <button
              type="button"
              className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleCreateTag}
            >
              Adicionar Tag
            </button>
          </div>

          {/* Lista de Tags */}
          <ul className="space-y-2">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
              >
                {tag.name}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </form>

        <div className="flex justify-end space-x-4 mt-6 p-4 border-t">
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagManagerDialog;
