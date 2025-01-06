import React, { useState, useEffect } from "react";
import api from "../services/api";

const EditProductDialog = ({ product, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Carregar todas as tags disponíveis ao abrir o dialog
  useEffect(() => {
    if (isOpen) {
      fetchTags();
      if (product?.tags) {
        // Se o produto já tiver tags, setar as tags selecionadas com base nisso
        const productTagIds = product.tags.map(tag => tag.id);
        setSelectedTags(productTagIds);
      }
    }
  }, [isOpen, product]);

  const fetchTags = async () => {
    try {
      const response = await api.get("/tag");
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Erro ao buscar tags:", error);
    }
  };

  const handleTagChange = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProduct = {
        name,
        description,
        price,
        quantity,
        tags: selectedTags, // Passando as tags selecionadas diretamente
      };

      console.log(updatedProduct)
      if (product?.id) {
        await api.put(`/products/${product.id}`, updatedProduct);
      } else {
        const response = await api.post("/products", updatedProduct);
      }

      onSave(); // Atualiza a lista de produtos no componente pai
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    isOpen && (
      <div className="modal fade show" style={{ display: isOpen ? 'block' : 'none' }} aria-labelledby="productModalLabel" aria-hidden={!isOpen}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="productModalLabel">{product ? "Editar Produto" : "Adicionar Produto"}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Nome:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">Descrição:</label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">Preço:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="productPrice"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productQuantity" className="form-label">Quantidade:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="productQuantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <div key={tag.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleTagChange(tag.id)}
                          id={`tag${tag.id}`}
                        />
                        <label className="form-check-label" htmlFor={`tag${tag.id}`}>
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Salvar</button>
            </div>
          </div>
        </div>
      </div>

    )
  );
};

export default EditProductDialog;
