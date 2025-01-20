import React, { useState, useEffect } from "react";
import api from "../services/api";

const EditProductDialog = ({ product, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [initialTags, setInitialTags] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchTags();

      if (product) {
        setName(product.name || "");
        setDescription(product.description || "");
        setSlug(product.slug || "");
        setPrice(product.price || 0);
        setQuantity(product.quantity || 0);

        fetchProductTags(product.id);
      } else {
        resetForm();
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

  const fetchProductTags = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/tags`);
      console.log("Resposta da API de tags associadas ao produto:", response.data);
  
      // Extraindo apenas os IDs das tags associadas
      const associatedTags = response.data.map((tag) => tag.tagId);
      setSelectedTags(associatedTags);
      setInitialTags(associatedTags); // Define as tags iniciais para comparação
    } catch (error) {
      console.error("Erro ao buscar tags do produto:", error);
    }
  };
  

  const resetForm = () => {
    setName("");
    setDescription("");
    setSlug("");
    setPrice(0);
    setQuantity(0);
    setSelectedTags([]);
    setInitialTags([]);
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter((id) => id !== tagId) // Remove se já estiver presente
        : [...prevSelectedTags, tagId] // Adiciona se não estiver presente
    );
  };

  const handleSave = async () => {
    try {
      const addedTags = selectedTags.filter((id) => !initialTags.includes(id));
      const removedTags = initialTags.filter((id) => !selectedTags.includes(id));

      const updatedProduct = {
        name,
        description,
        slug,
        price,
        quantity,
      };

      if (product?.id) {
        await api.put(`/products/${product.id}`, updatedProduct);

        // Adiciona tags ao produto
        for (const tagId of addedTags) {
          await api.post(`/tags/${product.id}/${tagId}`);
        }

        // Remove tags do produto
        for (const tagId of removedTags) {
          await api.delete(`/product/${product.id}/${tagId}`);
        }
      } else {
        const response = await api.post("/products", updatedProduct);
        const newProductId = response.data.id;

        // Adiciona todas as tags ao novo produto
        for (const tagId of selectedTags) {
          await api.post(`/tags/${newProductId}/${tagId}`);
        }
      }

      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };


  return (
    isOpen && (
      <div
        className="modal fade show"
        style={{ display: isOpen ? "block" : "none" }}
        aria-labelledby="productModalLabel"
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="productModalLabel">
                {product ? "Editar Produto" : "Adicionar Produto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Nome:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">
                    Descrição:
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productSlug" className="form-label">
                    Slug:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productSlug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Preço:
                  </label>
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
                  <label htmlFor="productQuantity" className="form-label">
                    Quantidade:
                  </label>
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
                          checked={selectedTags.includes(tag.id)} // Verifica a seleção
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default EditProductDialog;
