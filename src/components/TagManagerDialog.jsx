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
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gerenciar Tags</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="newTagName" className="form-label">
                Nova Tag
              </label>
              <input
                type="text"
                id="newTagName"
                className="form-control"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleCreateTag}
              >
                Adicionar Tag
              </button>
            </div>
            <ul className="list-group">
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {tag.name}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManagerDialog;
