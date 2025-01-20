import React, { useState } from "react";
import api from "../services/api";

const AddProductDialog = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Se o campo for "price", substituir vírgulas por pontos
        const formattedValue = name === "price" ? value.replace(",", ".") : value;
        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fazendo a requisição para criar o produto
            const response = await api.post("/products", formData);
            console.log("Produto criado com sucesso:", response.data);
            onClose(); // Fecha o modal após a criação do produto
        } catch (error) {
            console.error("Erro ao criar produto:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-backdrop">
            <div className="dialog">
                <h2>Adicionar Produto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Preço</label>
                        <input
                            type="text" // Alterado para texto para permitir entrada flexível (incluindo vírgulas)
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantidade</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductDialog;
