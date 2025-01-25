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
        const formattedValue = name === "price" ? value.replace(",", ".") : value;
        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/products", formData);
            console.log("Produto criado com sucesso");
            onClose(); // Fecha o modal após a criação do produto
        } catch (error) {
            console.error("Erro ao criar produto:", error);
        }
    };

    return (
        isOpen && (
            <div
                className="modal fade show"
                style={{ display: isOpen ? "block" : "none" }}
                aria-labelledby="addProductModalLabel"
                aria-hidden={!isOpen}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addProductModalLabel">
                                Adicionar Produto
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Descrição
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">
                                        Preço
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">
                                        Quantidade
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
};

export default AddProductDialog;
