import React, { useState } from "react";
import api from "../services/api";

const UploadImageDialog = ({ product, isOpen, onClose }) => {
    const [image, setImage] = useState(null);

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            console.log(file)
        }
    };

    const handleRemoveImage = () => {
        setImage(null); // Remove a imagem selecionada
    };

    const handleSave = async () => {
        if (!image) {
            console.error("Nenhuma imagem selecionada");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", image);
            await api.post(`/products/${product.id}/images`, formData);
            onClose(); // Fecha o modal após o upload
        } catch (error) {
            console.error("Erro ao salvar imagem do produto:", error);
        }
    };

    return (
        isOpen && (
            <div
                className="modal fade show"
                style={{ display: isOpen ? "block" : "none" }}
                aria-labelledby="imagesModalLabel"
                aria-hidden={!isOpen}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="imagesModalLabel">
                                Upload de Imagem do Produto
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Imagem:</label>
                                {image ? (
                                    <div className="position-relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Imagem"
                                            className="img-thumbnail"
                                            style={{ width: 100, height: 100, objectFit: "cover" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                            onClick={handleRemoveImage}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ) : (
                                    <p>Nenhuma imagem selecionada</p>
                                )}
                                <input
                                    type="file"
                                    className="form-control mt-2"
                                    accept="image/*"
                                    onChange={handleAddImage}
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

export default UploadImageDialog;
