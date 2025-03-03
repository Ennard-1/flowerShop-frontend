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
  
      const associatedTags = response.data.map((tag) => tag.tagId);
      setSelectedTags(associatedTags);
      setInitialTags(associatedTags);
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
        ? prevSelectedTags.filter((id) => id !== tagId)
        : [...prevSelectedTags, tagId]
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

        for (const tagId of addedTags) {
          await api.post(`/tags/${product.id}/${tagId}`);
        }

        for (const tagId of removedTags) {
          await api.delete(`/product/${product.id}/${tagId}`);
        }
      } else {
        const response = await api.post("/products", updatedProduct);
        const newProductId = response.data.id;

        for (const tagId of selectedTags) {
          await api.post(`/tags/${newProductId}/${tagId}`);
        }
      }

      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        aria-labelledby="productModalLabel"
        aria-hidden={!isOpen}
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h5 className="text-lg font-semibold" id="productModalLabel">
              {product ? "Editar Produto" : "Adicionar Produto"}
            </h5>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSave} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  id="productDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

        

              <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
                  Preço
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  id="productPrice"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  id="productQuantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="flex justify-end space-x-4 mt-6">
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
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditProductDialog;
