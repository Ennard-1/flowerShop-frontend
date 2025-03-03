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
            <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
                aria-hidden={!isOpen}
            >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h5 className="text-lg font-semibold">
                            Gerenciar Imagens do Produto
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

                    <div className="p-6">
                        {/* Imagens existentes */}
                        <div>
                            <h6 className="text-sm font-medium text-gray-700">Imagens já cadastradas:</h6>
                            <div className="flex flex-wrap gap-2">
                                {existingImages.length > 0 ? (
                                    existingImages.map((img) => (
                                        <div key={img.id} className="relative m-2">
                                            <img
                                                src={img.imageUrl}
                                                alt="Imagem do produto"
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                            <button
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                onClick={() => handleRemoveExistingImage(img)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhuma imagem cadastrada</p>
                                )}
                            </div>
                        </div>

                        {/* Imagens novas */}
                        <div className="mt-3">
                            <h6 className="text-sm font-medium text-gray-700">Novas imagens selecionadas:</h6>
                            <div className="flex flex-wrap gap-2">
                                {imageFiles.length > 0 ? (
                                    imageFiles.map((file, index) => (
                                        <div key={index} className="relative m-2">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Nova imagem"
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                            <button
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                onClick={() => handleRemoveNewImage(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhuma nova imagem selecionada</p>
                                )}
                            </div>
                        </div>

                        {/* Upload */}
                        <div className="mt-3">
                            <input
                                type="file"
                                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                                accept="image/*"
                                multiple
                                onChange={handleAddImages}
                            />
                        </div>
                    </div>

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
                            onClick={handleSave}
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UploadImageDialog;
