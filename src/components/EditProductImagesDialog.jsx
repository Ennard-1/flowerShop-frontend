import React, { useState, useEffect } from "react";
import api from "../services/api";

const UploadImageDialog = ({ product, isOpen, onClose }) => {
    const [imageFiles, setImageFiles] = useState([]); // Novas imagens para upload
    const [existingImages, setExistingImages] = useState([]); // Imagens do produto no backend

    // Resetar estados ao abrir um novo produto no modal
    useEffect(() => {
        if (isOpen && product) {
            setImageFiles([]); // Resetar imagens novas
            api.get(`/products/${product.id}/images`)
                .then((response) => {
                    const formattedImages = response.data.map((img) => ({
                        ...img,
                        imageUrl: `${api.defaults.baseURL}${img.image}`,
                    }));
                    setExistingImages(formattedImages);
                })
                .catch((error) => console.error("Erro ao buscar imagens:", error));
        }
    }, [isOpen, product]);

    // Resetar estados ao fechar o modal
    useEffect(() => {
        if (!isOpen) {
            setImageFiles([]);
            setExistingImages([]);
        }
    }, [isOpen]);
    // Adicionar novas imagens antes do upload
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prev) => [...prev, ...files]);
    };

    // Remover imagem antes do upload
    const handleRemoveNewImage = (index) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Remover imagem já existente do backend
    const handleRemoveExistingImage = async (img) => {
        try {
            console.log(img);
            await api.delete(img.image); // Certifique-se de que `img.image` contém a URL correta

            setExistingImages((prev) => prev.filter((image) => image.id !== img.id)); // Corrigido para remover a imagem correta
        } catch (error) {
            console.error("Erro ao remover imagem:", error);
        }
    };


    // Enviar imagens para o backend
    const handleSave = async () => {
        if (imageFiles.length === 0) {
            console.error("Nenhuma imagem para enviar");
            return;
        }

        try {
            for (const file of imageFiles) {
                const formData = new FormData();
                formData.append("image", file);

                await api.post(`/products/${product.id}/images`, formData);
            }

            console.log("Todas as imagens foram enviadas com sucesso!");
            onClose(); // Fecha o modal após o upload
        } catch (error) {
            console.error("Erro ao salvar imagens:", error);
        }
    };


    return (
        isOpen && (
            <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Gerenciar Imagens do Produto</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {/* Imagens existentes */}
                            <div>
                                <h6>Imagens já cadastradas:</h6>
                                <div className="d-flex flex-wrap">
                                    {existingImages.length > 0 ? (
                                        existingImages.map((img) => (
                                            <div key={img.id} className="position-relative m-2">
                                                <img
                                                    src={img.imageUrl}
                                                    alt="Imagem do produto"
                                                    className="img-thumbnail"
                                                    style={{ width: 100, height: 100, objectFit: "cover" }}
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                    onClick={() => handleRemoveExistingImage(img)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhuma imagem cadastrada</p>
                                    )}
                                </div>
                            </div>

                            {/* Imagens novas */}
                            <div className="mt-3">
                                <h6>Novas imagens selecionadas:</h6>
                                <div className="d-flex flex-wrap">
                                    {imageFiles.length > 0 ? (
                                        imageFiles.map((file, index) => (
                                            <div key={index} className="position-relative m-2">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Nova imagem"
                                                    className="img-thumbnail"
                                                    style={{ width: 100, height: 100, objectFit: "cover" }}
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                    onClick={() => handleRemoveNewImage(index)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhuma nova imagem selecionada</p>
                                    )}
                                </div>
                            </div>

                            {/* Upload */}
                            <input
                                type="file"
                                className="form-control mt-3"
                                accept="image/*"
                                multiple
                                onChange={handleAddImages}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleSave}>Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default UploadImageDialog;
